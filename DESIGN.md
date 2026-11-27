# design.md: kantZ Workstation, Public Terminal UI

> Single source of truth for the public portfolio UI under `src/routes/(public)/**`.
> Permanent engineering rules live in `AGENTS.md`. Admin and login are out of scope.

---

## 1. Overview and Principles

**Product:** a developer portfolio presented as a working terminal. Visitors are recruiters, clients, and developers who may have only 10 to 30 seconds.

**Priority order when in conflict:** readability, then authenticity, then effects.

**Principles**

1. Type first. The command input is always at the bottom and is the primary interaction. Clicking is always available as an equivalent (tab strip on desktop, drawer on mobile).
2. Real routes, real URLs, real SSR. A navigation command is a route change (`goto()`), nothing more. Deep links and the back button work normally.
3. Scrollback is for light commands only. Navigation commands reset it and replace the page output.
4. Works without JavaScript: all navigation is plain `<a href>`. Typing, history, completion, theme switching, and animation are enhancements.
5. No emulation: no filesystem, no pipes, no `cd`. Only commands from the registry.
6. Authentic over decorative: hierarchy, inverse video, spacing, and real data carry the design.
7. Every number, hash, date, and name on screen is real.

---

## 2. Layout and Architecture

### 2.1 Anatomy

Full-width flush-left terminal canvas (`px-4 sm:px-8 lg:px-10`), with long prose (`bio` and `.md`) bounded to `max-w-[72ch]` for readability. Dock bars run edge-to-edge across the viewport. **No titlebar.**

```
+--------------------------------------------------------------+
| (skip links, visually hidden until focused)                  |
| MOTD (only on /, preceded by ~1.1s first-visit boot overlay) |
| $ about_me                                                   |
| (page output, flush-left, rendered by the route, SSR)        |
| $ help                                                       |
| (appended block from an inline command)                      |
| kantz@workstation:~$ _                                       | <- inline flowing prompt inside <main>
|                                                              |
+--------------------------------------------------------------+ <- sticky bottom tmux chrome
| [-] about_me projects skills experience contact | theme help clear | tab strip (>= 768px)
| kantz | [$] | ~ | loading | message              ayu | 14:32 | statusline (edge-to-edge)
+--------------------------------------------------------------+
```

Below 768px: no tab strip. The sticky statusline shows `[menu]` (opens the drawer above the statusline) and `[$]` (jumps to and focuses the inline prompt). Below 640px, the prompt omits the `kantz@workstation:` host prefix and truncates long paths (`max-w-[42vw]`) to prevent horizontal overflow at 360px.

### 2.2 Scrolling

- **The document scrolls** (not an inner container). The dock uses `position: sticky; bottom: 0`.
- The page is a flex column with `min-height: 100dvh` and `main` as `flex: 1`, so the dock sits at the viewport bottom even on short pages.
- The dock bottom padding includes `env(safe-area-inset-bottom)`.
- `app.html` viewport meta includes `interactive-widget=resizes-content`.
- After an inline command appends blocks, scroll the first new block (its echo line) into view with `block: 'start'` and `behavior: 'instant'`.

### 2.3 Route map

| Route              | Echo line       | Prompt path         |
| ------------------ | --------------- | ------------------- |
| `/`                | `about_me`      | `~`                 |
| `/projects`        | `projects`      | `~/projects`        |
| `/projects/[slug]` | `open <slug>`   | `~/projects/<slug>` |
| `/skills`          | `skills`        | `~/skills`          |
| `/experience`      | `experience`    | `~/experience`      |
| `/contact`         | `contact`       | `~/contact`         |
| any 404            | `<visited path>`| `~`                 |

The prompt string is `kantz@workstation:<path>$` (compact `<path>$` below 640px). The path comes from the route. The echo line is rendered by the page (SSR) as `$ <echo>`, matching the canonical command name 1:1 regardless of whether the visitor typed an alias or clicked a link.

### 2.4 Scrollback model

