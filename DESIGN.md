# design.md: kantZ Workstation, Public Terminal UI

> Describes the END STATE of the public routes. Task order lives in `todo.md`. Permanent rules live in `agents.md`.
> Scope: everything under `src/routes/(public)/**`. Admin and login are out of scope.

---

## 1. Overview and Principles

**Product:** a developer portfolio presented as a terminal workstation. Visitors are recruiters, clients, and developers who have 10 to 30 seconds.

**Priority order when in conflict:** readability, then authenticity, then effects.

**Principles**

1. The terminal is an aesthetic and a power-user layer, not a navigation requirement. Every command has a clickable equivalent that is always visible.
2. Real routes, real URLs, real SSR. A command is a route change (`goto()`), nothing more.
3. Replace mode: each route replaces the output area. No scrollback accumulation. A `history` command lists visited routes.
4. Works without JavaScript: all navigation is plain `<a href>`. Commands, shortcuts, palette, and boot are enhancements.
5. Authentic over decorative: hierarchy, inverse video, spacing, and real data carry the design. No ornament.
6. Every number, hash, and date on screen is real.

---

## 2. Design Tokens

### 2.1 Palettes

Mapping: **dark = Midnight, light = Paper.** `mode-watcher` toggles class `dark` on `<html>`. Tokens are scoped to the wrapper `[data-ui='terminal']`.

| Token     | Midnight (dark) | Paper (light) | Use                                                                  |
| --------- | --------------- | ------------- | -------------------------------------------------------------------- |
| `bg`      | `#0b0f14`       | `#f6f4ee`     | page background                                                      |
| `surface` | `#111820`       | `#ece9e0`     | panels, code blocks, statusline                                      |
| `border`  | `#1f2a37`       | `#d4cfc2`     | 1px lines                                                            |
| `fg`      | `#d6deeb`       | `#24292f`     | primary text                                                         |
| `muted`   | `#8393a8`       | `#62625a`     | secondary text                                                       |
| `faint`   | `#6f8094`       | `#8a8a80`     | **decorative only**: line numbers, separators. Never essential text. |
| `accent`  | `#e6b450`       | `#8a5a00`     | prompt, active, inverse background, links on hover                   |
| `info`    | `#7aa2d4`       | `#1d5fa8`     | paths, links                                                         |
| `ok`      | `#8fbf7f`       | `#2f6f2f`     | `[live]`                                                             |
| `warn`    | `#e07b39`       | `#a14a00`     | `[wip]`                                                              |
| `danger`  | `#f0716b`       | `#b3261e`     | errors                                                               |
| `special` | `#b79ad6`       | `#6a3fa0`     | tags and categories                                                  |

Contrast (computed by hand, estimated; the agent must re-verify with a tool): `fg`, `muted`, `accent`, `info`, `ok`, `warn`, `danger`, `special` on `bg` are all at or above 4.5:1. `muted` on `surface` in Paper is about 5:1. Inverse text (`bg` on `accent`) is about 10:1 in Midnight and 5.4:1 in Paper. `faint` is about 3:1 or lower and therefore decorative only.

Accent is amber and `warn` is orange. Never use accent to mean warning.

### 2.2 CSS (foundation)

Scoped variable values go in `src/lib/components/terminal/terminal.css` (plain CSS). Tailwind registration and fonts go in `src/routes/layout.css` (additive only, do not change existing tokens).

```css
/* terminal.css: Paper is the base, Midnight overrides under .dark */
[data-ui="terminal"] {
  --t-bg: #f6f4ee;
  --t-surface: #ece9e0;
  --t-border: #d4cfc2;
  --t-fg: #24292f;
  --t-muted: #62625a;
  --t-faint: #8a8a80;
  --t-accent: #8a5a00;
  --t-info: #1d5fa8;
  --t-ok: #2f6f2f;
  --t-warn: #a14a00;
  --t-danger: #b3261e;
  --t-special: #6a3fa0;
}
.dark [data-ui="terminal"] {
  --t-bg: #0b0f14;
  --t-surface: #111820;
  --t-border: #1f2a37;
  --t-fg: #d6deeb;
  --t-muted: #8393a8;
  --t-faint: #6f8094;
  --t-accent: #e6b450;
  --t-info: #7aa2d4;
  --t-ok: #8fbf7f;
  --t-warn: #e07b39;
  --t-danger: #f0716b;
  --t-special: #b79ad6;
}
```

