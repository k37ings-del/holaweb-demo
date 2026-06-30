/**
 * Centralized application settings.
 * Replaces hardcoded business constants scattered across components.
 */

export const COMPANY = {
  name: "Holaweb",
  legalName: "Holaweb Africa",
  domain: "holaweb-demo.lovable.app",
  baseUrl: "https://holaweb-demo.lovable.app",
} as const;

export const CONTACT = {
  supportEmail: "hello@holaweb.co.za",
  adminEmail: "admin@holaweb.co.za",
  whatsappNumber: "+27660666348",
  whatsappUrl: "https://wa.me/27660666348",
} as const;

export const SOCIAL = {
  instagram: "https://www.instagram.com/holaweb.africa/",
  facebook:
    "https://www.facebook.com/people/Holaweb/61579557505241/#",
  linkedin: "https://www.linkedin.com/in/holaweb-africa/",
} as const;

export const ROUTES = {
  home: "/",
  contact: "/contact",
  platform: "/platform",
  auth: "/auth",
  admin: "/admin",
  adminDashboard: "/admin/dashboard",
  dashboard: "/dashboard",
  onboarding: "/onboarding",
} as const;