- The page output (echo line plus content) always comes first and is rendered by the route.
- Inline commands (`help`, `theme`, `history`, `clear`, errors, tab-completion candidates) append blocks **after** the page output. Each appended block is an echo line `$ <what was typed>` plus its output.
- **Navigation commands** (and strip or drawer clicks) call `goto()`. After navigation completes (`afterNavigate`), all appended blocks are discarded.
- `clear` removes appended blocks only. The page output is the route itself and stays.
- Appended blocks live in a client-side store (`scrollback.svelte.ts`). They are not in the URL and not in SSR.

### 2.5 Data, caching, and auth isolation

- Per-route loading. `/` loads only featured projects (profile is static). `/skills`, `/experience`, `/projects` load their own data.
- **`cache-control` is set only in `+page.server.ts`** (`public, s-maxage=3600, stale-while-revalidate=86400`), never in a layout. Every `(public)` route, including static `/contact`, sets this header uniformly.
- `(public)/+layout.server.ts` returns `projectSlugs` (slug and title only, via `getProjectSlugs()`) wrapped in `try/catch` (fallback `[]` so a database outage never crashes the terminal layout shell). It sets no cache header.
- No root `+layout.server.ts` exists, and `auth.api.getSession` in `src/hooks.server.ts` runs only for `/admin`, `/login`, and `/api/auth`. Public cached routes never read auth cookies or hit session tables.

### 2.6 Errors and 404

- A catch-all `src/routes/(public)/[...path]/+page.ts` calls `error(404)`, so unmatched URLs are rendered inside the `(public)` layout.
- `src/routes/(public)/+error.svelte` renders `ErrorBlock`, distinguishing `404` (`command not found: <path>` or `open: no such project: <slug>` plus route suggestions) from `500+` (`error <status>: <message>`).
- Catastrophic fallback: `src/error.html` is a standalone static HTML file (`< 1KB`, inline `ayu` colors, system monospace font, zero external CSS/JS dependencies) rendered by SvelteKit if `hooks.server.ts` or platform initialization fails.

---

## 3. Design Tokens

### 3.1 Palettes

Two dark palettes. No light mode. Names: **moonfly** (default, Moonfly, MIT) and **ayu** (override, Ayu Dark, MIT). Tokens are scoped to `[data-ui='terminal']` and `:root:has([data-ui='terminal'])`.

| Token     | moonfly (default) | ayu       | Use                                                |
| --------- | ----------------- | --------- | -------------------------------------------------- |
| `bg`      | `#080808`         | `#0b0e14` | page background                                    |
| `surface` | `#121212`         | `#10141c` | code blocks, dock, panels                          |
| `border`  | `#323437`         | `#273747` | 1px lines                                          |
| `fg`      | `#bdbdbd`         | `#bfbdb6` | primary text                                       |
| `muted`   | `#949494`         | `#8a9199` | secondary text (lightened for >=6:1 contrast)      |
| `faint`   | `#626262`         | `#626a73` | **decorative only**: line numbers, separators      |
| `accent`  | `#80a0ff`         | `#e6b450` | prompt `$`, active item, inverse background, caret |
| `info`    | `#79dac8`         | `#59c2ff` | paths, links                                       |
| `ok`      | `#8cc85f`         | `#7fd962` | `[live]`, active session pulse                     |
| `warn`    | `#e3c78a`         | `#ff8f40` | `[wip]`, `[in_progress]`                           |
| `danger`  | `#ff5454`         | `#f07178` | errors                                             |
| `special` | `#ae81ff`         | `#d2a6ff` | tags and categories                                |

Verified WCAG 2.1 contrast: all essential text tokens on `bg` and `surface` exceed 4.5:1 (`moonfly`: 5.93:1 to 12.21:1, inverse 8.00:1; `ayu`: 5.79:1 to 11.04:1, inverse 10.13:1). `faint` is 3.07:1 to 3.52:1 and must never carry essential text. Accent is blue in moonfly and amber in ayu; never use accent to mean warning (`warn` is for warnings). Derived atmospheric washes and surface tints use `color-mix(in srgb, var(--t-*) X%, ...)` so both themes remain cohesive automatically.

