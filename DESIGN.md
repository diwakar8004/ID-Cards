# Design System: HACKER गोवा HOUSE Builder Social Card Generator

## 1. Visual Theme & Atmosphere

A precision-crafted, high-trust interface with the weight of official documentation and the clarity of modern software. The atmosphere is **institutional but not cold** — like a well-designed government portal that has been reimagined by a boutique product studio.

- **Density:** Daily App Balanced (5/10) — comfortable information density with ample breathing room in content areas, tighter in data tables
- **Variance:** Offset Asymmetric (6/10) — left-aligned layouts with deliberate spatial imbalances, no centered hero sections
- **Motion:** Fluid CSS (5/10) — purposeful transitions and micro-interactions, never decorative

The interface communicates **authority, transparency, and security** at every touchpoint. The verification page in particular must feel like an official document — trustworthy, clear, unambiguous.

---

## 2. Color Palette & Roles

- **Canvas** (`#F8FAFC`) — Primary page background, Slate-50 depth
- **Surface White** (`#FFFFFF`) — Card fills, modal backgrounds, input backgrounds
- **Surface Raised** (`#F1F5F9`) — Secondary sections, sidebar background, table header fills
- **Charcoal Ink** (`#0F172A`) — Primary text, headings, Slate-950 depth. Never pure black.
- **Steel Gray** (`#475569`) — Secondary text, descriptions, labels, metadata — Slate-600
- **Whisper Border** (`#E2E8F0`) — 1px structural dividers, card borders, input strokes — Slate-200
- **Deep Navy Accent** (`#1E40AF`) — Single primary accent. CTAs, active states, focus rings, links. Blue-800.
- **Accent Surface** (`#EFF6FF`) — Tinted backgrounds for accent-adjacent elements (pills, chips)
- **Success Emerald** (`#059669`) — Active/verified status indicators — Emerald-600
- **Success Surface** (`#D1FAE5`) — Background for active/verified state chips — Emerald-100
- **Warning Amber** (`#D97706`) — Expired status — Amber-600
- **Warning Surface** (`#FEF3C7`) — Expired state backgrounds — Amber-100
- **Danger Crimson** (`#DC2626`) — Revoked/error/destructive actions — Red-600
- **Danger Surface** (`#FEE2E2`) — Revoked state backgrounds — Red-100
- **Pending Violet** (`#7C3AED`) — Pending status indicator — Violet-700
- **Pending Surface** (`#EDE9FE`) — Pending state backgrounds — Violet-100

**Banned:** Pure black (`#000000`), neon gradients, oversaturated purple/neon accents, warm/cool gray mixing.

---

## 3. Typography Rules

- **Display/Headlines:** `Outfit` — Track-tight (`letter-spacing: -0.02em`), weight 700. Used for hero headings and major section titles only.
- **UI Text & Body:** `Geist` — Clean, technical, neutral. Weight 400 for body, 500 for labels, 600 for subheadings, 700 for emphasized UI text.
- **Monospace:** `Geist Mono` — Used exclusively for unique IDs, verification tokens, timestamps, and numeric codes. Ensures scannable alignment in tables.
- **Scale:**
  - Display: `clamp(2.5rem, 5vw, 4rem)` / weight 700
  - H1: `2rem` / weight 700
  - H2: `1.5rem` / weight 600
  - H3: `1.125rem` / weight 600
  - Body: `0.9375rem` (15px) / weight 400, line-height 1.6
  - Small/Meta: `0.8125rem` (13px) / weight 400, Steel Gray
- **Max line length:** 65ch for body text
- **Banned fonts:** Inter, Georgia, Times New Roman, any generic system serif. `Geist` and `Outfit` are the sole approved pairings.

---

## 4. Component Stylings

### Buttons
- **Primary:** Deep Navy Accent (`#1E40AF`) fill, white text. Border-radius `0.5rem` (8px). No outer glow. Active state: `-1px translateY` tactile push. Hover: `#1D4ED8` (Blue-700).
- **Secondary/Outline:** 1px Whisper Border stroke, transparent fill, Charcoal Ink text. Same radius. Hover: Surface Raised fill.
- **Destructive:** Danger Crimson fill, white text. Only used for irreversible actions with confirmation dialog.
- **Ghost:** No border, no fill. Steel Gray text. Hover: Surface Raised fill.
- **All buttons:** `font-family: Geist`, `font-weight: 500`, `font-size: 0.875rem`, height `2.5rem` (standard), `2.25rem` (compact), `3rem` (large landing CTA).

### Cards & Containers
- `border-radius: 0.75rem` (12px) — Subtly rounded, not pill-shaped.
- `border: 1px solid #E2E8F0` — Whisper Border.
- `background: #FFFFFF` — Surface White.
- Box shadow: `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` — whisper-soft diffused.
- High-density areas (tables, lists): Replace cards with `border-top: 1px solid #E2E8F0` dividers.

### Inputs & Forms
- Label: above input, Geist 13px weight 500, Steel Gray.
- Input: `border: 1px solid #E2E8F0`, `border-radius: 0.5rem`, `background: #FFFFFF`, `height: 2.5rem`.
- Focus ring: `ring-2 ring-[#1E40AF] ring-offset-1` — Navy accent ring.
- Error: `border-color: #DC2626`, error text below in Danger Crimson, 12px.
- No floating labels. No placeholder-as-label patterns.

