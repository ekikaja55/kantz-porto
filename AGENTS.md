# Agent Operating Guidelines: kantz-porto

> Permanent engineering contract for AI coding agents working on this repository.
> Companion reference: `DESIGN.md` (public terminal UI specification). If they conflict, this file wins.

---

## 1. Core Technology Stack

- **Framework:** SvelteKit with Svelte 5, runes only (`$state`, `$derived`, `$props`, `$effect`).
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`), `@tailwindcss/typography`, `@tailwindcss/forms`.
- **Database and ORM:** PostgreSQL hosted on Supabase, accessed through the pooler `DATABASE_URL` with Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `postgres`). **No Supabase SDK.** Do not add `@supabase/*`.
- **Authentication:** Better Auth with the Drizzle adapter and SvelteKit cookie integration. Auth session lookup in `src/hooks.server.ts` is strictly scoped to `/admin`, `/login`, and `/api/auth` so public edge-cached routes never read auth cookies or query session tables.
- **Security and rate limiting:** Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`).
- **Deployment target:** Vercel via `@sveltejs/adapter-vercel`.

---

## 2. Dual-UI Architecture Boundaries

This repository maintains two intentionally isolated visual systems. Never mix their tokens, theming mechanisms, or icon runtimes:

1. **Public Terminal UI (`src/routes/(public)/**`, `src/lib/components/terminal/**`, `src/lib/terminal/**`):**
   - Scoped to `[data-ui="terminal"]` via `src/lib/components/terminal/terminal.css`.
   - Dark palettes only (`moonfly` default, `ayu` override) controlled by `<html data-term-theme="moonfly|ayu">` and persisted in `localStorage` (`kantz-theme`) via the inline script in `src/app.html`. Never use `data-theme` or `mode-watcher` in public code (`mode-watcher@1.1.0` overwrites `data-theme` on `<html>`).
   - Typography: IBM Plex Mono (`font-term-mono`) and IBM Plex Sans (`font-term-sans`, prose and bio only).
   - Iconography: inline SVGs in `TermIcon.svelte` only (sourced from `@iconify-json/pixelarticons`). No `@iconify/svelte` runtime on public routes.
   - Feedback and loading live in `StatusBar` (`role="status"` and `navigating` from `$app/state`). Never mount `ToastContainer` or `NavigationProgress` on public routes.
2. **Admin and Login (`src/routes/admin/**`, `src/routes/login/**`):**
   - Uses `mode-watcher` (class `.dark`), Tailwind neutral tokens (`--font-sans`, `--font-display`, `--font-mono` in `src/routes/layout.css`), `@iconify/svelte` (`solar:*`), and shared components (`Modal`, `ToastContainer`, `NavigationProgress`, `Skeleton`, `ThemeToggle`, `ProjectImageUploader`).
   - Never break or restyle admin/login when editing public UI.
3. **Root `src/routes/+layout.svelte`:**
   - Never remove or rename `document.body.dataset.hydrated = 'true'` (end-to-end tests rely on it). Never remove `<ModeWatcher />`.
   - Never recreate a root `src/routes/+layout.server.ts` that reads `locals.user` (it would leak session state into public cached HTML).
4. **Database Safety:**
   - Never run destructive database commands (`db:push`, `db:migrate`, drops) without explicit user approval. You may run `npm run db:generate` and present the SQL migration for manual review.
5. **Dependencies:**
   - Do not install new runtime dependencies without user approval.

---

## 3. Inviolable Design and Code Standards

1. **No emoji, no pictographic symbols.**
   - Forbidden anywhere: UI, source, comments, commit messages, docs. Allowed: plain ASCII (`>`, `$`, `*`, `[x]`, `|`, `-`, `+`).
2. **Svelte 5 runes only.**
   - No `export let`, `$:`, `createEventDispatcher`, `<slot />`, or legacy store patterns.
   - Never mutate reactive `$state` inside `$effect` without `untrack`, and never mutate state inside getters. Use `afterNavigate` for router lifecycle tracking.
3. **Modern GPU terminal craft vs. anti-slop restraint (public UI).**
   - **Allowed (token-driven, GPU-friendly):** subtle atmospheric radial canvas wash (`<10%` opacity from palette tokens), faint dot-matrix grid, `color-mix()` semantic surface tints, bounded micro-glow on active/focus/live elements, purposeful pure-CSS & View Transitions motion (cascade stagger, theme radial wipe, cursor spotlight sheen, living caret, hover micro-depth), and sharp terminal reticle accents (`0-2px` radius).
   - **Forbidden:** CRT scanlines, screen curvature, heavy glassmorphism blur, soft-shadow rounded SaaS cards, decorative orbs, bento filler, blocking typewriter effects on main content, external animation libraries, or hard-coded colors outside `terminal.css`.
   - No fake logs, fake stats, or invented numbers. Every value shown in the UI comes from real data (database, `PROFILE`, build defines, runtime, or visitor session).
   - Respect `prefers-reduced-motion` at all times (disable spatial motion and infinite loops while preserving legible color/state transitions).
4. **Language:** English only for all public UI copy, code, types, comments, and commit messages.
5. **Type safety:** strict TypeScript, no `any`.
6. **Colors come from tokens:** No hard-coded hex outside `terminal.css` (and standalone static fallback `src/error.html`).
7. **Privacy:** Never render private personal details (birth date, birth place, age); contact channels belong exclusively on `/contact`.

---

## 4. Verification Gates & Git Safety

Run before reporting code changes as done:

```bash
npm run check          # must be zero errors and zero warnings
npm run lint
npm run test:unit -- --run
```

Run `npm run build` after deleting files/dependencies or before commits. Run `npm run test:e2e` when UI flows change or when requested.

- **Git Safety:** Never commit, push, branch, or stash unless explicitly instructed by the user.
- **Svelte MCP:** Use the Svelte MCP server (`list-sections`, `get-documentation`) when runes behavior or SvelteKit patterns are ambiguous. Never generate playground links in repo files.
