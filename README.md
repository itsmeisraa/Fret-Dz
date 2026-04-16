## **🚧 Fret-DZ — Extranet Logistique B2B**
> **Projet de Fin de Module (SI) · Architecture Cloud & Vibe Programming**
> **⚠️ STATUT : STILL WORKING ON IT**

**Stack :** **Next.js** (React) · **Supabase** · **Tailwind CSS** · **Vercel**

**App en production :** `STILL WORKING ON IT`
**Dépôt GitHub :** `https://github.com/itsmeisraa/fret-dz`

---

## 🗺️ Mapping du Thème

**Thème choisi :** Logistique B2B — *"Fret-DZ"*

| Rôle architecture | Notre implémentation |
|---|---|
| **Table A — Utilisateurs** | `profiles` — les **commerçants** (clients B2B, liée à `auth.users` via Supabase Auth) |
| **Table B — Ressources** | `camionneurs` — les **transporteurs** avec leur véhicule, route et tarif |
| **Table C — Interactions** | `expeditions` — les **expéditions** (jointure Commerçant ↔ Camionneur, avec `statut` et `date_expedition`) |
| **Fichier (Storage)** | **Bon de livraison signé** (PDF ou image) uploadé par le commerçant lors de la création de l'expédition, stocké dans le bucket `bons-livraison` de Supabase Storage |

**Flux utilisateur :**
```
Inscription/Connexion (Table A) → Parcourir les camionneurs disponibles (Table B) → Créer une expédition + uploader le bon de livraison (Table C + Storage) → Suivre le statut sur le Dashboard & page Expéditions (RLS : données isolées par commerçant)
```

---

## 🏗️ Analyse d'Architecture

### 1. Vercel + Supabase : logique financière (OPEX vs CAPEX)
Déployer ce projet sur une infrastructure classique imposerait un **CAPEX** (Capital Expenditure) conséquent dès le départ : acquisition de serveurs physiques, licences de base de données, câblage réseau, onduleurs, et aménagement d'une salle serveur. Ces dépenses sont immobilisées avant même d'avoir un premier utilisateur. À cela s'ajoutent des coûts d'exploitation fixes — électricité, climatisation, maintenance matérielle, salaire d'un administrateur système — qui constituent un **OPEX** (Operating Expenditure) incompressible, qu'il y ait du trafic ou non.

L'approche **Vercel + Supabase** transforme l'intégralité de ces charges en **OPEX variable et quasi nul au démarrage** : les deux plateformes proposent un tier gratuit (Vercel Hobby, Supabase Free) suffisant pour valider un MVP en production. On ne paie qu'en fonction de la consommation réelle — requêtes, stockage, bande passante. Pour un projet en phase d'amorçage comme Fret-DZ, cela signifie **zéro CAPEX et un time-to-market réduit à quelques heures**, contre plusieurs semaines pour une infrastructure on-premise.

### 2. Scalabilité Vercel vs Data Center physique
Un data center local a une capacité **fixe et rigide** : si on déploie 4 serveurs rack, on est limité à leur puissance totale. En cas de pic de trafic — imaginons qu'une grande chaîne de distribution algérienne adopte Fret-DZ — les serveurs saturent. Ajouter de la capacité demande des semaines : commande, livraison, rack, câblage, configuration. La climatisation doit être dimensionnée pour les pics de chaleur et tourne à plein régime même la nuit quand les serveurs sont presque inactifs.

**Vercel** opère sur un modèle **Serverless Edge** : chaque requête HTTP déclenche une fonction isolée, instanciée en millisecondes sur le nœud CDN le plus proche du visiteur (Alger, Paris, Francfort…). Il n'existe aucun "serveur qui attend" entre deux requêtes — donc pas de climatisation permanente, pas de racks sous-utilisés, pas de saturation. Si Fret-DZ passe de 10 à 10 000 commerçants simultanés, Vercel scale **automatiquement, horizontalement, et sans intervention humaine**. Supabase applique la même logique côté PostgreSQL avec une infrastructure managée sur AWS.

### 3. Données structurées vs non-structurées dans Fret-DZ
**Données structurées** — tout ce qui est stocké dans les tables PostgreSQL de Supabase. Les tables `profiles`, `camionneurs` et `expeditions` contiennent des données typées, schématisées et requêtables en SQL : identifiants UUID, textes, entiers, booléens, dates `TIMESTAMPTZ`, et statuts contrôlés par des contraintes `CHECK`. La relation `expeditions.commercant_id → profiles.id` et `expeditions.camionneur_id → camionneurs.id` est un exemple canonique de structure relationnelle avec clés étrangères.

**Données non-structurées** — les **bons de livraison signés** (PDF ou images JPEG/PNG) uploadés dans **Supabase Storage** (bucket `bons-livraison`). Un PDF ou une photo de document n'a pas de schéma : c'est un fichier binaire dont le contenu (texte manuscrit, signature, tampon) ne peut pas être directement indexé ou filtré en SQL. Supabase Storage les traite comme des objets blob, accessibles via URL publique. Dans notre modèle, `expeditions.bon_livraison_url` stocke uniquement le _chemin relatif_ du fichier (donnée structurée), tandis que le fichier lui-même reste une donnée non-structurée dans le bucket.

---

## 💻 Installation locale

```bash
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
```

---

## 🚀 Déploiement CI/CD Vercel

Chaque push sur `main` déclenche un redéploiement automatique.

```bash
git add .
git commit -m "feat: description de la modification"
git push origin main
# → Vercel rebuild et redéploie en ~30 secondes
```

**Variables d'environnement à ajouter dans Vercel Dashboard :**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📁 Structure du projet

```
fret-dz/
├── frontend/               # Dossier principal du projet Next.js
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

## ✅ Ce qui fonctionne (MVP)

- [x] Structure du projet Next.js 14 avec App Router
- [x] Configuration de Tailwind CSS et shadcn/ui
- [x] Thème clair/sombre avec `next-themes`
- [x] Landing page publique (page.tsx)
- [x] Navigation de base (Navbar)
- [x] Schéma SQL complet pour Supabase (tables `profiles`, `camionneurs`, `expeditions`)

## 🚧 En cours de développement

- [ ] **Authentification** (Connexion / Inscription) — les routes sont définies mais la logique n'est pas encore implémentée
- [ ] **Dashboard Commerçant** — interface pour créer et suivre les expéditions
- [ ] **Dashboard Transporteur** — interface pour gérer les offres de transport
- [ ] **Page Expéditions** — liste et suivi des expéditions
- [ ] **Upload de fichiers** — intégration de Supabase Storage pour les bons de livraison
- [ ] **Intégration complète de Supabase** (client, RLS, requêtes)

---

## ⚠️ Note sur l'état actuel du projet

Le projet est **en phase de développement actif**. L'architecture est définie, le schéma de base de données est prêt, mais plusieurs fonctionnalités frontend sont encore en construction. Les pages du dashboard (`/dashboard/*`) sont actuellement **non fonctionnelles** et nécessitent l'implémentation de la logique métier, de l'authentification, et de l'intégration avec Supabase.

**Contributions et retours sont les bienvenus !**

---

I hope this revised README helps! Let me know if you'd like any changes.