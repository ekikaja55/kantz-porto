# Agent Operating Guidelines: kantz-porto

> Permanent contract for AI coding agents working on this repository.
> Companion files: `design.md` (what the public site looks like) and `todo.md` (what to do, in order).
> Read all three before starting. If they conflict, this file wins, then `design.md`, then `todo.md`.

---

## 1. Core Technology Stack

- **Framework:** SvelteKit with Svelte 5, runes only (`$state`, `$derived`, `$props`, `$effect`).
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`), `@tailwindcss/typography`, `@tailwindcss/forms`.
- **Database and ORM:** PostgreSQL hosted on Supabase, accessed through the pooler `DATABASE_URL` with Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `postgres`). **No Supabase SDK.** Do not add `@supabase/*`.
- **Authentication:** Better Auth with the Drizzle adapter and SvelteKit cookie integration.
- **Security and rate limiting:** Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`).
- **Theming:** `mode-watcher` (class `dark` on `<html>`). Do not invent another theme mechanism.
- **Deployment target:** Vercel via `@sveltejs/adapter-vercel`.
- **Iconography:**
  - Public area (`(public)` routes): inline SVG only, see `design.md`. No Iconify.
  - Admin and login: `@iconify/svelte` stays as-is. Legacy, do not extend.

---

## 2. Scope Boundaries (hard limits)

1. **Admin and login are frozen.** Do not restyle, refactor, or change behavior in `src/routes/admin/**` and `src/routes/login/**`, except where `todo.md` names an explicit task.
2. **New public UI lives in `src/lib/components/terminal/`.** Do not restyle old shared components (`Modal`, `ToastContainer`, `Skeleton`, `ThemeToggle`, etc.). Admin may depend on them.
3. **No new dependencies** unless `todo.md` or `design.md` names the exact package. Otherwise stop and ask.
4. **Never rename or remove** `document.body.dataset.hydrated = 'true'` in the root layout. End-to-end tests rely on it.
5. **Never run destructive database commands** (`db:push`, `db:migrate`, drops). You may run `db:generate` and show the migration. The user applies it.
6. **Terminal tokens are scoped** to `[data-ui='terminal']`. Do not change global tokens in a way that alters admin appearance.

---

## 3. Inviolable Design and Code Standards

1. **No emoji, no pictographic symbols.**
   - Forbidden anywhere: UI, source, comments, commit messages, docs. This includes characters that render as emoji on some platforms (check mark, warning sign, play triangle, arrows in emoji style).
   - Allowed: plain ASCII (`>`, `*`, `[x]`, `|`, `-`, `+`). Lines and borders are drawn with CSS, not characters.
   - Functional icons: inline SVG per `design.md`.
2. **Svelte 5 runes only.**
   - No `export let`, `$:`, `createEventDispatcher`, `<slot />`, or legacy store patterns for component-local state.
   - Use `$props()`, `$state()`, `$derived()`, `$effect()`, snippets, and callback props.
3. **Anti-slop visual restraint.**
   - No gradients, glow, glassmorphism, soft-shadow rounded cards, decorative orbs, or bento filler.
   - No fake status lights, fake logs, fake statistics, or invented numbers. Every value shown in the UI comes from real data (database, `PROFILE`, build info, runtime).
   - The terminal shell is real: it is wired to real routes. "No fake terminal content" means no staged output, not "no terminal".
   - Motion must have a purpose and must respect `prefers-reduced-motion` at all times.
4. **Language:** English only for all UI copy on public pages. (Legacy i18n is pending removal, see section 5.)
5. **Type safety:** strict TypeScript, no `any`.
6. **Accessibility is a requirement, not polish.** Follow section 12 of `design.md`.

---

## 4. Verification Gates

Run before reporting any task or phase as done:

```bash
npm run check          # must be zero errors and zero warnings
npm run lint
npm run test:unit -- --run
```

Also run `npm run build`:

- at the end of Phase 0, Phase 4, and Phase 5,
- after deleting any file or dependency,
- whenever `todo.md` says so.

`npm run test:e2e` is only run when the user asks.

If a gate fails and the cause is not trivially inside your own change, stop and report.

---

## 5. Legacy Block (pending removal, do not extend)

These exist only until their removal task in `todo.md` runs. Do not add new usage.

| Legacy item                                                                                                                                                    | Replaced by                   | Removal phase |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------- |
| Win98 UI (`components/win98/`, `routes/sandboxing/`)                                                                                                           | Terminal UI                   | Phase 0       |
| Performance Mode toggle and `stores/performance.svelte.ts` (feature is **removed**)                                                                            | `prefers-reduced-motion` only | Phase 5       |
| i18n (`$lib/i18n`, `LangToggle`, `params/lang.ts`, `en`/`id` dictionaries) (feature is **removed**)                                                            | English literals              | Phase 5       |
| `icon` field on skills (column, form, seed, UI) (feature is **removed**)                                                                                       | Nothing                       | Phase 5       |
| Old public components (`Hero`, `Navbar`, `Footer`, `MobileNavDock`, `ProjectCard`, `FeaturedProjects`, `SkillsMatrix`, `ExperienceTimeline`, `ContactSection`) | `components/terminal/*`       | Phase 5       |
| `birthDate`, `birthPlace`, `age` in `PROFILE`                                                                                                                  | Removed for privacy           | Phase 5       |

Do not mention Performance Mode, language switching, or skill icons in any new code or copy.

---

## 6. Git Safety

- **The agent never commits, pushes, branches, or stashes.** The user creates the branch and makes commits.
- At the end of each phase, stop and report: "Phase N complete, ready to commit", with the list of changed files and gate results.
- At the start, confirm `git branch --show-current` is not `main`. If it is, stop and report.

---

## 7. Working Rules (defensive)

1. **One phase per session.** Never jump ahead.
2. **Stop and report beats fix.** When a `STOP IF` condition in `todo.md` triggers, do not delete, adapt, or work around. Report the exact grep output and wait.
3. **Grep before every deletion.** Show the command and result in your report.
4. **No improvisation in design.** If `design.md` does not specify something, choose the most restrained option and list it under "Decisions I made" in your report. Never add decoration to fill space.
5. **Do not touch files you were not asked to touch.** Keep diffs small and reviewable.
6. **No invented data.** If a field is not in the schema or `PROFILE`, it is not rendered.

---

## 8. Svelte MCP and Tooling

1. Use the Svelte MCP server (`list-sections`, `get-documentation`) when runes behavior, SvelteKit config, or reactive patterns are ambiguous.
2. Every Svelte change must pass `svelte-check` with zero errors and zero warnings. Run available autofixers iteratively.
3. Never generate playground links when editing repository files.
