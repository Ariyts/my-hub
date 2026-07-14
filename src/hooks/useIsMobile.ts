import { useEffect, useState } from "react";

// 768px — совпадает с брейкпоинтом `md` в Tailwind, чтобы CSS и JS не разъезжались
export const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

/**
 * true — ширина экрана меньше 768px (телефон, узкое окно).
 * Реагирует на ресайз и поворот устройства.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Значение могло измениться между первым рендером и подпиской
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
