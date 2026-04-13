# 🚚 Fret-DZ — Extranet Logistique B2B

> Projet de Fin de Module (SI)· Architecture Cloud & Vibe Programming  
> Stack : **express.js** · **Supabase** ·**React** ·  **Vercel**

🔗 **App en production :** `STILL WORKING ON IT`  
🐙 **Dépôt GitHub :** `https://github.com/itsmeisraa/fret-dz`

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
Inscription/Connexion (Table A)
  → Parcourir les camionneurs disponibles (Table B)
  → Créer une expédition + uploader le bon de livraison (Table C + Storage)
  → Suivre le statut sur le Dashboard & page Expéditions (RLS : données isolées par commerçant)
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

**Données non-structurées** — les **bons de livraison signés** (PDF ou images JPEG/PNG) uploadés dans **Supabase Storage** (bucket `bons-livraison`). Un PDF ou une photo de document n'a pas de schéma : c'est un fichier binaire dont le contenu (texte manuscrit, signature, tampon) ne peut pas être directement indexé ou filtré en SQL. Supabase Storage les traite comme des objets blob, accessibles via URL publique. Dans notre modèle, `expeditions.bon_livraison_url` stocke uniquement le *chemin relatif* du fichier (donnée structurée), tandis que le fichier lui-même reste une donnée non-structurée dans le bucket.

---

## 🛠️ Installation locale

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

## 🚀 Déploiement CI/CD Vercel

```bash
# Chaque push sur main déclenche un redéploiement automatique
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
├── app/
│   ├── auth/page.tsx           # Connexion / Inscription commerçant
│   ├── dashboard/page.tsx      # Tableau de bord + stats + expéditions récentes
│   ├── camionneurs/page.tsx    # Catalogue des transporteurs (Table B)
│   ├── expeditions/page.tsx    # Toutes mes expéditions + suivi statut (Table C)
│   ├── globals.css             # Design system industriel amber/charcoal
│   └── layout.tsx
├── components/
│   ├── Navbar.tsx              # Navigation principale
│   └── NewExpeditionModal.tsx  # Modal création expédition + upload bon
├── lib/
│   └── supabase.ts             # Client Supabase browser
├── supabase/
│   └── schema.sql              # Tables SQL + RLS + trigger + données test
├── .env.example
├── .gitignore
└── README.md
```

## 🔒 Sécurité RLS — Critère éliminatoire ✅

Chaque commerçant ne peut voir **que ses propres expéditions**, même en cas d'attaque directe sur l'API :

```sql
-- Un commerçant accède UNIQUEMENT à ses expéditions
CREATE POLICY "own expeditions"
  ON public.expeditions FOR ALL
  USING (auth.uid() = commercant_id);
```

Cette politique est évaluée côté serveur PostgreSQL — elle est indépendante du frontend et ne peut pas être contournée.
