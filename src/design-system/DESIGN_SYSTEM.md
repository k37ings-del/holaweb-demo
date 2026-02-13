# Holaweb Design System — Locked Foundation

> **DO NOT modify this theme or layout structure unless explicitly requested by the project owner.**

## Color Palette (HSL via CSS variables in `src/index.css`)

| Token         | Role                  | HSL Value              |
|---------------|-----------------------|------------------------|
| `--background`| Page background       | 205 55% 8%             |
| `--foreground`| Default text          | 0 0% 100%              |
| `--primary`   | Intense Cherry (CTA)  | 352 66% 47%            |
| `--secondary` | Yale Blue             | 205 55% 24%            |
| `--accent`    | Burnt Peach           | 15 78% 61%             |
| `--golden`    | Golden Pollen (links) | 42 100% 67%            |
| `--card`      | Card surfaces         | 205 45% 12%            |
| `--muted`     | Muted backgrounds     | 205 30% 16%            |

## Typography

| Usage       | Font Family | Tailwind Class    |
|-------------|-------------|-------------------|
| Headings    | Outfit      | `font-heading`    |
| Subheadings | Noto Sans   | `font-subheading` |
| Body text   | Poppins     | `font-body`       |

## Layout Architecture

- **Header**: Fixed top nav with Services dropdown, golden active states
- **Footer**: Social icons (Facebook, X, Instagram), WhatsApp CTA, minimal links
- **FloatingTriangles**: Persistent background decoration (z-index: 1)
- **Pages**: Header → Main content → Footer (consistent across all routes)

## Component Conventions

- All colors via semantic Tailwind tokens (`bg-primary`, `text-golden`, etc.)
- **Never** use raw color values (`bg-[#fff]`, `text-white`) in components
- Use `useScrollReveal` hook for scroll-triggered animations
- Cards use `bg-card border-border` with optional `border-golden/20` accents
- CTAs use `btn-cherry` class or `bg-primary` token

## Integration Guidelines

When merging functionality from other Lovable projects:
1. Strip the incoming project's theme/styles entirely
2. Re-skin all components using tokens from this design system
3. Preserve only the business logic and functionality
4. Match the existing layout patterns (spacing, typography hierarchy)
5. All new pages must use Header + Footer wrapper pattern
