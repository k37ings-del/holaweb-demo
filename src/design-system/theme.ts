/**
 * HOLAWEB DESIGN SYSTEM — LOCKED THEME CONSTANTS
 * ================================================
 * DO NOT modify unless explicitly requested by the project owner.
 *
 * This file exports reusable theme constants for use in components.
 * All visual styling should reference these values or the corresponding
 * Tailwind tokens defined in index.css / tailwind.config.ts.
 *
 * When integrating external Lovable projects:
 *   - Strip their theme entirely
 *   - Re-skin using these constants and Tailwind semantic classes
 *   - Preserve only business logic and functionality
 */

export const THEME = {
  fonts: {
    heading: "Outfit",
    subheading: "Noto Sans",
    body: "Poppins",
  },
  colors: {
    background: "hsl(0, 0%, 5%)",
    foreground: "hsl(0, 0%, 100%)",
    primary: "hsl(352, 66%, 47%)",      // Intense Cherry
    primaryLight: "hsl(352, 60%, 62%)",
    secondary: "hsl(0, 0%, 12%)",       // Dark Grey
    accent: "hsl(352, 60%, 62%)",       // Cherry Light
    golden: "hsl(352, 66%, 47%)",       // Now maps to Cherry
    card: "hsl(0, 0%, 10%)",
    muted: "hsl(0, 0%, 14%)",
  },
  social: {
    facebook: "https://facebook.com",
    x: "https://x.com",
    instagram: "https://instagram.com",
    whatsapp: "https://wa.me/27715138219",
  },
} as const;