### 3.2 CSS foundation

`src/lib/components/terminal/terminal.css` (imported by `Shell.svelte`):
- Base tokens (`moonfly`) on `:root:has([data-ui="terminal"]), [data-ui="terminal"]` with `color-scheme: dark !important` and `background-color: var(--t-bg)` on `html, body` (prevents white rubber-band overscroll and overrides `mode-watcher` inline light color-scheme on public routes without touching admin/login).
- Ayu Dark overrides on `:root[data-term-theme="ayu"]:has([data-ui="terminal"]), :root[data-term-theme="ayu"] [data-ui="terminal"]`.
- Tailwind utilities map `--color-term-*`, `--font-term-mono`, and `--font-term-sans` in `src/routes/layout.css`.

### 3.3 Other tokens

| Item       | Value                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Spacing    | multiples of 4px only                                                                                               |
| Radius     | `0`. Maximum `2px` for `Kbd` and `Tag`. Never larger.                                                               |
| Border     | `1px solid var(--t-border)` (semantic tinted borders allowed via `color-mix()`)                                     |
| Elevation  | subtle semantic surface tint + bounded active/hover micro-glow (`color-mix()`); no heavy drop shadows               |
| Atmosphere | faint top-edge radial ambient wash (`<10%`) + masked 24px dot-matrix grid on canvas                                 |
| Motion     | snappy GPU-friendly CSS (`120-320ms`, `cubic-bezier(0.16, 1, 0.3, 1)`), View Transitions radial theme wipe          |
| Focus ring | `outline: 2px solid var(--t-accent); outline-offset: 2px` on every focusable element                                |
| Selection  | `::selection { background: var(--t-accent); color: var(--t-bg) }` inside the terminal                               |
| Max width  | shell `100ch`, prose `72ch`                                                                                         |
| Caret      | `caret-color: var(--t-accent)` + living block caret (`term-caret-blink` when focused idle, solid while typing)      |

---

## 4. Typography

| Role                                                    | Font      | Size / line-height                  | Weight          |
| ------------------------------------------------------- | --------- | ----------------------------------- | --------------- |
| Chrome, prompt, labels, tags, tables, statusline        | Plex Mono | 15px mobile / 17px desktop / 1.55   | 400             |
| Body in mono blocks (`KeyValue`, lists) & input         | Plex Mono | 16px mobile / 18px desktop / 1.6    | 400             |
| Headings (h1 24-28px, h3 18px, h4 16px)                 | Plex Mono | as listed / 1.3-1.4                 | 700             |
| Long prose (rendered markdown, `bio`)                   | Plex Sans | 17px mobile / 19px desktop / 1.7, max 72ch | 400, strong 600 |
| Code                                                    | Plex Mono | 15px mobile / 16px desktop / 1.6    | 400             |

Rule: **mono to scan, sans to read.** Sans is used only in `.md` prose and the `bio` paragraph. The input is at least 16px on mobile (prevents iOS zoom on focus) and 18px on desktop. No text below 13px. At most two families and four font files (`IBM Plex Mono` 400/700, `IBM Plex Sans` 400/600, SIL OFL 1.1). Uppercase only for table column headers.

---

## 5. Visual Language

All pure CSS and text.

1. **Inverse video:** `background: accent; color: bg`. For the active strip item, the hovered/focused table row, and the active drawer item. Use for one active thing at a time.
2. **Echo line:** `$` in `accent`, command text in `fg`. Page output follows in normal text.
3. **Panel:** `<fieldset>` with `<legend>`. 1px border, legend sits on the top line. Lines drawn by CSS, never characters.
4. **Status tags:** literal brackets: `[live]` (ok), `[wip]` (warn), `[archived]` (muted). Tier tags `T1`, `T2`, `T3`. Category tags lowercase in `special`.
5. **`ls -l` table style** for projects (see 12.2).
6. **`git log` timeline style** for experience: node `*` in accent, vertical line by CSS border, 7-character hash from the real record `id`.
7. **Line-number gutter** only in fenced code blocks (`faint`).
8. **Three text levels:** `fg`, `muted`, `faint`. Use them instead of boxes.
9. **Statusline:** flat solid segments (see 11).

