import { useState, useEffect } from 'react';
import { Save, RotateCcw, Eye, Edit3 } from 'lucide-react';
import { useStore } from '../../store';
import type { PlaybookContainer } from '../../types';
import { generateFullExport, autoDetect, validateParsed } from '../../utils/importExport';

interface Props {
  playbook: PlaybookContainer;
}

/**
 * Markdown View — read/edit the playbook as raw markdown.
 * Syncs changes back to the store on "Save" (with parse + merge).
 */
export function MarkdownView({ playbook }: Props) {
  const { updatePlaybookContainer, addPlaybookSection, addPlaybookItem, updatePlaybookSection } = useStore();

  const [markdown, setMarkdown] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  // Load markdown from playbook on mount / playbook change
  useEffect(() => {
    setMarkdown(generateFullExport(playbook));
    setDirty(false);
    setValidationMsg(null);
  }, [playbook.id]);

  const handleChange = (value: string) => {
    setMarkdown(value);
    setDirty(true);
    setSaveStatus('idle');
  };

  const handleSave = () => {
    try {
      const parsed = autoDetect(markdown);
      const result = validateParsed(parsed);
      if (!result.ok) {
        setValidationMsg(result.errors.join('; '));
        setSaveStatus('error');
        return;
      }

      // Replace mode — clear and re-add
      updatePlaybookContainer(playbook.id, {
        sections: [],
        subItems: [],
        variables: parsed.variables?.map((v) => ({
          id: 'var-' + Math.random().toString(36).slice(2, 10),
          name: v.name,
          value: v.value,
          description: v.description,
        })) || [],
      });

      // Add sections + items with slight delay for state to settle
      setTimeout(() => {
        for (const section of parsed.sections) {
          addPlaybookSection(playbook.id, section.title || 'Untitled');
        }

        setTimeout(() => {
          const current = useStore.getState().playbooks.find((p) => p.id === playbook.id);
          if (!current) return;

          for (const section of parsed.sections) {
            const match = (current.sections || []).find((s) => s.title === section.title);
            if (!match) continue;

            if (section.color) {
              updatePlaybookSection(playbook.id, match.id, { color: section.color });
            }

            for (const item of section.items) {
              addPlaybookItem(playbook.id, {
                command: item.command,
                description: item.description,
                language: item.language,
                tags: item.tags,
                isFavorite: item.isFavorite,
                sectionId: match.id,
              });
            }
          }

          setDirty(false);
          setSaveStatus('success');
          setValidationMsg(null);
          setTimeout(() => setSaveStatus('idle'), 2000);
        }, 50);
      }, 50);
    } catch (err) {
      setValidationMsg(`Parse error: ${(err as Error).message}`);
      setSaveStatus('error');
    }
  };

  const handleReset = () => {
    if (dirty && !confirm('Discard unsaved changes?')) return;
    setMarkdown(generateFullExport(playbook));
    setDirty(false);
    setValidationMsg(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-6 py-2 border-b border-slate-800 bg-slate-900/40">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            isEditing
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          {isEditing ? <Edit3 size={12} /> : <Eye size={12} />}
          {isEditing ? 'Editing' : 'Preview'}
        </button>

        <button
          onClick={handleSave}
          disabled={!dirty || !!validationMsg}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save size={12} />
          Save
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          <RotateCcw size={12} />
          Reset
        </button>

        {dirty && (
          <span className="text-[11px] text-amber-400 ml-2">● unsaved changes</span>
        )}

        {saveStatus === 'success' && (
          <span className="text-[11px] text-emerald-400 ml-2">✓ Saved</span>
        )}

        {saveStatus === 'error' && (
          <span className="text-[11px] text-red-400 ml-2">✕ {validationMsg}</span>
        )}

        <div className="flex-1" />

        <span className="text-[10px] text-slate-500">
          Edit directly in markdown. Save to sync back to the playbook.
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isEditing ? (
          <textarea
            value={markdown}
            onChange={(e) => handleChange(e.target.value)}
            spellCheck={false}
            className="w-full h-full p-6 bg-slate-950 text-slate-200 font-mono text-xs outline-none resize-none leading-relaxed"
          />
        ) : (
          <div className="p-6 max-w-4xl">
            <MarkdownPreview content={markdown} />
          </div>
        )}
      </div>
    </div>
  );
}

// Simple markdown preview renderer (headings, code blocks, lists)
function MarkdownPreview({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactElement[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let key = 0;

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        elements.push(
          <pre
            key={key++}
            className="my-2 p-3 rounded-lg bg-slate-900 border border-slate-800 overflow-x-auto"
          >
            <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">{codeLang}</div>
            <code className="text-xs text-slate-200 font-mono whitespace-pre">{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        // Open code block
        codeLang = line.slice(3).trim();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-2xl font-bold text-slate-100 mt-6 mb-3 first:mt-0">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-lg font-bold text-slate-100 mt-5 mb-2 pb-1 border-b border-slate-800">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('<!--')) {
      // Skip HTML comments
    } else if (line.trim()) {
      elements.push(
        <p key={key++} className="text-sm text-slate-300 my-1.5 leading-relaxed">
          {line}
        </p>
      );
    }
  }

  return <div>{elements}</div>;
}