### Status Badges
- Pill-shaped chips: `border-radius: 9999px`, `padding: 0.25rem 0.625rem`, `font-size: 0.75rem`, `font-weight: 600`.
- **ACTIVE:** Emerald-600 text on Emerald-100 background.
- **PENDING:** Violet-700 text on Violet-100 background.
- **EXPIRED:** Amber-600 text on Amber-100 background.
- **REVOKED:** Crimson-600 text on Crimson-100 background.
- **REJECTED:** Steel-Gray text on Slate-100 background.

### Data Tables
- Header: `background: #F1F5F9`, `border-bottom: 2px solid #E2E8F0`, Geist 12px weight 600 uppercase, letter-spacing 0.05em, Steel Gray text.
- Rows: `border-bottom: 1px solid #F1F5F9`, hover `background: #F8FAFC`.
- Fixed first column on mobile scroll for wide tables.
- Zebra striping: BANNED — use hover highlight only.

### Loading States
- Skeletal shimmer matching exact layout element dimensions. `background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)`, `background-size: 200%`, animated via `@keyframes shimmer`.
- No generic circular spinners for content loading. Spinners only for button loading states (inline, 16px).

### Empty States
- Composed illustration (SVG or icon) + headline + description + optional action.
- Icon: 48px, Steel Gray.
- Headline: Geist 16px weight 600, Charcoal Ink.
- Description: Geist 14px weight 400, Steel Gray, max 45ch.

### ID Card Component
- Fixed aspect ratio: `85.6mm × 54mm` (standard CR80 credit card size).
- Front face: Organization header (logo + name), user photo (circular, 60px), full name, unique ID (Geist Mono), department, designation, issue/expiry dates, QR code.
- Subtle gradient border using Deep Navy Accent.
- Print-safe: white background, no transparency, CMYK-safe colors.
- QR code: bottom-right corner, 72px × 72px.

---

## 5. Layout Principles

- **Grid system:** CSS Grid exclusively. `display: grid` with named areas for major layouts.
- **Max-width container:** `1280px` centered with `padding: 0 1.5rem`.
- **Admin layout:** `240px` fixed sidebar + fluid content area.
- **Section vertical rhythm:** `clamp(4rem, 8vw, 7rem)` between major landing page sections.
- **No centered Hero sections** — Landing page hero: left-aligned text, right-side visual element.
- **No 3-column equal card grids** — Use 2-column zig-zag or asymmetric feature grids.
- **Responsive breakpoints:** Mobile-first. `768px` (md), `1024px` (lg), `1280px` (xl).
- **Single-column collapse:** All multi-column layouts collapse to single column below 768px. No exceptions.
- **No horizontal overflow on mobile** — Critical failure if it occurs.

---

## 6. Motion & Interaction

- **Timing function:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — Smooth deceleration (ease-out-quart feel).
- **Duration tokens:**
  - Micro (icon states, color): `100ms`
  - Component (show/hide, hover): `200ms`
  - Page transitions: `300ms`
- **Hardware-accelerated only:** `transform` and `opacity` exclusively. Never animate `top`, `left`, `width`, `height`, `background-color` of large surfaces.
- **Hover effects:** Subtle `translateY(-2px)` on interactive cards. `translateY(-1px)` on buttons.
- **Table row hover:** `background` transition `100ms`.
- **Verification page entry:** Fade-in + `translateY(8px → 0)` for the status badge.
- **Dashboard stats:** Staggered cascade reveal: `0ms, 75ms, 150ms, 225ms` delay per card.
- **No infinite loops on landing page** — Micro-loops acceptable only in active admin dashboard widgets.

---

## 7. Anti-Patterns (Banned)

- ❌ No emojis anywhere in the UI
- ❌ No `Inter` font — use `Geist` or `Outfit`
- ❌ No generic serif fonts (Times New Roman, Georgia, Garamond)
- ❌ No pure black (`#000000`) — use Charcoal Ink (`#0F172A`)
- ❌ No neon outer glow shadows
- ❌ No oversaturated accent colors or purple neon aesthetics
- ❌ No excessive gradient text on large headers
- ❌ No custom mouse cursors
- ❌ No overlapping elements — strict spatial separation
- ❌ No 3-column equal card layouts — use asymmetric grids
- ❌ No generic placeholder names ("John Doe", "Acme Corp")
- ❌ No fake statistics or invented metrics
- ❌ No `LABEL // YEAR` formatting conventions
- ❌ No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen")
- ❌ No "Scroll to explore" filler text or bouncing scroll arrows
- ❌ No broken image links — use proper Cloudinary URLs or `picsum.photos` for demos
- ❌ No centered Hero sections for the landing page
- ❌ No zebra-striped tables — hover highlight only
- ❌ No generic circular spinners for content loading — use skeletal loaders
- ❌ No exposing MongoDB `_id` or sensitive fields in public APIs
- ❌ No storing sensitive info in QR codes — URL only