**Functional icons:** five inline SVGs (`external-link`, `copy`, `check`, `close`, `search`) in `components/terminal/TermIcon.svelte`, sourced from `@iconify-json/pixelarticons` (MIT License). `viewBox="0 0 24 24"`, `fill="currentColor"`, `aria-hidden="true"`. No Iconify runtime on public pages.

**Modern GPU Terminal Craft (allowed):** subtle atmospheric canvas radial wash & masked dot grid, `color-mix()` semantic surface tints, cursor-tracking spotlight sheen on cards/chips, View Transitions radial theme wipe, crisp cascade entrance stagger, living block caret, pulsing live/HEAD status indicators, and sharp reticle corners.

**Never:** ASCII-art banners, heavy glassmorphism blur, soft-shadow rounded SaaS cards, emoji, blocking typewriter effects on page content, scanline or CRT effects, fake logs, or external animation libraries.

---

## 6. Interaction Model

### 6.1 Registry (single source of truth)

Pure TypeScript file `src/lib/terminal/commands.ts` (no Svelte imports). Used by the parser, tab completion, strip, drawer, `help`, and error suggestions.

Parsing: trim, collapse whitespace, case-insensitive command name, first token is the command, the rest is the argument. Commands without `arg` reject extra tokens with `bad-args` (`usage: <name>`). Flags are not emulated.

### 6.2 Commands

| Command                | Aliases | Kind   | Effect                                                   | In menu |
| ---------------------- | ------- | ------ | -------------------------------------------------------- | ------- |
| `about_me`             | `about`, `whoami` | nav    | go `/`                                                   | yes     |
| `projects`             | `ls`    | nav    | go `/projects`                                           | yes     |
| `open <slug>`          | `cat`   | nav    | go `/projects/<slug>` (slug autocomplete)                | no      |
| `skills`               | -       | nav    | go `/skills`                                             | yes     |
| `experience`           | `log`   | nav    | go `/experience`                                         | yes     |
| `contact`              | -       | nav    | go `/contact`                                            | yes     |
| `back`                 | `..`    | nav    | return to parent route (or `already at ~ (landing page)` on `/`); parser also silently accepts `cd ..`, `cd ../..`, `cd ~` | no      |
| `theme [ayu\|moonfly]` | -       | inline | set theme; no argument toggles; message `theme: moonfly` | yes     |
| `history`              | -       | inline | list commands typed this session                         | no      |
| `help`                 | `?`     | inline | list registry with descriptions and the keys in 6.3      | yes     |
| `clear`                | -       | inline | remove appended blocks                                   | yes     |
| `sudo`                 | -       | nav    | go `/login` (unlisted easter egg)                        | no      |

`history` format: right-aligned index, local `HH:MM` of when it was typed, command text. Stored in `sessionStorage` (`kantz-history`), max 50. Only typed commands are recorded, not clicks.

### 6.3 Keyboard

| Key               | Where                                 | Effect                                                                                                                                                             |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Up / Down         | input focused                         | walk typed history                                                                                                                                                 |
| Tab               | input focused                         | complete command name, then argument. Single match completes. Multiple matches complete to the common prefix; a second Tab appends a block listing the candidates. |
| Shift+Tab         | input focused                         | standard backwards focus movement (prevents keyboard trap)                                                                                                         |
| Enter             | input focused                         | run                                                                                                                                                                |
| `Ctrl+L`          | anywhere                              | run `clear`                                                                                                                                                        |
| `Esc`             | drawer open                           | close drawer, focus returns to the `[menu]` button                                                                                                                 |
| any printable key | focus on `body` or inside `main` only | type-to-focus (6.4)                                                                                                                                                |

