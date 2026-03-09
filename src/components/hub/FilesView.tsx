'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/lib/store';
import type { DropboxFile, FileCategory, FileContainer } from '@/lib/types';
import { getFileCategory, formatFileSize } from '@/lib/types';
import {
  Folder, File, Image as ImageIcon, FileText, Film, Music, Code, Archive, Upload,
  ChevronRight, Download, Trash2, Share2, Plus, X, RefreshCw, FolderPlus,
  ChevronDown, FileImage, FileVideo, FileAudio, FileCode, Eye, ExternalLink
} from 'lucide-react';

interface Props {
  folderId: string;
}

// File icon component based on type
function FileIcon({ category, size = 24 }: { category: FileCategory; size?: number }) {
  const iconProps = { size, className: "flex-shrink-0" };
  
  switch (category) {
    case 'image': return <ImageIcon {...iconProps} className="flex-shrink-0 text-green-400" />;
    case 'document': return <FileText {...iconProps} className="flex-shrink-0 text-blue-400" />;
    case 'video': return <Film {...iconProps} className="flex-shrink-0 text-purple-400" />;
    case 'audio': return <Music {...iconProps} className="flex-shrink-0 text-pink-400" />;
    case 'code': return <Code {...iconProps} className="flex-shrink-0 text-yellow-400" />;
    case 'archive': return <Archive {...iconProps} className="flex-shrink-0 text-orange-400" />;
    default: return <File {...iconProps} className="flex-shrink-0 text-slate-400" />;
  }
}

