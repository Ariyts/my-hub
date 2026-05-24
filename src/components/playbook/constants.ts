import type { PlaybookLanguage } from '../../types';

// Language color mapping — inspired by GitHub's linguist colors
export const LANG_COLORS: Record<PlaybookLanguage, string> = {
  bash: '#4CAF50',
  zsh: '#4CAF50',
  powershell: '#2196F3',
  cmd: '#FF9800',
  python: '#9C27B0',
  javascript: '#F7DF1E',
  sql: '#e44d26',
  yaml: '#f5c518',
  nginx: '#009639',
};

// Short labels for language badges
export const LANG_LABELS: Record<PlaybookLanguage, string> = {
  bash: 'BASH',
  zsh: 'ZSH',
  powershell: 'PS',
  cmd: 'CMD',
  python: 'PY',
  javascript: 'JS',
  sql: 'SQL',
  yaml: 'YAML',
  nginx: 'NGINX',
};

export const PLAYBOOK_LANGUAGES: PlaybookLanguage[] = [
  'bash', 'zsh', 'powershell', 'cmd',
  'python', 'javascript', 'sql', 'yaml', 'nginx',
];

// Section color palette (vibrant, good contrast on dark/light)
export const SECTION_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b',
];

// Brand accent
export const BRAND = '#00BCD4';

// Map service/playbook name → emoji icon for hero header
export function getServiceIcon(title: string): string {
  const t = title.toLowerCase();
  if (/\b(http|web|site|apache|nginx|iis|tomcat)\b/.test(t)) return '🌐';
  if (/\b(ssh|openssh)\b/.test(t)) return '🔐';
  if (/\b(smb|cifs|samba|netbios)\b/.test(t)) return '📁';
  if (/\b(ftp|sftp)\b/.test(t)) return '📤';
  if (/\b(mysql|mariadb|postgres|mssql|oracle|sql)\b/.test(t)) return '🗄️';
  if (/\b(redis|memcache)\b/.test(t)) return '⚡';
  if (/\b(dns|bind)\b/.test(t)) return '🧭';
  if (/\b(smtp|mail|pop3|imap)\b/.test(t)) return '✉️';
  if (/\b(sntp|ntp)\b/.test(t)) return '⏱️';
  if (/\b(snmp)\b/.test(t)) return '📡';
  if (/\b(rdp|rdpwrap|3389)\b/.test(t)) return '🖥️';
  if (/\b(kerberos|ldap|ad|active\s*dir)\b/.test(t)) return '🛡️';
  if (/\b(docker|kube|k8s)\b/.test(t)) return '🐳';
  if (/\b(wifi|wireless|wpa)\b/.test(t)) return '📶';
  if (/\b(api|rest|graphql)\b/.test(t)) return '🔌';
  return '🎯';
}

// Short "phase" tag derived from section title — helps visual scanning
export function getPhaseTag(title: string): string | null {
  const t = title.toLowerCase();
  if (/recon|enum|discover|scan/.test(t)) return 'RECON';
  if (/fuzz|brute|password/.test(t)) return 'FUZZ';
  if (/exploit|payload|rce|shell/.test(t)) return 'EXPLOIT';
  if (/post|priv|escalat|persist/.test(t)) return 'POST';
  if (/pivot|tunnel|forward/.test(t)) return 'PIVOT';
  if (/clean|report|exfil/.test(t)) return 'WRAP-UP';
  return null;
}
