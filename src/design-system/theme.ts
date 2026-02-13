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
    background: "hsl(205, 55%, 8%)",
    foreground: "hsl(0, 0%, 100%)",
    primary: "hsl(352, 66%, 47%)",      // Intense Cherry
    primaryLight: "hsl(352, 60%, 62%)",
    secondary: "hsl(205, 55%, 24%)",     // Yale Blue
    accent: "hsl(15, 78%, 61%)",         // Burnt Peach
    golden: "hsl(42, 100%, 67%)",        // Golden Pollen
    card: "hsl(205, 45%, 12%)",
    muted: "hsl(205, 30%, 16%)",
  },
  social: {
    facebook: "https://facebook.com",
    x: "https://x.com",
    instagram: "https://instagram.com",
    whatsapp: "https://wa.me/27715138219",
  },
} as const;