export function FilesView({ folderId }: Props) {
  const { isDarkTheme, addFileContainer, files, updateFileContainer, deleteFileContainer, addFileItem, deleteFileItem } = useStore();
  
  const [currentPath, setCurrentPath] = useState('');
  const [entries, setEntries] = useState<DropboxFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<DropboxFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pathHistory, setPathHistory] = useState<string[]>(['']);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current file container
  const currentContainer = files.find(f => f.folderId === folderId);

  // Fetch files from Dropbox
  const fetchFiles = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/dropbox/files?path=${encodeURIComponent(path)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch files');
      }
      
      setEntries(data.entries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath, fetchFiles]);

  // Navigate to folder
  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
    setPathHistory(prev => [...prev, path]);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Go back in path history
  const goBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = [...pathHistory];
      newHistory.pop();
      setPathHistory(newHistory);
      setCurrentPath(newHistory[newHistory.length - 1] || '');
    }
  };

  // Handle file click
  const handleFileClick = async (file: DropboxFile) => {
    if (file['.tag'] === 'folder') {
      navigateToFolder(file.path_display);
    } else {
      setSelectedFile(file);
      
      // Get shared link for preview
      try {
        const response = await fetch('/api/dropbox/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: file.path_display }),
        });
        const data = await response.json();
        
        if (data.url) {
          setPreviewUrl(data.url);
        }
      } catch (err) {
        console.error('Failed to get shared link:', err);
      }
    }
  };

  // Upload file
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', currentPath);

    try {
      const response = await fetch('/api/dropbox/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Refresh file list
      await fetchFiles(currentPath);
      setShowUploadModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/dropbox/create-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentPath, name: newFolderName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create folder');
      }

      await fetchFiles(currentPath);
      setShowNewFolderModal(false);
      setNewFolderName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  // Delete file/folder
  const handleDelete = async (file: DropboxFile) => {
    if (!confirm(`Delete "${file.name}"?`)) return;

    try {
      const response = await fetch('/api/dropbox/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file.path_display }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Delete failed');
      }

      await fetchFiles(currentPath);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  // Download file
  const handleDownload = (file: DropboxFile) => {
    const downloadUrl = `/api/dropbox/download?path=${encodeURIComponent(file.path_display)}`;
    window.open(downloadUrl, '_blank');
  };

  // Get share link
  const handleShare = async (file: DropboxFile) => {
    try {
      const response = await fetch('/api/dropbox/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file.path_display }),
      });
      const data = await response.json();
      
      if (data.url) {
        await navigator.clipboard.writeText(data.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const bg = isDarkTheme ? '#0f172a' : '#ffffff';
  const border = isDarkTheme ? '#1e293b' : '#e2e8f0';
  const textColor = isDarkTheme ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDarkTheme ? '#64748b' : '#94a3b8';
  const cardBg = isDarkTheme ? '#1e293b' : '#f8fafc';

  // Parse path for breadcrumb
  const pathParts = currentPath.split('/').filter(Boolean);

  return (
    <div className="flex h-full" style={{ background: bg }}>
      {/* File Browser */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: border }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <button
              onClick={() => navigateToFolder('')}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-700 transition-colors"
              style={{ color: isDarkTheme ? '#00BCD4' : '#0891b2' }}
            >
              <Folder size={16} />
              <span className="text-sm font-medium">Dropbox</span>
            </button>
            {pathParts.map((part, index) => (
              <div key={index} className="flex items-center gap-1">
                <ChevronRight size={14} className="text-slate-500" />
                <button
                  onClick={() => navigateToFolder('/' + pathParts.slice(0, index + 1).join('/'))}
                  className="px-2 py-1 rounded hover:bg-slate-700 transition-colors text-sm truncate max-w-[150px]"
                  style={{ color: textColor }}
                >
                  {part}
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {currentPath && (
              <button
                onClick={goBack}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                title="Go back"
              >
                <ChevronRight size={18} style={{ color: mutedColor }} className="rotate-180" />
              </button>
            )}
            <button
              onClick={() => fetchFiles(currentPath)}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} style={{ color: mutedColor }} />
            </button>
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ background: `${isDarkTheme ? '#1e293b' : '#f1f5f9'}`, color: mutedColor }}
            >
              <FolderPlus size={16} />
              <span className="hidden sm:inline">New Folder</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ background: '#00BCD420', color: '#00BCD4' }}
            >
              <Upload size={16} />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </div>

        {/* File Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw size={24} className="animate-spin text-cyan-400" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="text-4xl">❌</div>
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => fetchFiles(currentPath)}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              >
                Retry
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="text-5xl">📁</div>
              <p style={{ color: mutedColor }}>This folder is empty</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              >
                <Upload size={16} /> Upload files
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {entries.map((entry) => {
                const category = entry['.tag'] === 'folder' ? null : getFileCategory(entry.name);
                const isSelected = selectedFile?.id === entry.id;
                
                return (
                  <div
                    key={entry.id}
                    onClick={() => handleFileClick(entry)}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02]`}
                    style={{
                      background: isSelected ? '#00BCD420' : cardBg,
                      border: `1px solid ${isSelected ? '#00BCD450' : 'transparent'}`,
                    }}
                  >
                    {/* File/Folder Icon */}
                    <div className="flex flex-col items-center gap-2">
                      {entry['.tag'] === 'folder' ? (
                        <Folder size={48} className="text-cyan-400" />
                      ) : category ? (
                        <FileIcon category={category} size={48} />
                      ) : (
                        <File size={48} className="text-slate-400" />
                      )}
                      
                      <span 
                        className="text-xs text-center truncate w-full font-medium"
                        style={{ color: textColor }}
                      >
                        {entry.name}
                      </span>
                      
                      {entry['.tag'] === 'file' && entry.size && (
                        <span className="text-[10px]" style={{ color: mutedColor }}>
                          {formatFileSize(entry.size)}
                        </span>
                      )}
                    </div>

                    {/* Actions overlay */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,0,0,0.5)' }}
                    >
                      {entry['.tag'] === 'file' && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDownload(entry); }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            title="Download"
                          >
                            <Download size={16} className="text-white" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleShare(entry); }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            title="Share"
                          >
                            <Share2 size={16} className="text-white" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(entry); }}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      {selectedFile && previewUrl && selectedFile['.tag'] === 'file' && (
        <div 
          className="w-[400px] border-l flex flex-col overflow-hidden"
          style={{ borderColor: border, background: cardBg }}
        >
          {/* Preview Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: border }}>
            <span className="text-sm font-medium truncate" style={{ color: textColor }}>
              {selectedFile.name}
            </span>
            <button
              onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
              className="p-1 rounded hover:bg-slate-700"
            >
              <X size={16} style={{ color: mutedColor }} />
            </button>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-4">
            {getFileCategory(selectedFile.name) === 'image' ? (
              <img 
                src={previewUrl} 
                alt={selectedFile.name}
                className="max-w-full h-auto rounded-lg"
              />
            ) : getFileCategory(selectedFile.name) === 'video' ? (
              <video 
                src={previewUrl} 
                controls 
                className="max-w-full rounded-lg"
              />
            ) : getFileCategory(selectedFile.name) === 'audio' ? (
              <audio src={previewUrl} controls className="w-full" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <File size={64} style={{ color: mutedColor }} />
                <p className="text-sm" style={{ color: mutedColor }}>
                  Preview not available for this file type
                </p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                >
                  <ExternalLink size={16} /> Open in new tab
                </a>
              </div>
            )}
          </div>

          {/* Preview Footer */}
          <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: border }}>
            <button
              onClick={() => handleDownload(selectedFile)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-sm"
            >
              <Download size={16} /> Download
            </button>
            <button
              onClick={() => handleShare(selectedFile)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-600/50 hover:bg-slate-600 text-sm"
              style={{ color: textColor }}
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowUploadModal(false)}
        >
          <div 
            className="rounded-2xl p-6 w-full max-w-md"
            style={{ background: cardBg, border: `1px solid ${border}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
              Upload File
            </h3>
            
            <div 
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400 transition-colors"
              style={{ borderColor: border }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="mx-auto mb-3 text-cyan-400" />
              <p className="text-sm mb-1" style={{ color: textColor }}>
                Click to select a file
              </p>
              <p className="text-xs" style={{ color: mutedColor }}>
                or drag and drop
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleUpload}
              />
            </div>

            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => setShowUploadModal(false)}
              className="mt-4 w-full px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: isDarkTheme ? '#0f172a' : '#f1f5f9', color: mutedColor }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowNewFolderModal(false)}
        >
          <div 
            className="rounded-2xl p-6 w-full max-w-sm"
            style={{ background: cardBg, border: `1px solid ${border}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
              Create New Folder
            </h3>
            
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              className="w-full px-4 py-2 rounded-lg text-sm outline-none"
              style={{ 
                background: isDarkTheme ? '#0f172a' : '#f1f5f9',
                color: textColor,
                border: `1px solid ${border}`
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder(); }}
              autoFocus
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: isDarkTheme ? '#0f172a' : '#f1f5f9', color: mutedColor }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
