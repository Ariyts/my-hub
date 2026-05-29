import { useState, useEffect } from 'react';

const HERO_KEY = 'pb:heroExpanded';
const CONTEXT_KEY = 'pb:contextExpanded';

export function useHeroState() {
  const [heroExpanded, setHeroExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HERO_KEY) === 'true';
    } catch { return false; }
  });

  const [contextExpanded, setContextExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem(CONTEXT_KEY) === 'true';
    } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(HERO_KEY, String(heroExpanded)); } catch { /* */ }
  }, [heroExpanded]);

  useEffect(() => {
    try { localStorage.setItem(CONTEXT_KEY, String(contextExpanded)); } catch { /* */ }
  }, [contextExpanded]);

  return {
    heroExpanded,
    setHeroExpanded,
    toggleHero: () => setHeroExpanded((v) => !v),
    contextExpanded,
    setContextExpanded,
    toggleContext: () => setContextExpanded((v) => !v),
  };
}
