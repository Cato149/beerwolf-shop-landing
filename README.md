# Beerwolf landing

An interactive bilingual poster-world for commissioning personal furry identity
websites. The public site is a static React application; editable content lives in
the repository and is managed through Decap CMS.

## Stack

- React 18, TypeScript and Vite
- GSAP + ScrollTrigger for coordinated motion
- Zod for runtime content validation
- Decap CMS with GitLab PKCE authentication
- Vitest, Testing Library, Playwright and axe
- GitLab CI/CD and GitLab Pages

No database or custom application server is required.

Visual language, tokens, type, components and change recipes live in
[`docs/DESIGN.md`](docs/DESIGN.md). Use it when adjusting color, type,
layout or motion so the poster-world stays consistent.

## Local setup

Requirements:

- Node.js 20 or newer is recommended (the dependency set also supports Node 18)
- npm 9 or newer

```bash
npm ci
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. Never commit `.env`; only the commented
`.env.example` belongs in Git.

### Environment variables

```dotenv
# Public Formspree endpoint used by the contact form.
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id

# Deployment base path. Use / locally/custom domains and /landing/ on GitLab Pages.
VITE_BASE_PATH=/
```

The Formspree endpoint is public by design. Configure spam controls and delivery
inside Formspree. If the endpoint is absent, the form is disabled and the site
openly directs visitors to Telegram or email instead of simulating success.

## Commands

```bash
npm run dev          # Vite development server
npm run build        # Type-check and production build
npm run preview      # Preview the production build
npm run lint         # ESLint
npm run format:check # Prettier verification
npm run typecheck    # TypeScript project checks
npm run test         # Unit/component tests
npm run test:e2e     # Playwright desktop/mobile checks
npm run check        # Main local quality gate
```

Install Playwright's browser once before the first E2E run:

```bash
npx playwright install chromium
```

## Content model

Public content is never embedded directly in section components:

- `src/content/copy/en.json` — English interface and page copy
- `src/content/copy/ru.json` — Russian interface and page copy
- `src/content/projects.json` — ordered portfolio dossiers and translations
- `src/content/settings.json` — Telegram, email and social links
- `src/content/schema.ts` — runtime validation and TypeScript models

English is the default locale. The EN/RU preference is persisted in localStorage.
To add another language:

1. Copy an existing locale JSON file and translate every field.
2. Add the locale code in `src/content/index.ts`.
3. Extend localized project fields and the Decap portfolio schema.
4. Add test assertions for the new locale.

Project media uploaded by the CMS is committed under `public/uploads`. Demo artwork
under `public/art` is original SVG placeholder material and can be replaced from
the CMS.

## Content studio (Decap CMS)

The admin shell is available at `/admin/`.

### Local CMS

Run the site and the Decap proxy in separate terminals:

```bash
npm run dev
npx decap-server
```

Then open `http://localhost:5173/admin/`. `local_backend: true` is intended only
for local editing.

### GitLab authentication

Production uses client-side PKCE, so there is no OAuth secret or auth server.

1. In GitLab, create a new OAuth application.
2. Set its redirect URI to the final admin URL, for example
   `https://beerwolf-shop.gitlab.io/landing/admin/`.
3. Disable **Confidential**.
4. Grant the `api` scope.
5. Copy the public Application ID to `public/admin/config.yml` as `app_id`.
6. Never put the GitLab client secret in the repository.

CMS users need write access to `beerwolf-shop/landing`. Editorial workflow keeps
content edits on reviewable branches before publication. Portfolio projects use a
Decap list widget, so they can be added, removed and drag-reordered.

Trade-off: Git-backed content is inexpensive, versioned and easy to roll back, but
every publication requires a GitLab build. It is deliberately not intended for
live inventory, customer data or a large media library.

## GitLab Pages

`.gitlab-ci.yml` runs linting, type checks, unit tests, a production build and
desktop/mobile Playwright smoke tests. The Pages job publishes `dist/` only from
the default branch.

For the GitLab project path, CI supplies:

```dotenv
# Project Pages sub-path.
VITE_BASE_PATH=/landing/
```

Change it to `/` when a custom domain is attached. Add
`VITE_FORMSPREE_ENDPOINT` as a GitLab CI/CD variable so production builds can
submit the contact form.

Development follows Gitflow: feature branches start from `develop`, are reviewed
there, and release changes move to `main`.

## Animation and accessibility

- GSAP is the only JavaScript animation runtime.
- Pointer movement writes CSS variables directly inside animation frames rather
  than causing React renders.
- The archive is a scrubbed physical card stack on wide screens and a shorter
  stacked reveal on touch/mobile layouts.
- `prefers-reduced-motion` removes pinned/scrubbed travel and leaves every dossier
  visible in normal document flow.
- Keyboard focus, semantic landmarks, labels, status announcements, contrast and
  touch target sizes are part of the automated/manual review.
- Decorative grain, glows, ribbons and pixel glyphs ignore pointer input and are
  hidden from assistive technology.

When replacing assets, prefer SVG, AVIF or WebP, include accurate localized alt
text, and provide intrinsic dimensions to avoid layout shifts.
