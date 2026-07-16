// Утилиты оболочки представления (Задача 0.C)

/** Домен из URL без www. При ошибке — исходная строка. */
export function domainOf(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
