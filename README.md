# Harris Group of Hotels & Lodges — Enterprise Platform

> **CONFIDENTIAL & PROPRIETARY**  
> Copyright &copy; 2026 Harris Group of Hotels & Lodges (Pvt) Ltd. All Rights Reserved.  
> This repository contains proprietary, closed-source commercial code, trade secrets, and copyrighted assets. It is strictly for internal business operations and authorized personnel only. Unauthorized viewing, copying, reproduction, distribution, modification, reverse engineering, or public dissemination of any part of this repository is strictly prohibited and subject to civil and criminal penalties under applicable laws.

---

## 1. Executive Summary

**Harris Group of Hotels & Lodges** is a premier hospitality provider operating 12 signature branch locations across Bulawayo and Zimbabwe. This repository contains the enterprise digital platform and guest reservation system, engineered for modern luxury aesthetics, rapid performance, high-converting direct bookings, and top-tier search engine optimization (SEO).

The platform bypasses third-party commissions by allowing guests to reserve rooms, executive suites, and corporate conference facilities directly via real-time WhatsApp Concierge and email communication channels, with zero upfront credit card fees.

---

## 2. Platform Architecture & Features

### A. Direct Reservation Engine
- **Full Dedicated Booking Page:** Completely integrated booking workflow (`/booking`) styled with brand guidelines.
- **Dual Direct Reservation Channels:**
  - **WhatsApp Direct Booking:** Formats complete reservation requests (branch, suite category, dates, night counts, guest details, total pricing) and opens WhatsApp directly to lodge reservations.
  - **Email Booking:** Generates structured reservation drafts to `harrislodges1@gmail.com` and provides an on-page booking reference code (`HL-XXXXX`).
- **Real-Time Duration & Price Calculator:** Live calculation of nights, guests, and USD totals with zero hidden fees.

### B. Multi-Branch Management
- Interactive directory covering 12 branches:
  - *Harris Northend*, *Harris Sunone*, *Harris Prime*, *Zim Harris*, *Harris Qatha*, *Harris Clark*, *Harris Romney Park*, *Harris Silver Sands*, *Harris London*, *Harris Villa*, and *Harris Executive*.
- Interactive Google Maps integration with driving directions and direct phone assistance.

### C. Suites & Conference Facilities
- Comprehensive showcases for Standard Queen Suites, Deluxe Executive Suites, Presidential Executive Villas, and Conference Halls.
- High-resolution imagery, amenity badges, bed configurations, and capacity metrics.

### D. Enterprise SEO & Rich Structured Data
- Complete JSON-LD schema (`Hotel`, `FAQPage`, `BreadcrumbList`, `AggregateRating`).
- Geo-targeting meta tags for Bulawayo, Zimbabwe (`ZW-BU`).
- Dynamic document title and description generation per view.
- XML Image sitemap (`sitemap.xml`) and crawler optimization (`robots.txt`).

### E. Hostinger / Apache Production Optimization
- Tailored `.htaccess` configuration with rewrite rules preventing 404 errors on single-page application (SPA) routing, accompanied by Gzip compression.

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | React 19 (`react`, `react-dom`) |
| **Language** | TypeScript 5.6 |
| **Bundler & Dev Server** | Vite 8 with HMR |
| **Styling Architecture** | Styled-Components 6 & Tailwind CSS 4 |
| **Iconography** | Iconify (`@iconify/react`) with offline bundles |
| **Routing** | React Router 7 & State-driven section engine |
| **Deployment Target** | Hostinger Apache/LiteSpeed Web Hosting (`public_html`) |

---

## 4. Repository Structure

