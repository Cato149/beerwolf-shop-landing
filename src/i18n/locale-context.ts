import { createContext } from 'react';
import type { Locale, SiteCopy } from '../content';

export interface LocaleContextValue {
  locale: Locale;
  copy: SiteCopy;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);
