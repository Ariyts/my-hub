import type { ReactElement } from "react";

// Strip markdown storage metadata (HTML comments and null placeholders) from display text
export function stripMdMetadata(text: string): string {
  if (!text) return "";
  return text
    .replace(/<!--\s*(section|cmd|prompt):\s*\{.*?\}\s*-->/g, "")
    .replace(/_null_/g, "")
    .trim();
}

export function cleanDescription(desc: string | undefined): string | undefined {
  if (!desc) return undefined;
  const cleaned = stripMdMetadata(desc);
  return cleaned || undefined;
}

// Lightweight syntax highlighter — token-based, no deps.
export function highlightSyntax(code: string): ReactElement {
  const keywords = new Set([
    "git",
    "npm",
    "docker",
    "kubectl",
    "cd",
    "ls",
    "cat",
    "echo",
    "export",
    "import",
    "function",
    "const",
    "let",
    "var",
    "if",
    "else",
    "for",
    "while",
    "return",
    "sudo",
    "apt",
    "brew",
    "pip",
    "node",
    "python",
    "python3",
    "ssh",
    "scp",
    "systemctl",
    "nginx",
    "psql",
    "mysql",
    "redis-cli",
    "nmap",
    "ffuf",
    "gobuster",
    "feroxbuster",
    "hydra",
    "sqlmap",
    "nikto",
    "whatweb",
    "curl",
    "wget",
    "SELECT",
    "FROM",
    "WHERE",
    "INSERT",
    "UPDATE",
    "DELETE",
    "INTO",
    "OUTFILE",
    "use",
    "set",
    "run",
    "exploit",
    "search",
  ]);

  const tokens = code.split(/(\s+|'[^']*'|"[^"]*"|#[^\n]*)/g).filter(Boolean);

  return (
    <>
      {tokens.map((tok, i) => {
        if (/^['"][^'"]*['"]?$/.test(tok)) {
          return (
            <span key={i} className="text-emerald-300">
              {tok}
            </span>
          );
        }
        if (tok.startsWith("#")) {
          return (
            <span key={i} className="text-slate-500 italic">
              {tok}
            </span>
          );
        }
        if (/^--?[a-zA-Z][\w-]*$/.test(tok)) {
          return (
            <span key={i} className="text-amber-300">
              {tok}
            </span>
          );
        }
        if (/^<[a-zA-Z_][\w.]*>$/.test(tok)) {
          return (
            <span key={i} className="font-semibold text-cyan-300">
              {tok}
            </span>
          );
        }
        if (/^\d+$/.test(tok)) {
          return (
            <span key={i} className="text-orange-300">
              {tok}
            </span>
          );
        }
        if (keywords.has(tok)) {
          return (
            <span key={i} className="font-medium text-violet-300">
              {tok}
            </span>
          );
        }
        return <span key={i}>{tok}</span>;
      })}
    </>
  );
}
