

# Holaweb Services Section — Implementation Plan

## Design System & Theme
- **Background**: Darkest shade of Yale Blue (#0D2233 range, derived from #1B445F)
- **Primary accent**: Golden Pollen (#FFC857) for outlines, icons, borders, and highlights
- **Typography**: White (#FFFFFF) primary text; Garet for headlines, Noto Sans for subheadings, Poppins for body
- **CTA buttons**: Intense Cherry (#C5283D) — on hover, lighten to ~#E8A0AB with black text
- **Consistent dark theme** throughout all sections

---

## 1. Header (Shared Component)
- Holaweb logo (uploaded asset) on the left
- Visible page tab buttons: **Home, About, Services, Contact** (no hamburger/dropdown on desktop; mobile gets a slide-out menu)
- **Services** tab has a dropdown with: Cloud Services, Web & App Development, Market Access, META Solutions
- Header becomes **transparent with blur** when the page is scrolled down

## 2. Hero Section (Full-Screen)
- Full-screen section with an **image placeholder** background (dark overlay)
- Bold headline in **Garet** font (e.g., "Empowering Africa's Digital Future")
- Subheading in **Noto Sans** describing Holaweb's mission
- Description paragraph in **Poppins**
- Two CTA buttons:
  - **"Explore Our Services"** → scrolls to the services tiles section
  - **"Book a Strategy Call"** → navigates to /contact
- Animated floating golden pollen icons/particles for creative flair

## 3. Introduction Section
- Two-column layout: left side has an introduction statement about Holaweb's services (drawn from the company profile — cloud, web/app dev, market access, META solutions)
- Right side has a **circular/rounded image placeholder**
- Golden Pollen accent line/border separating sections

## 4. Services Tiles Section ("What We Offer")
- Section heading: "Complete Digital Solutions" with subtitle
- **4 service tiles** in a responsive grid (modeled after the aws-startup-flow reference):
  1. **Cloud Services** — AWS migration, cost optimization, security, monitoring
  2. **Web & App Development** — Responsive websites, web platforms, mobile apps, UI/UX
  3. **Market Access** — Customer acquisition, distribution, market feedback, revenue growth
  4. **META Solutions** — WhatsApp Business API, chatbot, payments, CRM integration
- Each tile includes:
  - A **circular image placeholder** at the top
  - Category badge and title
  - Description text
  - Bullet-point feature list
  - **"Learn More"** button (Intense Cherry) linking to the corresponding subpage
- Tiles have hover animations (subtle scale + golden pollen border glow)

## 5. Additional Landing Page Sections (from reference)
- **"About Holaweb" section** — "Your Technology Solutions Partner" with company description, key stats (Full-Stack Technology Solutions, All Sizes Business Types, Global Market Distribution), and partner highlights (AWS Partner, Cloud Innovation, Startup Support, META Integration)
- **"Solutions for Every Business Type"** — 3 cards for Startups, SMEs, and Enterprises with descriptions and "Get Quote" CTAs
- Animated icons throughout for a professional-yet-creative feel

## 6. Subpage Routing Structure
- `/services` — Main services landing page (everything above)
- `/services/cloud-services` — Cloud Services subpage (placeholder for now)
- `/services/web-app-development` — Web & App Development subpage (placeholder)
- `/services/market-access` — Market Access subpage (placeholder)
- `/services/meta-solutions` — META Solutions subpage (placeholder)
- Each subpage will have a consistent layout shell (header + footer) ready for detailed content in the next phase

## 7. Footer (Consistent with existing site)
- Maintains the existing footer design from holaweb-demo with Quick Links, logo, company description, contact info, and social media icons
- Styled to match the new dark Yale Blue + Golden Pollen theme

## 8. Responsiveness & Integration
- Fully responsive across desktop, tablet, and mobile
- Built as modular components to integrate seamlessly into the existing Holaweb website structure
- Smooth scroll animations and fade-in effects on section entry

