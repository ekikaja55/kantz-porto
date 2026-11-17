# Agent Operating Guidelines: kantz-porto

> Contract for AI coding agents working on the kantz-porto repository.

---

## 1. Core Technology Stack

- **Framework:** SvelteKit with Svelte 5 (Full Runes: `$state`, `$derived`, `$props`, `$effect`).
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`), `@tailwindcss/typography`, `@tailwindcss/forms`.
- **Database & ORM:** PostgreSQL (Supabase) via Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `postgres`).
- **Authentication:** Better Auth (`better-auth`) with Drizzle adapter and SvelteKit cookie integration.
- **Security & Rate Limiting:** Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`).
- **Iconography:** `@iconify/svelte` (Solar Icons / Phosphor Duotone sets).
- **Deployment Target:** Vercel via `@sveltejs/adapter-vercel`.

---

## 2. Inviolable Design & Code Standards

1. **Zero Unicode Emoticons:**
   - ABSOLUTELY NO UNICODE EMOTICONS allowed anywhere: in the UI, source code, code comments, commit messages, or technical documentation.
   - Use official SVG icons from the agreed Iconify library or explicit text labels.

2. **Svelte 5 Runes Only:**
   - Do NOT use legacy Svelte 3/4 syntax (`export let`, `$: reactive declarations`, `createEventDispatcher`).
   - Use `$props()`, `$state()`, `$derived()`, and callback props.
   - Do NOT use generic writable stores for component-local state.

3. **Anti-Slop UI & Visual Restraint:**
   - No generic blue-purple AI gradients or decorative radial glowing orbs behind sections.
   - No decorative pulsing dots or fake status lights that do not correspond to actual live system states.
   - No fake terminal windows or generic bento boxes used as mere cosmetic filler.
   - Motion must have purpose: support the "Performance Mode" toggle and respect `prefers-reduced-motion` at all times.

4. **Multi-language (i18n):**
   - Default language: English (`en`).
   - Secondary language: Indonesian (`id`).
   - Use the type-safe dictionary store in `$lib/i18n` with zero external bloated dependencies.

5. **Type Safety & Testing Gate:**
   - Strict TypeScript everywhere; avoid `any`.
   - Before completing tasks, always run `npm run check` and `npm run lint`.
   - Production build (`npm run build`) is reserved only as a sanity gate when explicit commit instructions are provided.

6. **Git Safety:**
   - Keep working tree changes uncommitted unless explicitly instructed by the user to commit or push.
