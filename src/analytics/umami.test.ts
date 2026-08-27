import { afterEach, vi } from 'vitest';
import {
  analyticsEvents,
  getUmamiDomains,
  identifySession,
  installUmami,
  isUmamiConfigured,
  resetUmamiClient,
  trackEvent,
  umamiEventAttrs,
} from './umami';

afterEach(() => {
  vi.unstubAllEnvs();
  resetUmamiClient();
  document.getElementById('umami-analytics')?.remove();
  delete window.umami;
});

describe('umami helpers', () => {
  it('builds click-tracking data attributes', () => {
    expect(umamiEventAttrs(analyticsEvents.telegramBot, { source: 'hero' })).toEqual({
      'data-umami-event': 'telegram_bot',
      'data-umami-event-source': 'hero',
    });
  });

  it('stays disabled without a website id', () => {
    vi.stubEnv('VITE_UMAMI_WEBSITE_ID', '');
    expect(isUmamiConfigured()).toBe(false);
    installUmami();
    expect(document.getElementById('umami-analytics')).toBeNull();
  });

  it('injects the tracker once and defaults to production hostnames', () => {
    vi.stubEnv('VITE_UMAMI_WEBSITE_ID', 'website-id');
    vi.stubEnv('VITE_UMAMI_SCRIPT_URL', '');
    vi.stubEnv('VITE_UMAMI_DOMAINS', '');

    expect(getUmamiDomains()).toBe('shop.beerwolf.site');
    installUmami();
    installUmami();

    const scripts = document.querySelectorAll('#umami-analytics');
    expect(scripts).toHaveLength(1);
    const script = scripts[0];
    expect(script).toHaveAttribute('src', 'https://cloud.umami.is/script.js');
    expect(script).toHaveAttribute('data-website-id', 'website-id');
    expect(script).toHaveAttribute('data-domains', 'shop.beerwolf.site');
    expect(script).toHaveAttribute('data-do-not-track', 'true');
  });

  it('queues events until the tracker is ready', () => {
    vi.stubEnv('VITE_UMAMI_WEBSITE_ID', 'website-id');
    const track = vi.fn();
    const identify = vi.fn();

    trackEvent(analyticsEvents.contactFormSuccess, { locale: 'en' });
    identifySession({ locale: 'ru' });

    window.umami = { track, identify };
    installUmami();
    document.getElementById('umami-analytics')?.dispatchEvent(new Event('load'));

    expect(track).toHaveBeenCalledWith('contact_form_success', { locale: 'en' });
    expect(identify).toHaveBeenCalledWith({ locale: 'ru' });
  });
});
