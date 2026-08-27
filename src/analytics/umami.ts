const DEFAULT_SCRIPT_URL = 'https://cloud.umami.is/script.js';
const DEFAULT_DOMAINS = 'shop.beerwolf.site';
const SCRIPT_ID = 'umami-analytics';
const QUEUE_LIMIT = 20;

/** Event names stay under Umami's 50-character limit. */
export const analyticsEvents = {
  telegramBot: 'telegram_bot',
  personalSite: 'personal_site',
  contactEmail: 'contact_email',
  socialLink: 'social_link',
  contactFormInvalid: 'contact_form_invalid',
  contactFormError: 'contact_form_error',
  contactFormSuccess: 'contact_form_success',
  pageLeave: 'page_leave',
  languageSwitch: 'language_switch',
  sectionView: 'section_view',
  archiveSelect: 'archive_select',
  archiveProject: 'archive_project',
  skipToContact: 'skip_to_contact',
} as const;

export type AnalyticsEventData = Record<string, string | number | boolean>;

type QueuedCall =
  | { kind: 'event'; name: string; data?: AnalyticsEventData }
  | { kind: 'identify'; data: AnalyticsEventData };

const queue: QueuedCall[] = [];

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number | boolean>) => void;
      identify?: (data: Record<string, string | number | boolean>) => void;
    };
  }
}

export const getUmamiWebsiteId = () =>
  import.meta.env.VITE_UMAMI_WEBSITE_ID?.trim() ?? '';

export const getUmamiScriptUrl = () =>
  import.meta.env.VITE_UMAMI_SCRIPT_URL?.trim() || DEFAULT_SCRIPT_URL;

export const getUmamiDomains = () =>
  import.meta.env.VITE_UMAMI_DOMAINS?.trim() || DEFAULT_DOMAINS;

export const getUmamiHostUrl = () => import.meta.env.VITE_UMAMI_HOST_URL?.trim() ?? '';

export const isUmamiConfigured = () => getUmamiWebsiteId().length > 0;

/**
 * Click-tracking attributes for outbound links. Umami binds these without extra JS.
 * Values are stored as strings; use `trackEvent` when types matter.
 */
export const umamiEventAttrs = (name: string, data?: Record<string, string>) => {
  const attrs: Record<string, string> = { 'data-umami-event': name };

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      attrs[`data-umami-event-${key}`] = value;
    }
  }

  return attrs;
};

const flushQueue = () => {
  if (!window.umami) return;

  while (queue.length > 0) {
    const call = queue.shift();
    if (!call) return;

    if (call.kind === 'identify') {
      window.umami.identify?.(call.data);
      continue;
    }

    window.umami.track(call.name, call.data);
  }
};

const enqueue = (call: QueuedCall) => {
  if (queue.length >= QUEUE_LIMIT) queue.shift();
  queue.push(call);
};

export const resetUmamiClient = () => {
  queue.length = 0;
};

export const trackEvent = (name: string, data?: AnalyticsEventData) => {
  if (!isUmamiConfigured() || typeof window === 'undefined') return;

  if (window.umami?.track) {
    window.umami.track(name, data);
    return;
  }

  enqueue({ kind: 'event', name, data });
};

export const identifySession = (data: AnalyticsEventData) => {
  if (!isUmamiConfigured() || typeof window === 'undefined') return;

  if (window.umami?.identify) {
    window.umami.identify(data);
    return;
  }

  enqueue({ kind: 'identify', data });
};

/** Injects the tracker once. No-op when the website id is missing (local/CI). */
export const installUmami = () => {
  if (typeof document === 'undefined' || !isUmamiConfigured()) return;
  if (document.getElementById(SCRIPT_ID)) {
    flushQueue();
    return;
  }

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.defer = true;
  script.src = getUmamiScriptUrl();
  script.dataset.websiteId = getUmamiWebsiteId();
  // Hostnames that may send events. Localhost and GitHub Pages stay out by default.
  script.dataset.domains = getUmamiDomains();
  script.dataset.doNotTrack = 'true';

  const hostUrl = getUmamiHostUrl();
  if (hostUrl) script.dataset.hostUrl = hostUrl;

  script.addEventListener('load', flushQueue);
  document.head.appendChild(script);
};
