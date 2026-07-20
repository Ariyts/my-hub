// ============================================================================
// Метаданные ссылки без единой точки отказа (Задача 2.5)
// ============================================================================
// Раньше title/favicon тянулись через единственный прокси api.allorigins.win —
// если он лежал, автозаполнение переставало работать целиком. Теперь:
//   • Favicon выводится НАПРЯМУЮ из домена (сервис иконок), без парсинга
//     страницы и без прокси — всегда доступен мгновенно.
//   • Title/description тянутся best-effort через ПУЛ CORS-прокси параллельно
//     (Promise.any): берём первый валидный ответ, allorigins — лишь один из
//     источников. Всё под общим таймаутом, поэтому автофетч не критичен.
//   • Результат кэшируется в localStorage (TTL), чтобы не дёргать сеть повторно.
// Ручной fallback остаётся: заголовок можно ввести/поправить вручную в форме.

export interface LinkMetadata {
  title?: string;
  description?: string;
  favicon?: string;
}

export function domainOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/** Фавикон по домену — детерминированный URL, не требует парсинга/прокси. */
export function faviconForDomain(domain: string): string {
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}

// ---- Кэш ------------------------------------------------------------------

const CACHE_PREFIX = "linkmeta:";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 дней

function readCache(url: string): LinkMetadata | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + url);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; meta: LinkMetadata };
    if (Date.now() - parsed.ts > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + url);
      return null;
    }
    return parsed.meta;
  } catch {
    return null;
  }
}

function writeCache(url: string, meta: LinkMetadata): void {
  try {
    localStorage.setItem(CACHE_PREFIX + url, JSON.stringify({ ts: Date.now(), meta }));
  } catch {
    /* переполнение/приватный режим — просто без кэша */
  }
}

// ---- Парсинг HTML ---------------------------------------------------------

function decodeEntities(text: string): string {
  try {
    const ta = document.createElement("textarea");
    ta.innerHTML = text;
    return ta.value;
  } catch {
    return text;
  }
}

function parseMeta(html: string): LinkMetadata {
  const pick = (re: RegExp): string | undefined => {
    const m = html.match(re);
    return m?.[1]?.trim() || undefined;
  };

  const title =
    pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    pick(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i) ||
    pick(/<title[^>]*>([^<]+)<\/title>/i);

  const description =
    pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);

  return {
    title: title ? decodeEntities(title) : undefined,
    description: description ? decodeEntities(description) : undefined,
  };
}

// ---- Пул прокси -----------------------------------------------------------
// Каждый возвращает «сырой» HTML целевой страницы с CORS-заголовками.
// Порядок не важен — используем Promise.any (первый успешный).
const HTML_PROXIES: ((u: string) => string)[] = [
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://thingproxy.freeboard.io/fetch/${u}`,
];

/** Первый успешно завершившийся промис; отклоняется, только если упали все.
 *  (Замена Promise.any — не требует lib es2021.) */
function firstSuccessful<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let pending = promises.length;
    if (pending === 0) {
      reject(new Error("no sources"));
      return;
    }
    let settled = false;
    for (const p of promises) {
      p.then(
        (value) => {
          if (!settled) {
            settled = true;
            resolve(value);
          }
        },
        () => {
          pending -= 1;
          if (pending === 0 && !settled) reject(new Error("all sources failed"));
        },
      );
    }
  });
}

async function fetchHtml(proxyUrl: string, signal: AbortSignal): Promise<string> {
  const res = await fetch(proxyUrl, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  // Отсекаем заведомо непарсимые/пустые ответы, чтобы Promise.any не «победил» мусором
  if (!text || !/<title|og:title|<meta/i.test(text)) throw new Error("no metadata in response");
  return text;
}

/**
 * Best-effort метаданные ссылки. Favicon доступен всегда (из домена); title/
 * description — если хоть один прокси ответил в пределах таймаута. Ошибки не
 * бросаются: при неудаче вернётся объект хотя бы с favicon.
 */
export async function fetchLinkMetadata(
  url: string,
  opts: { timeoutMs?: number } = {},
): Promise<LinkMetadata> {
  const { timeoutMs = 6000 } = opts;
  const favicon = faviconForDomain(domainOf(url));

  const cached = readCache(url);
  if (cached) return { ...cached, favicon: cached.favicon || favicon };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const html = await firstSuccessful(
      HTML_PROXIES.map((build) => fetchHtml(build(url), controller.signal)),
    );
    const meta: LinkMetadata = { ...parseMeta(html), favicon };
    writeCache(url, meta);
    return meta;
  } catch {
    // Все прокси упали/таймаут — автофетч не критичен
    return { favicon };
  } finally {
    clearTimeout(timer);
    controller.abort(); // отменяем проигравшие/висящие запросы
  }
}