```
harrislodge-main/
├── public/
│   ├── .htaccess                   # Hostinger Apache rewrite & compression rules
│   ├── images/                     # Suite, branch, and brand visual assets
│   ├── favicon.ico                 # Favicon assets
│   ├── manifest.webmanifest        # Progressive Web App manifest
│   ├── robots.txt                  # Search engine crawler instructions
│   └── sitemap.xml                 # XML search engine sitemap
├── src/
│   ├── assets/                     # Packaged static assets
│   ├── components/
│   │   ├── bookings/               # Dedicated BookingPage & reservation logic
│   │   ├── branches/               # Branch detail views & multi-location map
│   │   ├── common/                 # Modals, WhatsApp concierge assist, legal views
│   │   ├── conference/             # Corporate event & conference listings
│   │   ├── layout/                 # Main header, hero banner, footer navigation
│   │   ├── rooms/                  # Room showcase & filterable listings
│   │   └── ui/                     # Reusable design primitives
│   ├── context/                    # Branch & Auth global state providers
│   ├── hooks/                      # Custom data & query hooks
│   ├── lib/                        # Brand constants, storage engine, icon manifests
│   ├── services/                   # Hotel booking and storage services
│   ├── theme/                      # Typography, color palette & responsive tokens
│   ├── types/                      # Database & domain TypeScript definitions
│   ├── App.tsx                     # Main application orchestrator & SEO hooks
│   ├── index.css                   # Global stylesheet & Tailwind baseline
│   └── main.tsx                    # React root entry point
├── .env.example                    # Environment variable template
├── .gitignore                      # Git exclusion rules
├── index.html                      # Entry HTML with meta tags & Schema.org JSON-LD
├── package.json                    # Dependency manifest & scripts
├── tsconfig.json                   # TypeScript compiler configuration
└── vite.config.ts                  # Vite build configuration & path aliases
```

---

## 5. Development & Build Workflow

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Setup & Local Execution
```bash
# 1. Clone repository (Authorized personnel only)
git clone https://github.com/menelisingwenya/harrislodge.git
cd harrislodge

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start local development server
npm run dev
```
The application will launch locally at `http://localhost:5173/`.

### Quality & Type Checking
```bash
# Run TypeScript compilation check
npm run typecheck

# Run linter
npm run lint
```

### Production Build
```bash
# Compile optimized production bundle into /dist
npm run build
```

---

## 6. Hostinger Deployment Instructions

1. Run `npm run build` to generate the `/dist` output directory.
2. Ensure `dist/.htaccess` is present (it is automatically copied from `public/.htaccess`).
3. Create a zip archive of the files inside `/dist`:
   ```powershell
   Compress-Archive -Path dist\* -DestinationPath hostinger-deploy.zip -Force
   ```
4. Log in to **Hostinger hPanel** &rarr; **File Manager** &rarr; open **`public_html`**.
5. Upload `hostinger-deploy.zip` and extract its contents directly into `public_html`.
6. Confirm the site resolves at `https://harrislodge.co.zw/`.

---

## 7. Legal, Licensing & Governance Policies

This repository is governed by 10 proprietary legal licenses and governance agreements:

1. [**LICENSE.md**](./LICENSE.md) — Proprietary Commercial Software License (Closed Source)
2. [**CONFIDENTIALITY-AGREEMENT.md**](./CONFIDENTIALITY-AGREEMENT.md) — Non-Disclosure & Trade Secrets Agreement
3. [**TERMS-OF-SERVICE.md**](./TERMS-OF-SERVICE.md) — Commercial Terms of Service & Reservation Governance
4. [**PRIVACY-POLICY.md**](./PRIVACY-POLICY.md) — Data Protection & Guest Privacy Policy
5. [**SECURITY.md**](./SECURITY.md) — Information Security & Access Control Policy
6. [**INTELLECTUAL-PROPERTY.md**](./INTELLECTUAL-PROPERTY.md) — Trademark, Brand & Copyright Notice
7. [**ACCEPTABLE-USE-POLICY.md**](./ACCEPTABLE-USE-POLICY.md) — System Usage & Operational Integrity Policy
8. [**CONTRIBUTING.md**](./CONTRIBUTING.md) — Internal Contributor & IP Assignment Agreement
9. [**CODE-OF-CONDUCT.md**](./CODE-OF-CONDUCT.md) — Corporate Professionalism & Ethics Code
10. [**DISCLAIMER.md**](./DISCLAIMER.md) — Commercial Warranty Disclaimer & Liability Limits

---

## 8. Brand & Corporate Contacts

- **Headquarters:** Harris Group HQ · Bulawayo, Zimbabwe
- **Central Reservations Phone:** +263 77 266 7410
- **WhatsApp Concierge:** +263 77547 7464
- **Official Email:** [harrislodges1@gmail.com](mailto:harrislodges1@gmail.com)
- **Website:** [https://harrislodge.co.zw/](https://harrislodge.co.zw/)