```css
/* additions to routes/layout.css */
@import "@fontsource/ibm-plex-mono/latin-400.css";
@import "@fontsource/ibm-plex-mono/latin-700.css";
@import "@fontsource/ibm-plex-sans/latin-400.css";
@import "@fontsource/ibm-plex-sans/latin-600.css";

@theme inline {
  --color-term-bg: var(--t-bg);
  --color-term-surface: var(--t-surface);
  --color-term-border: var(--t-border);
  --color-term-fg: var(--t-fg);
  --color-term-muted: var(--t-muted);
  --color-term-faint: var(--t-faint);
  --color-term-accent: var(--t-accent);
  --color-term-info: var(--t-info);
  --color-term-ok: var(--t-ok);
  --color-term-warn: var(--t-warn);
  --color-term-danger: var(--t-danger);
  --color-term-special: var(--t-special);
}
@theme {
  --font-term-mono:
    "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --font-term-sans:
    "IBM Plex Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

Utilities then read `bg-term-bg`, `text-term-fg`, `border-term-border`, `font-term-mono`. Font CSS is imported globally; browsers only download files that are used, so admin pays no cost. If `@fontsource-variable/*` variants exist for Plex and the agent prefers them, ask first (default: static weights as above).

### 2.2.1 Other tokens

| Item       | Value                                                                                |
| ---------- | ------------------------------------------------------------------------------------ |
| Spacing    | multiples of 4px only                                                                |
| Radius     | `0`. Maximum `2px` for kbd and tags. Never larger.                                   |
| Border     | `1px solid var(--t-border)`                                                          |
| Shadow     | none                                                                                 |
| Focus ring | `outline: 2px solid var(--t-accent); outline-offset: 2px` on every focusable element |
| Max width  | shell `100ch`, prose `72ch`                                                          |

---

## 3. Typography

| Role                                                  | Font      | Size / line-height    | Weight          |
| ----------------------------------------------------- | --------- | --------------------- | --------------- |
| Chrome, prompt, labels, tags, tables, statusline      | Plex Mono | 14px / 1.5            | 400             |
| Body in mono blocks (`KeyValue`, lists)               | Plex Mono | 15px / 1.6            | 400             |
| Headings (h1 20px, h2 16px, h3 15px)                  | Plex Mono | as listed / 1.4       | 700             |
| Long prose (rendered markdown on project detail only) | Plex Sans | 16px / 1.65, max 72ch | 400, strong 600 |
| Code                                                  | Plex Mono | 14px / 1.6            | 400             |

Rule: **mono to scan, sans to read.** Sans is used only inside `.md` prose. No text below 13px. No more than two families and four font files. No letter-spacing tricks, no uppercase paragraphs (uppercase only for table column headers).

---

## 4. Visual Language

All pure CSS and text. No decoration beyond this list.

1. **Inverse video:** `background: accent; color: bg`. For the active chip, the selected row, section labels in `Panel` titles when active, and the mode segment of the statusline.
2. **Block cursor:** a CSS `inline-block` the width of one `ch`, accent background, blinking at about 1.1s with `steps(1)`. Static under reduced motion. Shown after the prompt when the input is focused.
3. **Panel:** `<fieldset>` with `<legend>`. 1px border, legend sits on the top line. Lines are drawn by CSS, never by characters.
4. **Status tags:** literal brackets in text: `[live]` (ok), `[wip]` (warn), `[archived]` (muted). Tier tags: `T1`, `T2`, `T3`. Category tags: lowercase in `special`.
5. **`ls -l` table** for projects: real columns (see 9.2).
6. **`git log` timeline** for experience: node `*` in accent, vertical line by CSS border, 7-character hash from the real record `id`.
7. **Line-number gutter** only in fenced code blocks (`faint`).
8. **Three text levels:** `fg`, `muted`, `faint`. Use them instead of boxes.
9. **Statusline:** flat solid segments, see 8.2.

**Functional icons:** at most five inline SVGs (external link, copy, check, plus up to two more only if needed), from `@iconify-json/pixelarticons` (already in devDependencies). Copy the SVG paths into `components/terminal/TermIcon.svelte` (typed name map, `viewBox` from source, `fill="currentColor"`, `aria-hidden="true"`). Do not use the Iconify runtime. Verify the package `LICENSE` in `node_modules` and keep attribution if required. If an icon (for example a brand mark) does not exist, use a text label such as `[gh]`. Never use emoji.

**Never:** ASCII-art banners, glow, gradients, glassmorphism, shadows, rounded cards, emoji, typewriter effects on content, scanline or CRT effects, fake logs.

---

## 5. Architecture and Routing

- Shell: `src/routes/(public)/+layout.svelte` renders `<div data-ui="terminal">` containing `TerminalShell`. The layout never remounts between routes.
- Output: each route renders its content into the shell's output slot, wrapped in `OutputBlock`.
- Echo line: each `OutputBlock` shows a muted `$ <command>` header derived from the route (mapping lives in the registry).
- Prompt row at the top shows `kantz@workstation:<path>$` and the command input. Path comes from the route.
- Route map:

| Route              | Echo                            | Path in prompt      |
| ------------------ | ------------------------------- | ------------------- |
| `/`                | `whoami`                        | `~`                 |
| `/projects`        | `ls -l projects/`               | `~/projects`        |
| `/projects/[slug]` | `cat projects/<slug>/README.md` | `~/projects/<slug>` |
| `/skills`          | `skills`                        | `~/skills`          |
| `/experience`      | `git log`                       | `~/experience`      |
| `/contact`         | `contact`                       | `~/contact`         |
| any 404            | the typed or visited path       | `~`                 |

- **Data loading:** per route. `/` loads only the profile (static) and featured projects. `/skills`, `/experience`, `/projects` load their own data.
- **Caching:** `cache-control` is set **only in `+page.server.ts`**, never in a layout. Setting the same header twice throws in SvelteKit.
- **Layout data** for autocomplete: a light `getProjectSlugs()` (slug and title only) in `+layout.server.ts` with no cache header.
- Navigation uses `goto()` and plain anchors. `history` entries are stored in `sessionStorage` (max 20, real timestamps).

---

## 6. Boot Splash

- Duration **1.8s**. Only at `/` and only once per session (`sessionStorage` key `kantz-booted`).
- Skip: pointer down anywhere, or any key. Disabled completely under `prefers-reduced-motion`.
- Visitors arriving at a deep link (`/projects/x`) never see it.
- Implementation without flash and without hurting SEO:
  1. Overlay `.boot` is in the SSR HTML for `/` only.
  2. An inline script in `app.html` sets `data-booted` on `<html>` if the key exists or reduced motion is set; CSS hides `.boot` when that attribute is present.
  3. `<noscript><style>.boot{display:none}</style></noscript>` so it never blocks without JS.
  4. Page content stays in the DOM underneath.
  5. A failsafe timer removes the overlay at 1.8s even if hydration is slow.
- Content: real data only. App version from `package.json`, short commit hash, build date, injected via Vite `define` (`__APP_VERSION__`, `__COMMIT__`, `__BUILD_DATE__`; commit from `VERCEL_GIT_COMMIT_SHA`, fallback `dev`). Three to five lines, mono, no progress theatrics.

---

## 7. Command System

### 7.1 Registry (single source of truth)

One pure TypeScript file, `src/lib/terminal/commands.ts`, no Svelte imports. Used by help, chips, palette, autocomplete, shortcuts, echo lines, and the parser.

```ts
export interface CommandArg {
  name: string;
  optional: boolean;
  values?: readonly string[] | "slugs";
}

export interface Command {
  id: string;
  name: string;
  aliases: readonly string[];
  description: string;
  args?: CommandArg;
  route?: string; // navigation commands
  echo?: (params?: string) => string;
  shortcut?: readonly string[]; // key sequence, e.g. ['g', 'p']
  chip?: { label: string }; // present = shown in CommandChips
  action?: "theme" | "help" | "history" | "shortcuts" | "clear";
}

export type ParseResult =
  | { kind: "empty" }
  | { kind: "ok"; command: Command; arg?: string }
  | { kind: "bad-args"; command: Command; message: string }
  | { kind: "unknown"; input: string; suggestions: string[] };

export function parse(
  input: string,
  registry: readonly Command[],
  slugs: readonly string[],
): ParseResult;
```

### 7.2 Commands

| Command                           | Aliases | Effect                                                                              | Shortcut |
| --------------------------------- | ------- | ----------------------------------------------------------------------------------- | -------- |
| `whoami`                          | `about` | go `/`                                                                              | `g a`    |
| `projects`                        | `ls`    | go `/projects`                                                                      | `g p`    |
| `open <slug>`                     | -       | go `/projects/<slug>` (autocomplete from slugs)                                     | -        |
| `skills`                          | -       | go `/skills`                                                                        | `g s`    |
| `experience`                      | `log`   | go `/experience`                                                                    | `g e`    |
| `contact`                         | -       | go `/contact`                                                                       | `g c`    |
| `theme [midnight\|paper\|system]` | -       | `setMode()` from `mode-watcher`; no arg toggles; status message `theme: paper`      | `g t`    |
| `history`                         | -       | overlay listing visited routes this session                                         | -        |
| `shortcuts [on\|off]`             | -       | enable or disable global shortcuts, persisted in `localStorage` (`kantz-shortcuts`) | -        |
| `help`                            | `?`     | overlay listing registry with descriptions and shortcuts                            | `?`      |
| `clear`                           | -       | clears session history and statusline message, blurs overlays                       | `Ctrl+L` |
| `sudo`                            | -       | go `/login` (easter egg; do not make it the only path for the owner)                | -        |

Global keys: `/` or `:` focus the input, `Ctrl/Cmd+K` opens the palette, `Esc` closes overlays and blurs input, Up/Down walk input history, `Tab` autocompletes (command name, then argument).

### 7.3 Shortcut rules (WCAG 2.1.4)

- Active only when focus is not in `input`, `textarea`, `select`, or `contenteditable`, no modifier key is pressed, and no overlay is open.
- Sequences use the `g` prefix; the pending prefix shows in the statusline (`g-`) and times out after 1s.
- Single-key exceptions: `?`, `/`, `:`.
- Can be turned off with `shortcuts off`, also available as a visible control in the help overlay.

### 7.4 Unknown input

`command not found: <input>` in `danger`, followed by up to three closest command names (edit distance), and `type help or press ?`. Never throw, never navigate.

---

## 8. Components (`src/lib/components/terminal/`)

All use runes, snippets, and callback props. No component imports from `components/win98` or old public components.

### 8.1 Components

| Component        | Purpose and rules                                                                                                                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TerminalShell`  | Frame: optional titlebar (desktop only: a text title `kantz@workstation`, no fake window buttons), `Prompt` row, output slot as `<main id="main" tabindex="-1">`, `CommandChips`, `StatusBar`. `100ch` max, centered. |
| `Prompt`         | Renders `user@host:path$` from route. User `kantz`, host `workstation`. Path in `info`, `$` in `accent`.                                                                                                              |
| `CommandInput`   | Labeled input (visually hidden label "Command"), block cursor, history, Tab autocomplete, ghost suggestion in `faint`. Submits through `parse()`.                                                                     |
| `CommandChips`   | One chip per registry entry with `chip`. Real `<a href>` for route commands, `<button>` for actions. Active chip uses inverse video. Always visible.                                                                  |
| `CommandPalette` | `Ctrl/Cmd+K` overlay, `role="dialog"`, focus trap, fuzzy search over registry and project slugs, Enter runs, Esc closes.                                                                                              |
| `StatusBar`      | See 8.2.                                                                                                                                                                                                              |
| `OutputBlock`    | Echo line plus content. Owns the page `<h1>` (visually the command title).                                                                                                                                            |
| `Panel`          | `fieldset` and `legend`. Props: `title`, optional `active` (inverse legend).                                                                                                                                          |
| `KeyValue`       | Two-column `dl`; key `muted`, value `fg`; stacks on mobile.                                                                                                                                                           |
| `TreeList`       | `ls -l` table for projects (see 9.2). Semantic `<table>`.                                                                                                                                                             |
| `LogTimeline`    | `git log` list for experience.                                                                                                                                                                                        |
| `Tag`            | Inline `[text]` styled by role (`ok`, `warn`, `muted`, `special`).                                                                                                                                                    |
| `Kbd`            | Shortcut keycap: 1px border, radius 2px, mono 13px.                                                                                                                                                                   |
| `Markdown`       | Renders `renderMarkdown()` output inside `.md` scope with `{@html}` (sanitized by the parser).                                                                                                                        |
| `ImageViewer`    | Lightbox for `images[]`. Native `<dialog>`, keyboard (Left/Right/Esc), alt text required, lazy loading.                                                                                                               |
| `ErrorBlock`     | 404 and empty states in command style.                                                                                                                                                                                |
| `TermIcon`       | Inline SVG map from 4.                                                                                                                                                                                                |
| `BootSplash`     | See 6.                                                                                                                                                                                                                |

### 8.2 Statusline

Flat segments, solid backgrounds, left to right:

`MODE` | `path` | `loading` | `message` (flex, truncates) | `theme` | `clock`

- `MODE`: `INPUT` when the command input is focused, `NAV` otherwise, `KEYS OFF` when shortcuts are disabled. Inverse video.
- `loading`: shown while `navigating` (`$app/state`) is non-null. Replaces any progress bar.
- `message`: transient feedback (for example `email copied`, `theme: paper`), cleared after 3s. Replaces toasts. Announced via a visually hidden `aria-live="polite"` region.
- `clock`: local `HH:MM`, rendered after mount only (avoid hydration mismatch). The one live indicator.
- Mobile: path and clock hidden; mode, message, theme only.

---

## 9. Pages

Every page: one `<h1>`, `<svelte:head>` title and description, and a defined empty state. Titles use `<page> | kantZ Workstation`.

### 9.1 `/` (whoami)

- `KeyValue` from `PROFILE`: `name`, `alias`, `roles` (list), `education` (institution and status).
- `bio` as prose (Plex Sans, 72ch).
- `Panel` "featured" listing `getFeaturedProjects()` as compact rows linking to detail.
- A muted hint line: `type help or press ?`.
- Not rendered: birth data, age, email, phone (those belong to `/contact`).
- Empty featured: `no featured projects yet`.

### 9.2 `/projects` (ls -l)

Columns: `TIER` (`T1`), `STATUS` (`[live]`), `UPDATED` (`YYYY-MM-DD` from `updatedAt`), `NAME` (title; slug is the link). Tagline in `muted` on a second line. Sorted by `orderIndex` (data already ordered by server). Selected row (keyboard focus or hover) uses inverse video. Under 640px the table becomes stacked rows. Empty: `total 0`.

### 9.3 `/projects/[slug]` (cat README.md)

- `KeyValue`: `status`, `tier`, `category`, `stack` (`Tag` list from `technologies`), `live` and `source` links (from `liveUrl`, `githubUrl`; external-link icon; omit if null).
- `description` rendered by `Markdown` in sans.
- Images from `images[]` through `ImageViewer`; `thumbnailUrl` used for OG image. Images need real alt text derived from the title and index.
- Not found: `ErrorBlock` with `open: no such project: <slug>` and status 404 (use SvelteKit `error(404)`; the error page renders the same block).

### 9.4 `/skills`

One `Panel` per category (`languages`, `frameworks`, `databases`, `systems`, in that order), names as `Tag`s. **No levels, no bars, no icons**: the schema has no level data. Empty category is omitted.

### 9.5 `/experience` (git log)

`LogTimeline`: node `*`, hash = first 7 characters of record `id`, then `period`, `company`, `role`, `description`, and `highlights` as a `-` list. Sorted by `orderIndex`.

### 9.6 `/contact`

`KeyValue`: `email` (`mailto:` link, copy button writes to clipboard and posts `email copied` to the statusline), `whatsapp` (display text, `link`), `github`, `instagram`. These are the only place email and phone appear. External links open with `rel="noopener noreferrer"`.

### 9.7 404 / error

`ErrorBlock`: `command not found: <path>` plus up to three suggestions, chips below. Status code preserved.

---

## 10. Markdown

Parser: `src/lib/utils/markdown.ts`, pure function `renderMarkdown(raw: string): string`.

**Supported:** paragraphs, `###` and `####` headings (`#` and `##` are demoted to h3 to protect heading outline), unordered lists (`-`, `*`), ordered lists (`1.`), blockquote (`>`), fenced code (` ``` ` with optional language label), inline code, bold, italic, links.

**Not supported (rendered as plain escaped text):** raw HTML, images, tables, nested lists, HTML entities beyond escaping.

**Rules**

1. Escape `&`, `<`, `>`, `"`, `'` **before** parsing.
2. Output plain tags with **no classes and no inline styles**. All styling lives in a `.md` scope in CSS (map `@tailwindcss/typography` or hand-written rules to the terminal tokens).
3. Extract inline code and fenced code first so their contents are never parsed as bold or italic.
4. Italic requires non-space adjacent characters (`2 * 3 * 4` stays literal).
5. Links: only `http:`, `https:`, `mailto:`. Anything else renders as plain text. Output `rel="noopener noreferrer"`, and `target="_blank"` for http(s).
6. Fenced code blocks: line-number gutter via CSS counters, horizontally scrollable, `tabindex="0"` for keyboard scroll.
7. Prose class `.md` uses Plex Sans; code inside uses Plex Mono.

**Required unit tests (Vitest):** empty input; each block type; code containing `**x**`; `2 * 3 * 4`; `<script>` and `<img onerror>` input escaped; `javascript:` and `data:` link URLs rejected; quote injection in link text and URL (`" onmouseover="`); unterminated fence; list closing before heading; mixed list types.

---

## 11. Responsive Behavior

| Width         | Behavior                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| >= 1024px     | Shell centered at `100ch`, titlebar visible, chips under the prompt row.                                                                                                                                           |
| 640 to 1023px | No titlebar. Full statusline.                                                                                                                                                                                      |
| < 640px       | Chips become the primary nav: fixed bottom bar, horizontally scrollable, tap targets at least 44px, respects `env(safe-area-inset-bottom)`. Input stays available but secondary. Statusline compact. Tables stack. |

---

## 12. Accessibility

- Semantic landmarks: `<header>`, `<nav aria-label="Commands">` (chips), `<main id="main">`, skip link to `#main` as first focusable element.
- On route change: move focus to `<main>` and announce `<page title>` via the `aria-live="polite"` region.
- All interactive elements keyboard reachable with the focus ring from 2.2.1.
- Color is never the only signal: status tags always include literal text (`[live]`).
- Overlays (`help`, `history`, `palette`, `ImageViewer`): focus trap, Esc closes, focus returns to the trigger.
- `prefers-reduced-motion`: no blinking cursor, no boot, no transitions.
- Shortcut rules from 7.3.
- Minimum text contrast 4.5:1 (except `faint` decorative text). Re-verify with a tool for both themes.

---

## 13. SEO, Performance, Print

- **SEO:** per-route `<title>`, meta description, canonical, `og:title`, `og:description`, `og:image` (project `thumbnailUrl` on detail, a static default otherwise). Content is in SSR HTML.
- **Performance:** at most two font families and four font files; no animation libraries; no new runtime dependencies; no layout shift from fonts (`font-display: swap` and size-matched fallbacks if feasible). Images lazy and sized.
- **Print (`@media print`):** hide chips, statusline, input, boot; force Paper tokens; show external URLs next to link text; avoid page breaks inside `KeyValue` and log entries.

---

## 14. Do and Don't

| Do                                                     | Don't                                                      |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| Use inverse video for the single active/selected thing | Highlight many things at once                              |
| Use `fg`, `muted`, `faint` for hierarchy               | Add boxes and dividers to create hierarchy                 |
| Show real hashes, dates, versions                      | Invent logs, uptime, stats, "skill levels"                 |
| Keep radius 0 to 2px, 1px borders                      | Add shadows, gradients, glow                               |
| Write concrete copy ("Full-Stack Web Engineer")        | Write filler ("passionate developer crafting experiences") |
| Keep chips visible and clickable                       | Make typing the only way to navigate                       |
| Put feedback in the statusline                         | Add floating toasts or progress bars                       |

### Review checklist (agent self-check before reporting)

- [ ] No emoji or pictographic symbol anywhere (grep for non-ASCII in changed files).
- [ ] No file in `src/routes/admin/**` or `src/routes/login/**` changed outside named tasks.
- [ ] All colors come from tokens; no hard-coded hex outside `terminal.css`.
- [ ] No data rendered that is not in the schema, `PROFILE`, or build info.
- [ ] No birth date, birth place, or age rendered anywhere.
- [ ] Every command has a clickable equivalent.
- [ ] Both themes checked (Midnight and Paper) at 360px and 1280px wide.
- [ ] Keyboard-only walkthrough of every page and overlay.
- [ ] `check`, `lint`, `test:unit` pass; `build` passes where required.
