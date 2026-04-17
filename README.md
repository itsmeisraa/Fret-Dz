Fret-DZ — Extranet Logistique B2B
Projet de Fin de Module (SI) · Architecture Cloud & Vibe Programming

⚠️ STATUT : STILL WORKING ON IT

Stack : Next.js (React) · Supabase · Tailwind CSS · Vercel

App en production : STILL WORKING ON IT

Dépôt GitHub : https://github.com/itsmeisraa/fret-dz

🗺️ Mapping du Thème
Thème choisi : Logistique B2B — "Fret-DZ"

Rôle architecture	Notre implémentation
Table A — Utilisateurs	profiles — les commerçants (clients B2B, liée à auth.users via Supabase Auth)
Table B — Ressources	camionneurs — les transporteurs avec leur véhicule, route et tarif
Table C — Interactions	expeditions — les expéditions (jointure Commerçant ↔ Camionneur, avec statut et date_expedition)
Fichier (Storage)	Bon de livraison signé (PDF ou image) uploadé par le commerçant lors de la création de l'expédition, stocké dans le bucket bons-livraison de Supabase Storage
Flux utilisateur :
Inscription/Connexion (Table A) → Parcourir les camionneurs disponibles (Table B) → Créer une expédition + uploader le bon de livraison (Table C + Storage) → Suivre le statut sur le Dashboard & page Expéditions (RLS : données isolées par commerçant)

⚙️ Installation locale
bash
# 1. Cloner le repo
git clone https://github.com/itsmeisraa/fret-dz.git
cd fret-dz

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# → Remplir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Initialiser la base de données Supabase
# Copiez le contenu de supabase/schema.sql dans l'éditeur SQL de Supabase Dashboard

# 5. Créer le bucket Storage
# Supabase Dashboard > Storage > New bucket
# Nom : "bons-livraison" | Public : true

# 6. Lancer en développement
npm run dev
# → http://localhost:3000
🚀 Déploiement CI/CD Vercel
Chaque push sur main déclenche un redéploiement automatique.

bash
git add .
git commit -m "feat: description de la modification"
git push origin main
# → Vercel rebuild et redéploie en ~30 secondes
Variables d'environnement à ajouter dans Vercel Dashboard :

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

📁 Structure du projet
text
fret-dz/
├── frontend/               # Dossier principal du projet Next.js
│   ├── app/                # App Router (Next.js 14)
│   │   ├── auth/           # [À COMPLÉTER] Page de connexion / Inscription
│   │   ├── dashboard/      # [EN COURS] Routes protégées du tableau de bord
│   │   │   ├── commercant/ # ⚠️ [NON FONCTIONNEL] Dashboard commerçant
│   │   │   ├── camionneur/ # ⚠️ [NON FONCTIONNEL] Dashboard transporteur
│   │   │   └── shipment/   # ⚠️ [NON FONCTIONNEL] Page de suivi d'expédition
│   │   ├── layout.tsx      # Layout principal avec ThemeProvider
│   │   ├── page.tsx        # Landing page publique
│   │   └── globals.css     # Styles Tailwind CSS
│   ├── components/         # Composants réutilisables
│   │   ├── ui/             # Composants UI (shadcn/ui)
│   │   ├── Navbar.tsx      # Barre de navigation (avec thème)
│   │   ├── dashboard-layout.tsx  # [EN COURS] Layout du dashboard
│   │   └── theme-provider.tsx    # Gestion du thème clair/sombre
│   ├── hooks/              # Hooks personnalisés
│   ├── lib/                # Utilitaires
│   ├── scripts/            # Scripts SQL
│   │   └── 001_create_schema.sql  # Schéma de base de données Supabase
│   ├── styles/             # Styles additionnels
│   ├── public/             # Assets statiques
│   ├── package.json
│   └── ...                 # Fichiers de configuration (Next.js, Tailwind, TS)
└── README.md
✅ Ce qui fonctionne (MVP)
Structure du projet Next.js 14 avec App Router

Configuration de Tailwind CSS et shadcn/ui

Thème clair/sombre avec next-themes

Landing page publique (page.tsx)

Navigation de base (Navbar)

Schéma SQL complet pour Supabase (tables profiles, camionneurs, expeditions)

⚠️ En cours de développement / Non fonctionnel
Authentification — Les routes sont définies mais la logique n'est pas encore totalement implémentée. Actuellement, la connexion fonctionne mais l'inscription est bloquée (erreur 3609416015).

Dashboard Commerçant — Interface pour créer et suivre les expéditions (non fonctionnel)

Dashboard Transporteur — Interface pour gérer les offres de transport (non fonctionnel)

Page Expéditions — Liste et suivi des expéditions (non fonctionnel)

Upload de fichiers — Intégration de Supabase Storage pour les bons de livraison (non fonctionnel)

Intégration complète de Supabase (client, RLS, requêtes) — partiellement implémentée

⚠️ Note sur l'état actuel du projet
Le projet est en phase de développement actif. L'architecture est définie, le schéma de base de données est prêt, mais plusieurs fonctionnalités frontend sont encore en construction. Les pages du dashboard (/dashboard/*) sont actuellement non fonctionnelles et nécessitent l'implémentation de la logique métier, de l'authentification, et de l'intégration avec Supabase.

Contributions et retours sont les bienvenus !