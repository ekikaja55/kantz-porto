# todo.md: Execution Plan

> Read `agents.md` and `design.md` first. One phase per session. Do not jump ahead.
> The agent never commits. At the end of every phase: stop, run gates, and report "Phase N complete, ready to commit" with changed files and gate output.
> `STOP IF` means: stop immediately, paste the exact command output, and wait for the user. Do not delete, adapt, or work around.

Standard gate (G): `npm run check` and `npm run lint` and `npm run test:unit -- --run`.
Build gate (B): `npm run build`.

---

## Phase 0: Baseline and Win98 removal

- [ ] 0.1 Run `git branch --show-current`. STOP IF it is `main`.
- [ ] 0.2 Run G and B on the untouched repo. Record failures that already exist. Do not fix them. Report them.
- [ ] 0.3 Read `src/routes/sandboxing/+page.server.ts`. Report what it does. STOP IF it contains logic that no other route has (data loading, actions, redirects); report it and wait.
- [ ] 0.4 Run `grep -rn "sandboxing" src/ svelte.config.js vite.config.ts playwright.config.ts e2e 2>/dev/null`. STOP IF any hit is outside `src/routes/sandboxing/` (links in Navbar, Footer, hooks, tests, e2e).
- [ ] 0.5 Run `grep -rn "components/win98" src/`. STOP IF any hit is outside `src/routes/sandboxing/` and `src/lib/components/win98/`.
- [ ] 0.6 Run `grep -rnE "win-(raised|sunken|pressed|etched|dither|selected|focus-dotted|prose|mono)|data-ui=.win98|win98-" src/`. STOP IF any hit is outside the two paths above (includes admin, login, markdown.ts; markdown.ts hits are expected and handled in Phase 3, report them instead).
- [ ] 0.7 Delete `src/routes/sandboxing/` and `src/lib/components/win98/`.
- [ ] 0.8 Run `grep -rn "win95fa" src/ package.json`. Report only. Do not remove the dependency yet (Phase 5).
- [ ] 0.9 Run G and B. Compare with 0.2. No new failures allowed.
- [ ] 0.10 Report "Phase 0 complete, ready to commit".

---

## Phase 1: Foundation

Pre-approved dependencies (exact): `@fontsource/ibm-plex-mono`, `@fontsource/ibm-plex-sans`. Nothing else.

- [ ] 1.1 `npm i @fontsource/ibm-plex-mono @fontsource/ibm-plex-sans`. Check each package ships `latin-400.css`, `latin-700.css` (mono) and `latin-400.css`, `latin-600.css` (sans). STOP IF a file is missing; report the available files. Verify each package `LICENSE` in `node_modules` (expected SIL OFL 1.1) and report.
- [ ] 1.2 Create `src/lib/components/terminal/terminal.css` and add the font imports and `@theme` blocks to `src/routes/layout.css` exactly as in `design.md` section 2.2. Do not edit existing tokens.
- [ ] 1.3 Verify contrast for all token pairs in both themes with a calculation script or tool (not by eye). Report the table. STOP IF any essential text pair is under 4.5:1; propose adjusted values and wait.
- [ ] 1.4 Add Vite `define` for `__APP_VERSION__`, `__COMMIT__`, `__BUILD_DATE__` and type them in `src/app.d.ts`. Commit source is `VERCEL_GIT_COMMIT_SHA` (first 7 chars), fallback `dev`.
- [ ] 1.5 Create `TermIcon.svelte` with the needed pixelarticons SVGs (design.md section 4). Verify license. Report which icons were found.
- [ ] 1.6 Build primitives: `Panel`, `Tag`, `Kbd`, `KeyValue`, `OutputBlock`, `ErrorBlock`. No data fetching inside them.
- [ ] 1.7 Build `Prompt`, `StatusBar` (all segments, `navigating` from `$app/state`, `aria-live` message region, clock after mount), `TerminalShell` (titlebar, output slot, skip link, mobile layout).
- [ ] 1.8 Replace `src/routes/(public)/+layout.svelte` with the terminal wrapper `data-ui="terminal"` and `TerminalShell`. Old pages may look broken during this phase; that is expected and not deployed.
- [ ] 1.9 Move mounts of `NavigationProgress` and `ToastContainer`:
  - Run `grep -rnE "toast|Toast" src/ --include=*.svelte --include=*.ts -l`. STOP IF any file under `src/lib/components/` that is used by `(public)` pages calls the toast store in a way the new UI still needs; report it.
  - Remove both from `src/routes/+layout.svelte` (leave `ModeWatcher`, favicon, `hydrated` effect untouched).
  - Mount both in `src/routes/admin/+layout.svelte`.
  - `src/routes/login` has no layout: create `src/routes/login/+layout.svelte` that mounts both and renders `children`.
  - Verify admin and login still render toasts and progress (manual check, report).