There are no letter shortcuts, no `g` sequences, no command palette.

### 6.4 Focus and type-to-focus

- **Desktop** (`(hover: hover) and (pointer: fine)`): input focuses on mount; after navigation completes, focus returns to input; page title is announced via `role="status"`.
- **Touch devices:** input does **not** autofocus and focus is never moved programmatically.
- **Type-to-focus** (desktop): focuses input and inserts the typed character only if all hold:
  1. `document.activeElement` is `body` or inside `main` (and not inside an interactive control `a`, `button`, `input`, `textarea`, `select`, `summary`, `[contenteditable]`);
  2. no `Ctrl`, `Alt`, or `Meta` modifier;
  3. `event.key.length === 1` and not Space;
  4. no `<dialog open>` is open.

### 6.5 Unknown or invalid input

Appended block: echo line of what was typed, then `command not found: <input>` in `danger`, up to three closest command names (edit distance), and `type help for the list`. Invalid arguments: `usage: <usage>` in `danger`. Never throw, never navigate.

---

## 7. Navigation Surfaces

Both render from the registry (`menu: true` entries). Route commands are `<a href>`, inline commands are `<button>`. The active route is shown in inverse video.

### 7.1 Tab strip (>= 768px)

- Sits inside the sticky bottom tmux chrome directly above the statusline (below the inline prompt). Wrapper `<nav aria-label="Commands">`.
- **Open by default.** Toggle button at left (`[-]` / `[+]`) with `aria-label`, `aria-expanded`, `aria-controls`.
- Persists in `localStorage` (`kantz-nav`). `app.html` copies `closed` to `data-nav="closed"` before paint; CSS hides collapsed items with `display: none`.
- Overflow: horizontal scroll, visually hidden scrollbar, keyboard reachable via focus.

### 7.2 Drawer (< 768px)

- Sticky `[menu]` button (min height `44px`, plain text) at the left of the statusline toggles the drawer. `aria-expanded`, `aria-controls`.
- Opening blurs the input (closing soft keyboard); drawer panel fills space above the statusline, max `50dvh`, scrollable.
- Non-modal. `Esc` closes it and returns focus to `[menu]`. Choosing an item runs it and closes the drawer.
- Item height at least 44px, showing command name and `muted` description. Never auto-opened.

---

## 8. Boot Sequence & MOTD

- Rendered at `/` only; page output (`whoami`) is always rendered directly in SSR HTML behind the overlay (SEO-safe).
- **First visit per session (`html:not([data-booted])`):** full-screen boot overlay (`fixed inset-0 z-50 bg-term-bg`) reveals 4 real lines via CSS `steps(1)` (`0ms`, `220ms`, `440ms`, `660ms`), completing at `1100ms` or instantly on any `pointerdown`/`keydown`.
- **Once per session:** `app.html` checks `sessionStorage.getItem('kantz-booted') === '1'` and sets `data-booted="1"` before paint, hiding the overlay immediately with zero flash. Disabled under `<noscript>`, `prefers-reduced-motion: reduce`, `@media print`, and all deep links.
- Compact inline MOTD header remains visible above `$ whoami` showing version, build commit/date, and help hint.

---

## 9. Theme Mechanism

- Store: `src/lib/terminal/theme.svelte.ts` (`ayu` | `moonfly`). Persists to `localStorage` (`kantz-theme`) with `try/catch`.
- Uses **`data-term-theme`** on `<html>` (not `data-theme`, because `mode-watcher@1.1.0` in root `+layout.svelte` unconditionally overwrites `data-theme=""`).
- No cookie and no server read of the theme (edge-cache safe). `app.html` uses static `<html lang="en">` and runs the pre-paint inline script to apply `data-term-theme`, `data-nav`, and `data-booted`.
- The statusline theme segment is a button that toggles the theme and announces `theme: <name>`.

---

