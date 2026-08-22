import enJson from './copy/en.json';
import ruJson from './copy/ru.json';
import projectsJson from './projects.json';
import settingsJson from './settings.json';
import {
  copySchema,
  projectSchema,
  settingsSchema,
  type Project,
  type SiteCopy,
  type SiteSettings,
} from './schema';

export const supportedLocales = ['en', 'ru'] as const;
export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = 'en';

export const copies: Record<Locale, SiteCopy> = {
  en: copySchema.parse(enJson),
  ru: copySchema.parse(ruJson),
};

export const projects: Project[] = projectSchema.array().parse(projectsJson.projects);
export const settings: SiteSettings = settingsSchema.parse(settingsJson);

export const isLocale = (value: string | null): value is Locale =>
  supportedLocales.some((locale) => locale === value);

export const getAssetUrl = (path: string): string => {
  const cleanPath = path.replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

export type { Project, SiteCopy, SiteSettings } from './schema';