- [ ] 1.7b Add `.md` scope CSS placeholder file (empty rules allowed), imported by the future `Markdown` component.
- [ ] 1.10 Run G. Report "Phase 1 complete, ready to commit".

---

## Phase 2: Command system

- [ ] 2.1 Create `src/lib/terminal/commands.ts` (registry, types, `parse`) exactly per `design.md` section 7. Pure TS, no Svelte imports.
- [ ] 2.2 Unit tests for `parse`: empty input, each command and alias, `open` with valid and invalid slug, `theme` with valid and invalid arg, unknown input with suggestions, whitespace and case handling, no navigation on unknown.
- [ ] 2.3 Session history store (`src/lib/terminal/history.svelte.ts`): `sessionStorage`, max 20, real timestamps. Unit test where practical.
- [ ] 2.4 Shortcut engine (`src/lib/terminal/shortcuts.svelte.ts`): focus guard, modifier guard, `g`-sequence with 1s timeout, pending state exposed to `StatusBar`, persisted enable flag (`kantz-shortcuts`).
- [ ] 2.5 Build `CommandInput` (history Up/Down, Tab autocomplete, ghost suggestion, block cursor, reduced-motion static), `CommandChips`, `CommandPalette` (dialog, focus trap, fuzzy search), help and history overlays.
- [ ] 2.6 Wire `theme` to `setMode()` from `mode-watcher`; status message on change.
- [ ] 2.7 Add `getProjectSlugs()` to `src/lib/server/projects.ts` and `src/routes/(public)/+layout.server.ts`. STOP IF a `+layout.server.ts` already sets `cache-control` anywhere; do not add headers in layouts.
- [ ] 2.8 Wire `sudo` to `/login`. Wire `clear` per design.md.
- [ ] 2.9 Run G. Report "Phase 2 complete, ready to commit".

---

## Phase 3: Pages

- [ ] 3.1 Rewrite `src/lib/utils/markdown.ts` per `design.md` section 10 (no classes, no Win98 styles, safe links, code extraction first, fixes for italics). Add all required tests in `src/lib/unit-test/markdown.test.ts`. STOP IF any XSS test fails.
- [ ] 3.2 Build `Markdown` component and `.md` CSS scope (Plex Sans prose, mono code, gutter).
- [ ] 3.3 Build `TreeList`, `LogTimeline`, `ImageViewer`.
- [ ] 3.4 `/` page: rewrite `+page.server.ts` to load only `getFeaturedProjects()` (profile is static). Keep `cache-control` here. Use `PROFILE.bio.en` for now (flattened in Phase 5). Do not render `birthDate`, `birthPlace`, `age`, `email`, `whatsapp`.
- [ ] 3.5 `/projects` page with `cache-control` in its `+page.server.ts` (keep existing values).
- [ ] 3.6 `/projects/[slug]` page, 404 via `error(404)`, `ErrorBlock`, OG image from `thumbnailUrl`.
- [ ] 3.7 `/skills`: new `src/routes/(public)/skills/+page.server.ts` using `getSkills()`. Do not use the `icon` field.
- [ ] 3.8 `/experience`: new `+page.server.ts` using `getExperiences()`.
- [ ] 3.9 `/contact`: static data from `PROFILE` (email, whatsapp, github, instagram), copy button with statusline message.
- [ ] 3.10 Global `+error.svelte` for public 404s using `ErrorBlock` with suggestions. STOP IF an existing root `+error.svelte` is used by admin; scope the new one under `(public)` instead.
- [ ] 3.11 Per-route `<svelte:head>` title and description. Empty states for every page per `design.md`.
- [ ] 3.12 Manual check at 360px and 1280px in both themes. Report any deviations from `design.md`.
- [ ] 3.13 Run G. Report "Phase 3 complete, ready to commit".

---

## Phase 4: Polish