## 10. Components (`src/lib/components/terminal/`)

All use Svelte 5 runes, snippets, and callback props.

| Component     | Purpose and rules                                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Shell`       | Wrapper `<div data-ui="terminal">`: skip links, content container, `Scrollback`, sticky dock. Imports `terminal.css`.                                                                                                                       |
| `Scrollback`  | Renders `{@render children()}` then appended blocks from `scrollback.svelte.ts` inside `aria-live="polite"`, with instant scroll-to-new-block via mount action.                                                                             |
| `Motd`        | See 8. Only rendered by `/`.                                                                                                                                                                                                                |
| `OutputBlock` | Echo line (`$ <text>`) plus content. Used by pages and appended blocks.                                                                                                                                                                     |
| `Prompt`      | `kantz@workstation:<path>$` (`<path>$` below 640px). Host `muted`, path `info`, `$` `accent`.                                                                                                                                               |
| `InputBar`    | Pure non-sticky inline flowing prompt inside `<main>` below `Scrollback`. Uses `IntersectionObserver` to notify `Shell` when hidden below the viewport on tall pages, triggering a `less`-style pager bar (`-- prompt below -- [ jump to $ ]`) above the bottom tmux chrome that disappears once the prompt enters view. |
| `TabStrip`    | See 7.1.                                                                                                                                                                                                                                    |
| `Drawer`      | See 7.2.                                                                                                                                                                                                                                    |
| `StatusBar`   | See 11.                                                                                                                                                                                                                                     |
| `Panel`       | `fieldset` and `legend`. Props: `title`, optional `active`.                                                                                                                                                                                 |
| `KeyValue`    | Two-column `dl`; key `muted`, value `fg`; stacks on mobile.                                                                                                                                                                                 |
| `TreeList`    | Projects `ls -l`-style semantic `<table>` with inverse video hover/focus and mobile stacking.                                                                                                                                               |
| `LogTimeline` | `git log`-style ordered list for experience.                                                                                                                                                                                                |
| `Tag`         | Inline `[text]` styled by role (`ok`, `warn`, `muted`, `special`).                                                                                                                                                                          |
| `Kbd`         | Keycap used in `help` output: 1px border, radius 2px, mono 13px.                                                                                                                                                                            |
| `Markdown`    | Imports `markdown.css`; renders `renderMarkdown()` output in `.md` scope via `{@html}` (sanitized by the parser).                                                                                                                           |
| `ImageViewer` | Lightbox for `images[]`. Native `<dialog>`, Left/Right/Esc, alt text required, lazy loading.                                                                                                                                                |
| `ErrorBlock`  | 404, 500+, bad-args, and unknown command messages.                                                                                                                                                                                          |
| `TermIcon`    | Inline SVG map (`external-link`, `copy`, `check`, `close`, `search`).                                                                                                                                                                       |

---

## 11. Statusline

Flat segments, solid backgrounds, left to right:

`[menu]` (`< 768px`) | `kantz` (`>= 640px`, inverse badge) | `[$]` (jump to inline prompt) | `path` (`>= 768px`) | `loading` | `message` (flex, truncates, `role="status"`) | `theme` (button) | `clock` (`>= 768px`, mount-only `HH:MM`)

---

## 12. Pages

Every page: `<svelte:head>` title (`<page> | kantZ Workstation`), description, canonical, OG tags, one `<h1>` (visually hidden except project detail), 1:1 echo line, and a defined empty state.

- **`/` (`whoami`):** `Motd`, `KeyValue` (`name`, `alias`, `roles`, `education`), `bio` in Plex Sans (72ch), `Panel` "featured" (`no featured projects yet`). No birth data, age, email, or phone.
- **`/projects` (`projects`):** `TreeList` (`TIER`, `STATUS`, `UPDATED`, `NAME` + tagline), ordered by `orderIndex`, empty `total 0`.
- **`/projects/[slug]` (`open <slug>`):** visible `<h1>` title, `KeyValue` (`status`, `tier`, `category`, `stack`, optional `live`/`source`), `ImageViewer`, `Markdown` case study, `og:image` from `thumbnailUrl` (fallback `/og-default.png`), 404 `open: no such project: <slug>`.
- **`/skills` (`skills`):** one `Panel` per category (`languages`, `frameworks`, `databases`, `systems`), names as `Tag`s. No levels, no bars, no icons.
- **`/experience` (`experience`):** `LogTimeline` with 7-char `id` hash, `period`, `company`, `role`, `description`, `highlights`.
- **`/contact` (`contact`):** `KeyValue` (`email` with copy button posting `email copied`, `whatsapp`, `github`, `instagram`). Only place email and phone appear.
- **Errors & 404:** `(public)/+error.svelte` distinguishes `404` (`command not found: <path>` + suggestions) vs `500+` (`error <status>: <message>`). Catastrophic fallback: `src/error.html`.

---

## 13. Markdown

Parser: `src/lib/utils/markdown.ts`, pure function `renderMarkdown(raw: string): string`.

- **Supported:** paragraphs, `###`/`####` (`#`/`##` demoted to `h3`), unordered (`-`, `*`) and ordered (`1.`) lists, blockquote (`>`), fenced code (`tabindex="0"`, CSS counter line gutter), inline code, bold, italic (adjacent non-space markers only), safe links (`http:`, `https:`, `mailto:`).
- **Not supported (escaped plain text):** raw HTML, images, tables, nested lists.
- **Security:** escape `&`, `<`, `>`, `"`, `'` before parsing; extract inline code and safe links before bold/italic; reject `javascript:`, `data:`, and quote-injected URLs; output plain tags with zero classes or inline styles.

