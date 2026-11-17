# Project Roadmap & Implementation Tasks (TODO)

> Master implementation checklist for kantz-porto.
> Strategy: Establish foundational fonts, Solar icons, and data/auth first. Build basic clean & functional layouts initially ("asal jalan + rapi"), then execute comprehensive visual polishing in Phase 6 via Figcraft MCP.

---

## Phase 1: Data, Auth & Security Infrastructure

- [ ] Define Drizzle database schema (`src/lib/server/db/schema.ts`):
  - [ ] `projects` table (slug, title, tagline, description, category, tier, status, tech stack, URLs, thumbnail, order, isPublished, timestamps).
  - [ ] `page_views` table or Upstash Redis counter structure.
- [ ] Configure Better Auth integration:
  - [ ] Verify Drizzle adapter with PostgreSQL connection.
  - [ ] Implement single admin credential seeding and session handling.
- [ ] Configure Upstash Redis client:
  - [ ] Set up `@upstash/redis` and `@upstash/ratelimit`.
  - [ ] Implement rate limiting middleware on `/login` (5 attempts / 15 minutes per IP).
- [ ] Implement server-side visitor analytics hook (`src/hooks.server.ts`):
  - [ ] Track total page views, daily unique visitors, and project view counts in Upstash Redis.

---

## Phase 2: Core Assets, Typography & Shared Primitives

- [ ] Typography setup (Early priority):
  - [ ] Install and configure `@fontsource-variable/plus-jakarta-sans` for body and UI.
  - [ ] Install and configure `@fontsource/syne` for headlines and display text.
  - [ ] Configure Tailwind CSS font family utilities (`font-sans`, `font-display`, `font-mono`).
  - [ ] Verify zero external network font requests and configure `font-display: swap`.
- [ ] Icon library setup (Early priority):
  - [ ] Install and configure `@iconify/svelte`.
  - [ ] Verify Solar Icons (`solar:`) integration.
- [ ] Theme & Accessibility:
  - [ ] Implement Dark / Light theme toggle with `localStorage` persistence.
  - [ ] Implement "Performance Mode" toggle (Halts WebGL/Canvas rendering loop; honors `prefers-reduced-motion`).
- [ ] Multi-language (i18n):
  - [ ] Create type-safe translation dictionaries in `$lib/i18n/` (English default, Indonesian alternative).
  - [ ] Create language switcher store and UI toggle.

---

## Phase 3: Public Experience & Multi-Page Routing (Functional Layout)

- [ ] Route `/` (Landing Page - Basic Clean Layout):
  - [ ] Hero section with positioning tagline and quick actions.
  - [ ] Featured Projects Spotlight (Tier 1 projects: MLBB Voice Timer, Invoizy, Craftique-ID, Tutur.id).
  - [ ] Technical Skills Matrix (categorized by language, framework, systems).
  - [ ] Professional Experience & Academic Timeline.
  - [ ] Contact section with direct links and copyable email button.
  - [ ] Footer with brand badge, status indicator, and theme/language controls.
- [ ] Route `/projects` (Project Archive Directory - Functional Grid):
  - [ ] Search input by title, keyword, or technology.
  - [ ] Filter by category (Web, Mobile, Systems, Game).
  - [ ] Filter by status (Live, In Progress, Archived).
  - [ ] Responsive grid layout with project cards.
- [ ] Route `/projects/[slug]` (In-Depth Technical Case Study - Clean Template):
  - [ ] Problem statement and domain context.
  - [ ] Architecture diagram / technical breakdown.
  - [ ] Key engineering challenges and trade-offs.
  - [ ] Direct links: Live Demo, GitHub Repository, Release Binaries.
  - [ ] Prev / Next project navigation bar.

---

## Phase 4: Admin Portal & Dynamic CMS (Functional Interface)

- [ ] Route `/login` (Hidden Admin Login Portal):
  - [ ] Protected by Upstash rate limiter.
  - [ ] Clean, minimalist login form with error feedback.
  - [ ] Redirect to `/admin` upon successful authentication.
- [ ] Route `/admin` (Protected Admin Dashboard):
  - [ ] Auth guard in `+page.server.ts` redirecting unauthenticated users to `/login`.
  - [ ] Overview panel: Real-time visitor metrics (Total visits, 24h uniques, top viewed projects).
  - [ ] Projects list table with quick actions (Toggle Published, Toggle Status, Edit, Delete).
- [ ] Route `/admin/projects/new` & `/admin/projects/[id]/edit`:
  - [ ] Form for project metadata (Title, Slug, Tagline, Category, Tier, Status).
  - [ ] Markdown / rich text editor for case study content.
  - [ ] Tech stack tag input component.
  - [ ] Live preview drawer / split view.

---

## Phase 5: Verification, Quality Assurance & Deployment

- [ ] Caching & Performance Optimization:
  - [ ] Add `Cache-Control` headers for public pages on Vercel Edge.
  - [ ] Verify image optimization via `@sveltejs/enhanced-img`.
- [ ] Testing:
  - [ ] Unit tests (`npm run test:unit`).
  - [ ] E2E tests (`npm run test:e2e`).
  - [ ] Type checking (`npm run check`) and linting (`npm run lint`).
- [ ] Production Deployment:
  - [ ] Vercel adapter configuration.
  - [ ] Environment variables verification (Supabase URL/Key, Upstash URL/Token, Better Auth Secret).
  - [ ] Lighthouse audit verification (Target: 100/100 on Performance, Accessibility, Best Practices, SEO).

---

## Phase 6: Visual Polishing & Figcraft MCP Integration (Final Design Stage)

- [ ] Figcraft MCP Integration:
  - [ ] Connect Figcraft MCP server for automated Figma design asset extraction and design token inspection.
  - [ ] Extract final color palette, shadows, borders, and spacing tokens into Tailwind CSS v4 theme.
- [ ] Visual Refinement & Aesthetic Polish:
  - [ ] Refine micro-interactions, hover states, and card depth based on Figcraft design specs.
  - [ ] Polish WebGL/Canvas interactive elements for the Hero section.
  - [ ] Fine-tune responsive spacing across mobile, tablet, and desktop viewports.
  - [ ] Final anti-slop audit against `DESIGN.md` and `antislop-ui` standards.
