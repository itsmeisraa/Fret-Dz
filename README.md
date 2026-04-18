# 🚚 Fret-DZ

> **B2B Logistics Extranet for Algeria 🇩🇿**
> Connecting merchants and transporters through a modern cloud-based platform.

⚠️ **Status:** Work in Progress (Active Development)

---

## ✨ Overview

**Fret-DZ** is a logistics platform designed to simplify freight operations between **commerçants (clients)** and **camionneurs (transporteurs)**.

The goal is to digitize and streamline shipment management in Algeria with a scalable cloud architecture.

---

## 🎯 Problem → Solution

**Problem:**

* Logistics coordination is often manual and inefficient
* Lack of centralized system for shipments
* Poor tracking and document management

**Solution (Fret-DZ):**

* Centralized platform for managing shipments
* Direct connection between merchants & transporters
* Digital handling of delivery documents
* Scalable cloud infrastructure

---

## 🧠 Core Features

* 📦 Shipment creation and management
* 🚚 Transporter browsing system
* 📄 Upload of signed delivery documents (PDF/Image)
* 🔐 Secure data isolation (RLS with Supabase)
* 🌗 Light/Dark mode UI
* ⚡ Serverless deployment (Vercel)

---

## 🏗️ Architecture

### 📊 Data Model

| Table         | Description                         |
| ------------- | ----------------------------------- |
| `profiles`    | Merchants (linked to Supabase Auth) |
| `camionneurs` | Transporters with routes & pricing  |
| `expeditions` | Shipments (Merchant ↔ Transporter)  |

### 📁 Storage

* Bucket: `bons-livraison`
* Stores signed delivery documents (PDF / images)

---

## 🔄 User Flow

```
Auth → Browse Transporters → Create Shipment → Upload Document → Track Status
```

---

## ⚙️ Tech Stack

* **Frontend:** Next.js 14 (App Router)
* **Backend:** Supabase (PostgreSQL + Auth + Storage)
* **Styling:** Tailwind CSS + shadcn/ui
* **Deployment:** Vercel (Serverless)

---

## 💻 Local Setup

```bash
git clone https://github.com/itsmeisraa/fret-dz.git
cd fret-dz
npm install
```

Create environment variables:

```bash
cp .env.example .env.local
```

Add:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Run the project:

```bash
npm run dev
```

---

## 🚀 Deployment

Deployed on Vercel with automatic CI/CD:

```bash
git push origin main
```

Each push triggers a new deployment.

---

## 📁 Project Structure

```
fret-dz/               # Dossier principal du projet Next.js
│   ├── app/                # App Router (Next.js 14)
│   │   ├── auth/           # 🔄 [À COMPLÉTER] Page de connexion / Inscription
│   │   ├── dashboard/      # 🚧 [EN COURS] Routes protégées du tableau de bord
│   │   │   ├── commercant/ # ⚠️ [NON FONCTIONNEL] Dashboard commerçant
│   │   │   ├── camionneur/ # ⚠️ [NON FONCTIONNEL] Dashboard transporteur
│   │   │   └── shipment/   # ⚠️ [NON FONCTIONNEL] Page de suivi d'expédition
│   │   ├── layout.tsx      # Layout principal avec ThemeProvider
│   │   ├── page.tsx        # Landing page publique
│   │   └── globals.css     # Styles Tailwind CSS
│   ├── components/         # Composants réutilisables
│   │   ├── ui/             # Composants UI (shadcn/ui)
│   │   ├── Navbar.tsx      # Barre de navigation (avec thème)
│   │   ├── dashboard-layout.tsx # 🚧 [EN COURS] Layout du dashboard
│   │   └── theme-provider.tsx   # Gestion du thème clair/sombre
│   ├── hooks/              # Hooks personnalisés
│   ├── lib/                # Utilitaires
│   ├── scripts/            # Scripts SQL
│   │   └── 001_create_schema.sql # Schéma de base de données Supabase
│   ├── styles/             # Styles additionnels
│   ├── public/             # Assets statiques
│   ├── package.json
│   └── ...                 # Fichiers de configuration (Next.js, Tailwind, TS)
└── README.md
```

---

## 📊 Cloud Architecture Insight

### 💸 OPEX vs CAPEX

Using **Vercel + Supabase** eliminates the need for expensive infrastructure:

* ❌ No servers to buy (CAPEX)
* ✅ Pay only for usage (OPEX)
* ⚡ Fast deployment (minutes instead of weeks)

---

### 📈 Scalability

* **Traditional servers:** limited & slow to upgrade
* **Vercel (serverless):** auto-scales instantly

Fret-DZ can handle growth from a few users to thousands without infrastructure changes.

---

### 🧾 Data Types

* **Structured:** PostgreSQL tables (`profiles`, `expeditions`, etc.)
* **Unstructured:** delivery documents stored in Supabase Storage

---

## ✅ Current Progress

### ✔️ Done

* Authentification (Connexion / Inscription)
* Structure du projet Next.js 14 avec App Router
* Configuration de Tailwind CSS et shadcn/ui
* Thème clair/sombre avec next-themes
* Landing page publique (page.tsx)
* Navigation de base (Navbar)
* Schéma SQL complet pour Supabase (tables profiles, camionneurs, expeditions)

### 🚧 In Progress

* Dashboard Commerçant — interface pour créer et suivre les expéditions
* Dashboard Transporteur — interface pour gérer les offres de transport
* Page Expéditions — liste et suivi des expéditions
* Upload de fichiers — intégration de Supabase Storage pour les bons de livraison
* Intégration complète de Supabase (client, RLS, requêtes)

---

## ⚠️ Project Status

This project is still under development.
Some routes (especially `/dashboard/*`) are not functional yet.

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome!

---

## ⭐ Support

If you find this project interesting, consider giving it a star ⭐