- [ ] 4.1 `BootSplash` per `design.md` section 6 (inline script in `app.html`, SSR overlay on `/`, noscript fallback, skip on pointer or key, failsafe timer, reduced-motion off). STOP IF `app.html` already has an inline theme script; report it.
- [ ] 4.2 Accessibility pass: skip link, focus move and announcement on navigation, overlay focus traps, color-independent status, keyboard-only walkthrough. Report findings.
- [ ] 4.3 SEO: canonical, OG tags, default OG image for non-project routes. Optional (only if the user approves): `sitemap.xml` route.
- [ ] 4.4 `@media print` per design.md.
- [ ] 4.5 Reduced-motion audit: cursor, boot, transitions.
- [ ] 4.6 Non-ASCII audit: `grep -rnP "[^\x00-\x7F]" src/lib/components/terminal src/routes/\(public\)`. STOP IF any emoji or pictographic hit; remove it. (Legitimate non-ASCII in user data is not in source.)
- [ ] 4.7 Run G and B. Report "Phase 4 complete, ready to commit".

---

## Phase 5: Legacy removal (every step has a stop gate)

Each step: grep first, show output, delete only if the STOP IF condition is false, then run G (and B after deletions).

- [ ] 5.1 **Performance Mode.**
      `grep -rniE "performance(toggle|\.svelte)|stores/performance|performanceMode" src/ -l`.
      STOP IF any hit is in `src/routes/admin/**` or `src/routes/login/**`.
      Remove `PerformanceToggle.svelte` and `stores/performance.svelte.ts` and their remaining references.
- [ ] 5.2 **Old public components.**
      For each of `Hero`, `Navbar`, `Footer`, `MobileNavDock`, `ProjectCard`, `FeaturedProjects`, `SkillsMatrix`, `ExperienceTimeline`, `ContactSection`: `grep -rn "components/<Name>" src/`.
      STOP IF any hit is in `src/routes/admin/**` or `src/routes/login/**`, or outside the component's own file and other components on this deletion list.
      Then delete the files.
      Do not touch `Modal`, `ToastContainer`, `Skeleton`, `ThemeToggle`, `NavigationProgress` here.
- [ ] 5.3 **i18n removal.**
      `grep -rnE "i18n|LangToggle|params/lang|\\\$lang|lang=lang" src/ svelte.config.js -l`.
      STOP IF any hit is in `src/routes/admin/**` or `src/routes/login/**`, `hooks.server.ts`, or `svelte.config.js`; report each.
      Otherwise: replace remaining string lookups with English literals, delete `src/lib/i18n/`, `LangToggle.svelte`, `src/params/lang.ts`, and any `lang` handling.
- [ ] 5.4 **Profile type (privacy and i18n).**
      Edit `src/lib/constants/profile.ts`: remove `birthPlace`, `birthDate`, `age`; make `bio` a single English `string`; make `education.status` English only. Fix all references. Update tests.
      STOP IF any reference exists in admin or login.
- [ ] 5.5 **Skill icon (code first).**
      `grep -rniE "\bicon\b" src/routes/admin/skills src/lib/server/cms.ts src/lib/server/cms-seed.ts src/lib/unit-test/cms.test.ts src/lib/server/db/schema.ts`.
      Remove the field from the admin skills form, load and action code, seed, and tests. Leave the `icon` column in `schema.ts` and the database untouched for now.
      STOP IF removing it requires changes to other admin behavior; report.
- [ ] 5.6 **Orphan dependencies.**
      For each of `@fontsource/win95fa`, `@fontsource/cousine`, `@fontsource/gelasio`, `@fontsource/syne`, `@fontsource-variable/plus-jakarta-sans`, `@fontsource/geist-mono`, `@iconify/svelte`, `@iconify-json/solar`: grep `src/` and config files for the package name and for the font-family or icon-prefix it provides.
      Remove from `package.json` only packages with zero hits.
      STOP IF a package is still referenced by admin, login, or `layout.css`; for `layout.css`, report and do not edit admin-affecting tokens (admin still uses `--font-sans` and `--font-display` if grep shows it).
      Keep `@iconify-json/pixelarticons` (used as the SVG source, devDependency).
- [ ] 5.7 **Database column (needs the user).**
      Remove `icon` from `src/lib/server/db/schema.ts`, run `npm run db:generate`, and show the generated migration. **Do not run `db:migrate` or `db:push`.** Report: "Migration ready for review; apply manually after backup."
- [ ] 5.8 Final audits: `grep -rn "win98\|win-mono\|Performance\|i18n" src/` should be empty (explain every remaining hit); non-ASCII audit as in 4.6.
- [ ] 5.9 Run G and B. Report "Phase 5 complete, ready to commit".
