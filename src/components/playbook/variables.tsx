import type { ReactElement } from 'react';
import type { PlaybookVariable } from '../../types';

export interface RenderedCommand {
  /** Final string with variables substituted */
  text: string;
  /** Original template (unchanged) */
  template: string;
  /** True if any $VAR was replaced with a real value */
  hasSubstitutions: boolean;
  /** Names of variables that were missing (used in template but not defined) */
  missingVars: string[];
}

// Match $VAR_NAME or ${VAR_NAME} — uppercase letters, digits, underscore
const VAR_REGEX = /\$\{([A-Z0-9_]+)\}|\$([A-Z0-9_]+)/g;

export function extractVariableNames(template: string): string[] {
  const names = new Set<string>();
  let m: RegExpExecArray | null;
  const re = new RegExp(VAR_REGEX.source, 'g');
  while ((m = re.exec(template)) !== null) {
    names.add(m[1] || m[2]);
  }
  return Array.from(names);
}

export function renderCommand(template: string, variables: PlaybookVariable[]): RenderedCommand {
  const varMap = new Map(variables.map((v) => [v.name, v]));
  const missingVars: string[] = [];
  let hasSubstitutions = false;

  const text = template.replace(VAR_REGEX, (_match, braced: string | undefined, plain: string | undefined) => {
    const name = braced || plain;
    if (!name) return _match;
    const v = varMap.get(name);
    if (v && v.value) {
      hasSubstitutions = true;
      return v.value;
    }
    if (!missingVars.includes(name)) missingVars.push(name);
    return _match; // leave as-is
  });

  return { text, template, hasSubstitutions, missingVars };
}

// Returns a ReactElement where substituted values are highlighted with the variable's color.
// Used in "engagement" mode to visually distinguish real values from the template.
export function highlightRendered(
  template: string,
  variables: PlaybookVariable[],
  baseRenderer: (segment: string) => ReactElement
): ReactElement {
  const varMap = new Map(variables.map((v) => [v.name, v]));

  // Build segments: array of { kind: 'text'|'var', value, varName? }
  type Seg = { kind: 'text' | 'var'; value: string; color?: string; varName?: string };
  const segments: Seg[] = [];
  let lastIndex = 0;
  const re = new RegExp(VAR_REGEX.source, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(template)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ kind: 'text', value: template.slice(lastIndex, m.index) });
    }
    const name = m[1] || m[2];
    if (!name) {
      segments.push({ kind: 'text', value: m[0] });
      lastIndex = m.index + m[0].length;
      continue;
    }
    const v = varMap.get(name);
    if (v && v.value) {
      segments.push({ kind: 'var', value: v.value, color: v.color || '#fbbf24', varName: name });
    } else {
      // Keep original placeholder
      segments.push({ kind: 'text', value: m[0] });
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < template.length) {
    segments.push({ kind: 'text', value: template.slice(lastIndex) });
  }

  // Render
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.kind === 'text') return <span key={i}>{baseRenderer(seg.value)}</span>;
        return (
          <span
            key={i}
            title={`$${seg.varName}`}
            style={{
              color: seg.color,
              background: `${seg.color}15`,
              borderBottom: `1px dashed ${seg.color}80`,
              borderRadius: 2,
              padding: '0 1px',
            }}
          >
            {seg.value}
          </span>
        );
      })}
    </>
  );
}
