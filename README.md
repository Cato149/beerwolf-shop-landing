# Beerwolf landing

An interactive bilingual poster-world for commissioning personal furry identity
websites. The public site is a static React application; editable content lives in
the repository and is managed through Decap CMS.

## Stack

- React 18, TypeScript and Vite
- GSAP + ScrollTrigger for coordinated motion
- Zod for runtime content validation
- Decap CMS with GitHub authentication via an OAuth proxy
- Vitest, Testing Library, Playwright and axe
- GitHub Actions, Caddy production hosting and GitHub Pages

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

# Deployment base path. Use / locally and on beerwolf.site.
# GitHub Pages sets this automatically from the repository name.
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

### GitHub authentication

GitHub OAuth always needs a client secret, so production login goes through a
small OAuth proxy. Never put that secret in the repository.

1. In GitHub, create an OAuth App (`Settings → Developer settings → OAuth Apps`).
2. Set the authorization callback URL to `https://<oauth-proxy>/callback`.
3. Deploy a Decap GitHub OAuth proxy (for example a Cloudflare Worker such as
   [decap-proxy](https://github.com/sterlingwes/decap-proxy)) and give it the
   GitHub Client ID and Client Secret.
4. Copy the public proxy origin to `public/admin/config.yml` as `base_url`.
5. Keep `auth_endpoint: /auth` unless the proxy uses a different login path.

CMS users need push access to `Cato149/beerwolf-shop-landing`. Editorial workflow
keeps content edits on reviewable branches before publication. Portfolio projects
use a Decap list widget, so they can be added, removed and drag-reordered.

Trade-off: Git-backed content is inexpensive, versioned and easy to roll back, but
every publication requires a CI build. It is deliberately not intended for live
inventory, customer data or a large media library.

## GitHub Actions

`.github/workflows/ci.yml` runs linting, type checks, unit tests and
desktop/mobile Playwright smoke tests on `main`, `develop`, feature branches and
pull requests.

Two production publishes run from `main` (or via **Actions → Run workflow**):

- `.github/workflows/deploy.yml` builds the site with `VITE_BASE_PATH=/` and
  publishes it to [beerwolf.site](https://beerwolf.site) through the existing
  Caddy container.
- `.github/workflows/pages.yml` builds the same site for GitHub Pages. The Pages
  action supplies the public path, which is `/beerwolf-shop-landing/` for the
  project site and `/` if a custom Pages domain is attached.

Add `VITE_FORMSPREE_ENDPOINT` as a GitHub Actions **variable** so production
builds can submit the contact form. Enable **Settings → Pages → Source:
GitHub Actions** once.

Development follows Gitflow: feature branches start from `develop`, are reviewed
there, and release changes move to `main`. Only `main` is deployed.

### Production server

The landing does not start its own web server. The existing Caddy container
serves files from `/root/caddy/site`, mounted into the container as `/srv`.

On each production deploy GitHub Actions:

1. Builds `dist/` and packs it as a release archive.
2. Uploads the archive over SSH to `193.104.57.96`.
3. Extracts it into
   `/root/caddy/site/beerwolf-releases/<commit>-<attempt>`.
4. Atomically switches the relative `beerwolf-current` symlink.
5. Validates and reloads Caddy, then checks `/healthz`.

The Caddy route lives in `deploy/beerwolf.caddy`. The workflow adds
`import beerwolf.caddy` to `/root/caddy/conf/Caddyfile` once.

Create a GitHub environment named `production` and add these secrets:

- `DEPLOY_SSH_KEY` — private SSH key that can log in as
  `root@193.104.57.96`
- `SSH_KNOWN_HOSTS` — pinned `known_hosts` line for the server

Generate the host line with the command below, then verify the fingerprint
over a trusted channel before saving it:

```bash
ssh-keyscan -H 193.104.57.96
```

To roll back, point the symlink at a previous release directory:

```bash
cd /root/caddy/site
ln -sfn beerwolf-releases/<release> beerwolf-current.next
mv -Tf beerwolf-current.next beerwolf-current
```

Caddy starts serving that release without restarting the container.

### GitHub Pages

The Pages workflow uploads `dist/` as a Pages artifact and deploys it with
`actions/deploy-pages`. The expected project URL is
`https://cato149.github.io/beerwolf-shop-landing/`.

`dist/404.html` is copied from `index.html` so unknown paths still load the
single-page app.

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
