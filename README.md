# 🚚 Fret-DZ

> **B2B Logistics Extranet for Algeria 🇩🇿**  
> Connecting merchants and transporters through a modern cloud-based platform.
🔗 **Live:** [fret-dz.vercel.app](https://fret-dz.vercel.app)

---

## ✨ Overview

**Fret-DZ** is a logistics platform designed to simplify freight operations between **commerçants (clients)** and **camionneurs (transporteurs)** across Algeria.

The platform digitizes and streamlines shipment management with a scalable, serverless cloud architecture — eliminating the manual coordination that makes logistics inefficient today.

---

## 🎯 Problem → Solution

**The Problem:**
- Logistics coordination in Algeria is largely manual and fragmented
- No centralized system for connecting merchants with available transporters
- Poor shipment tracking and document management

**Fret-DZ solves this by:**
- Providing a centralized platform for creating and managing shipments
- Directly linking merchants with transporters based on routes and pricing
- Digitizing delivery documents (PDF/image upload)
- Enforcing secure data isolation per user with Row Level Security

---

## 🧠 Features

- 🔐 **Authentication** — Secure sign-up & login via Supabase Auth
- 📦 **Shipment Management** — Create, browse, and track expeditions
- 🚚 **Transporter Directory** — Browse camionneurs by route and pricing
- 📄 **Document Upload** — Attach signed delivery documents (PDF/Image)
- 🔒 **Row Level Security** — Each user only sees their own data
- 🌗 **Light/Dark Mode** — Full theme support via next-themes
- ⚡ **Serverless Deployment** — Instant CI/CD via Vercel

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Styling | Tailwind CSS + shadcn/ui |
| Language | TypeScript |
| Deployment | Vercel |

---

## 🏗️ Architecture

### Data Model

| Table | Description |
|---|---|
| `profiles` | Merchants linked to Supabase Auth |
| `camionneurs` | Transporters with routes & pricing |
| `expeditions` | Shipments connecting merchants and transporters |

### Storage

- **Bucket:** `bons-livraison`
- Stores signed delivery documents (PDF / images) per expedition

### Cloud Strategy

Using **Vercel + Supabase** provides:
- ✅ No servers to buy or maintain (pure OPEX)
- ✅ Auto-scaling from a few users to thousands
- ✅ Deployment in minutes, not weeks

---

## 🔄 User Flow

```
Register / Login → Browse Transporters → Create Shipment → Upload Document → Track Status
```

---

## 📁 Project Structure

```
fret-dz/
├── app/                        # App Router (Next.js 14)
│   ├── auth/                   # Login & Registration pages
│   ├── dashboard/              # Protected routes
│   │   ├── commercant/         # Merchant dashboard
│   │   ├── camionneur/         # Transporter dashboard
│   │   └── shipment/           # Shipment tracking page
│   ├── layout.tsx              # Root layout with ThemeProvider
│   ├── page.tsx                # Public landing page
│   └── globals.css             # Global Tailwind styles
├── components/                 # Reusable components
│   ├── ui/                     # shadcn/ui components
│   ├── Navbar.tsx              # Navigation bar (with theme toggle)
│   ├── dashboard-layout.tsx    # Dashboard shell layout
│   └── theme-provider.tsx      # Light/dark theme management
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions & Supabase client
├── scripts/
│   └── 001_create_schema.sql   # Full Supabase database schema
├── styles/                     # Additional styles
├── public/                     # Static assets
├── next.config.mjs
├── tailwind.config.js
└── tsconfig.json
```

---

## 💻 Local Setup

```bash
git clone https://github.com/itsmeisraa/Fret-Dz.git
cd Fret-Dz
npm install
```

Create your environment file:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

The project is deployed on **Vercel** with automatic CI/CD. Every push to `main` triggers a new production deployment:

```bash
git push origin main
```

---

## 📚 Academic Context

This project was built as part of the **Information Systems module — 2026** at university. It applies real-world concepts including:
- Cloud architecture (OPEX vs CAPEX)
- Serverless & scalable infrastructure
- Relational database design with RLS
- Full-stack web development with Next.js and Supabase

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome! Feel free to open an issue or submit a pull request.

---

## ⭐ Support

If you find this project interesting or useful, consider giving it a star ⭐ — it means a lot!

---

*Built with ❤️ in Algeria 🇩🇿 by Chiheb israa *
