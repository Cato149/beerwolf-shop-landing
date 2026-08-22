/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public Formspree form endpoint; empty values keep the form in fallback mode. */
  readonly VITE_FORMSPREE_ENDPOINT?: string;
  /** Deployment base path: / locally and on beerwolf.site, /<repo>/ on GitHub Pages. */
  readonly VITE_BASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
