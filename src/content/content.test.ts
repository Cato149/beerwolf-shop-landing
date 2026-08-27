import { copies, projects, settings, supportedLocales } from '.';
import { projectSchema } from './schema';

describe('editable content', () => {
  it('validates every supported locale', () => {
    expect(supportedLocales).toEqual(['en', 'ru']);
    expect(copies.en.hero.titleAccent).toContain('furry');
    expect(copies.ru.hero.titleAccent).toContain('фурри');
    expect(copies.en.nav.brand).toBe('Beerwolf');
    expect(copies.ru.nav.brand).toBe('Пиволк');
    expect(copies.en.common.me).toBe('ME');
    expect(copies.ru.common.me).toBe('Это я');
    expect(copies.en.common.telegramCta).toBe('Start commission');
    expect(copies.ru.contact.priceSticker).toBe('От $470');
  });

  it('keeps project ids unique and every project bilingual', () => {
    const ids = projects.map((project) => project.id);

    expect(new Set(ids).size).toBe(ids.length);
    projects.forEach((project) => {
      expect(project.translations.en.title).toBeTruthy();
      expect(project.translations.ru.title).toBeTruthy();
      expect(project.imageAlt.en).toBeTruthy();
      expect(project.imageAlt.ru).toBeTruthy();
      expect(project.translations.en.testimonial.quote).toBeTruthy();
      expect(project.translations.ru.testimonial.quote).toBeTruthy();
    });
  });

  it('provides a primary Telegram route and contact settings', () => {
    expect(settings.telegramBotUrl).toMatch(/^https:\/\/t\.me\//);
    expect(settings.personalSiteUrl).toMatch(/^https:\/\/beerwolf\.site\/?$/);
    expect(settings.email).toContain('@');
    expect(settings.socials.length).toBeGreaterThanOrEqual(2);
  });

  it('treats an empty liveUrl as a demo dossier', () => {
    const parsed = projectSchema.parse({
      ...projects[0],
      id: 'empty-url',
      liveUrl: '',
    });

    expect(parsed.liveUrl).toBeNull();
  });
});
