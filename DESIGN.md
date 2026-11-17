# Design System Specification

> Status: Staged Layout / Pending Final Polishing via Figcraft MCP
> Note: Font (Plus Jakarta Sans + Syne) dan icon (Solar Icons) dikonfigurasi sejak awal. Tahap awal menggunakan layout dasar yang rapi dan fungsional. Palet warna detail, tokens visual, dan pemolesan estetika tingkat lanjut akan dieksekusi di tahap akhir melalui integrasi Figcraft MCP.

## Typographic Foundation
- Headline / Display Font: **Syne** (Distinctive, architectural, modern geometric display)
- Primary UI & Body Font: **Plus Jakarta Sans** (Clean, humanist readability, self-hosted WOFF2 via fontsource)
- Code & Data Metrics Font: **Geist Mono** or **JetBrains Mono** (Technical specifications, badges, system stats)

## Iconography & Visual Assets
- Primary Icon System: **Solar Icons** (`solar:`) via `@iconify/svelte`
- Emoticon Policy: ZERO UNICODE EMOTICONS. All visual indicators must use dedicated SVG icons or textual badges.

## Layout Strategy (Initial vs Final)
- Initial Phase: Basic functional layouting, clean spacing, solid semantic HTML, and functional components ("asal jalan + rapi dulu").
- Final Phase: Polishing visual, color tokens, and layout finesse synced via Figcraft MCP.

## Motion & Interaction Architecture
- Base Transitions: Svelte 5 built-in transitions (`fly`, `fade`, `scale`) and native CSS transitions.
- Interactive Visual Engine: WebGL / Canvas interactive background and fluid reactive elements.
- Accessibility & Performance Gate: "Performance Mode" toggle persisted in `localStorage` + automatic compliance with `prefers-reduced-motion` to immediately halt rendering loops on low-spec hardware or user preference.

## Color Tokens & Theme System (Pending Configuration via Figcraft MCP)
<!-- Palet warna dan tokens visual detail akan diekstrak dan diselaraskan via Figcraft MCP pada tahap polishing akhir -->
