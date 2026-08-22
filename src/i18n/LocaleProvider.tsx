import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { copies, defaultLocale, isLocale, type Locale } from '../content';
import { LocaleContext } from './locale-context';

const STORAGE_KEY = 'beerwolf.locale';

const getStoredLocale = (): Locale => {
  if (typeof window === 'undefined') return defaultLocale;

  try {
    const storedLocale = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(storedLocale) ? storedLocale : defaultLocale;
  } catch {
    return defaultLocale;
  }
};

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);
  const copy = copies[locale] ?? copies[defaultLocale];

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    } catch {
      // The preference still works for this session when storage is unavailable.
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = copy.meta.title;

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    description?.setAttribute('content', copy.meta.description);
  }, [copy.meta.description, copy.meta.title, locale]);

  const contextValue = useMemo(() => ({ locale, copy, setLocale }), [copy, locale]);

  return (
    <LocaleContext.Provider value={contextValue}>{children}</LocaleContext.Provider>
  );
}
