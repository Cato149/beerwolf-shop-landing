/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public Formspree form endpoint; empty values keep the form in fallback mode. */
  readonly VITE_FORMSPREE_ENDPOINT?: string;
  /** Deployment base path: / locally and on beerwolf.site, /<repo>/ on GitHub Pages. */
  readonly VITE_BASE_PATH?: string;
  /** Umami website UUID. Empty values skip loading the tracker. */
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  /** Tracker script URL. Defaults to Umami Cloud. */
  readonly VITE_UMAMI_SCRIPT_URL?: string;
  /** Comma-separated hostnames allowed to send events. Defaults to shop.beerwolf.site. */
  readonly VITE_UMAMI_DOMAINS?: string;
  /** Optional Umami API host when the script is served from a different origin. */
  readonly VITE_UMAMI_HOST_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
