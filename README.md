# Kantz Portfolio

Modern, high-performance personal portfolio and engineering showcase web application built with Svelte 5, SvelteKit, Drizzle ORM, Supabase PostgreSQL, Better Auth, and Upstash Redis. Deployed on Vercel.

---

## Technical Highlights

- **Framework & Reactivity:** SvelteKit powered by Svelte 5 Runes (`$state`, `$derived`, `$props`).
- **Styling & Design System:** Tailwind CSS v4 with bespoke typography (Plus Jakarta Sans + Syne / Cabinet Grotesk) and curated iconography via `@iconify/svelte` (Solar / Phosphor Duotone).
- **Dynamic Content Management:** Fullstack project management CMS backed by Supabase PostgreSQL and Drizzle ORM.
- **Authentication & Security:** Better Auth with session cookies; `/login` portal secured by Upstash Redis rate limiter to prevent brute force attacks.
- **Zero-Bloat Analytics:** Server-side visitor tracking and project metrics powered by Upstash Redis.
- **Performance & Accessibility:** Integrated "Performance Mode" toggle to gracefully disable heavy WebGL/Canvas rendering loops for low-spec hardware, fully respecting `prefers-reduced-motion`.
- **Zero Unicode Emoticons:** Strict aesthetic constraint utilizing dedicated SVG icons and clean typography.

---

## Tech Stack Overview

| Layer | Technology |
|---|---|
| Frontend Framework | SvelteKit (Svelte 5 Runes) |
| Styling | Tailwind CSS v4 |
| Database & ORM | PostgreSQL (Supabase) + Drizzle ORM |
| Authentication | Better Auth |
| Caching & Rate Limiting | Upstash Redis |
| Icons | `@iconify/svelte` (Solar Icons / Phosphor Duotone) |
| Fonts | Self-hosted WOFF2 (Plus Jakarta Sans) |
| Testing | Vitest + Playwright |
| Deployment | Vercel (`@sveltejs/adapter-vercel`) |

---

## Directory Structure

```text
kantz-porto/
├── src/
│   ├── hooks.server.ts          # Server hooks (Auth session, analytics tracking)
│   ├── app.html                 # HTML shell
│   ├── lib/
│   │   ├── components/          # Shared Svelte 5 UI components
│   │   ├── i18n/                # Type-safe dictionaries (EN/ID)
│   │   └── server/
│   │       ├── auth.ts          # Better Auth configuration
│   │       ├── redis.ts         # Upstash Redis & Rate Limiter client
│   │       └── db/
│   │           ├── index.ts     # Drizzle database client
│   │           └── schema.ts    # Drizzle PostgreSQL schema
│   └── routes/
│       ├── +page.svelte         # Landing page (Hero, Spotlight, Skills, Timeline)
│       ├── projects/
│       │   ├── +page.svelte     # Project directory with filters
│       │   └── [slug]/          # In-depth technical case study
│       ├── login/               # Protected admin login
│       └── admin/               # Protected CMS & Analytics Dashboard
├── drizzle.config.ts            # Drizzle Kit configuration
├── AGENTS.md                    # Agent operating standards & constraints
├── DESIGN.md                    # Design system specifications
└── TODO.md                      # Implementation roadmap & task checklist
```

---

## Getting Started

### Prerequisites

- Node.js 20+ (Node 24 recommended)
- PostgreSQL database (Supabase instance)
- Upstash Redis instance

### Environment Setup

Copy `.env.example` to `.env` and fill in the required credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string (Supabase)
- `ORIGIN`: Base URL (e.g. `http://localhost:5173` for development)
- `BETTER_AUTH_SECRET`: High-entropy secret key for Better Auth
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST endpoint
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST token

### Development Scripts

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run Svelte type-checking
npm run check

# Run ESLint
npm run lint

# Run database migrations
npm run db:push
npm run db:studio

# Run unit and E2E tests
npm run test:unit
npm run test:e2e

# Build for production
npm run build
```

---

## Documentation Links

- [TODO.md](file:///home/ekik/workspace2/kantz-porto/TODO.md) - Project roadmap and milestone tracker
- [AGENTS.md](file:///home/ekik/workspace2/kantz-porto/AGENTS.md) - Coding standards, persona guidelines, and anti-slop rules
- [DESIGN.md](file:///home/ekik/workspace2/kantz-porto/DESIGN.md) - Design system specification and color palette draft