---

## 14. Responsive Behavior & Accessibility

- `>= 768px`: `TabStrip` open by default, full statusline, `100ch` container, desktop pointer-fine autofocus.
- `< 768px`: bordered `[menu]` button + `Drawer`, compact statusline, no autofocus, tap targets `>= 44px`.
- `< 640px`: compact prompt (`<path>$`), stacked project table rows, stacked `KeyValue`.
- Landmarks: skip links (`#main`, `#command`), `<nav aria-label="Commands">`, `<main id="main">`, `role="status"` statusline, `aria-live="polite"` scrollback.
- `prefers-reduced-motion: reduce`: disables MOTD animation and all transitions.

---

## 15. SEO, Performance, Print

- **SEO:** per-route `<title>`, description, canonical, `og:title`, `og:description`, `og:url`, `og:image` (`thumbnailUrl` or `/og-default.png`), dynamic `/sitemap.xml` and `/robots.txt` (`Disallow: /admin, /login, /api`).
- **Performance:** two font families (4 files), no animation libraries, `font-display: swap`, lazy sized images, edge `cache-control: public, s-maxage=3600, stale-while-revalidate=86400` on all public routes.
- **Print (`@media print`):** hides dock and skip links, disables MOTD animation and body color transitions, forces white background and black text, prints external URLs next to links, avoids page breaks inside `dl`, `.term-log-entry`, `fieldset`, and `pre`.

---

## 16. Do and Don't

| Do                                                       | Don't                                                      |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| Put the input at the bottom and keep it the primary path | Make clicking the only way, or typing the only way         |
| Use inverse video for the single active thing            | Highlight many things at once                              |
| Use `fg`, `muted`, `faint` for hierarchy                 | Add boxes and dividers to create hierarchy                 |
| Show real hashes, dates, versions                        | Invent logs, uptime, stats, skill levels                   |
| Keep radius 0 to 2px, 1px borders, subtle token tints    | Add heavy blur glassmorphism, CRT scanlines, or neon slop  |
| Write concrete copy ("Full-Stack Web Engineer")          | Write filler ("passionate developer crafting experiences") |
| Put feedback in the statusline                           | Add floating toasts or progress bars                       |
| Reset scrollback on navigation                           | Accumulate output across routes                            |
