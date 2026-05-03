-- ============================================================
-- Fret-DZ — Mise à jour du schéma pour les nouvelles features
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- 1. Ajouter les colonnes manquantes à la table expeditions
ALTER TABLE expeditions
  ADD COLUMN IF NOT EXISTS marchandise_type TEXT,
  ADD COLUMN IF NOT EXISTS weight_kg NUMERIC,
  ADD COLUMN IF NOT EXISTS volume_m3 NUMERIC,
  ADD COLUMN IF NOT EXISTS pickup_date DATE,
  ADD COLUMN IF NOT EXISTS budget_dzd NUMERIC,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS special_instructions TEXT,
  ADD COLUMN IF NOT EXISTS camionneur_id UUID REFERENCES camionneurs(id) ON DELETE SET NULL;

-- 2. Ajouter les colonnes manquantes à la table camionneurs
ALTER TABLE camionneurs
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS wilaya TEXT,
  ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT TRUE;

-- 3. Row Level Security pour expeditions
ALTER TABLE expeditions ENABLE ROW LEVEL SECURITY;

-- Commerçant voit ses propres expéditions
CREATE POLICY IF NOT EXISTS "commercant_own_expeditions"
  ON expeditions FOR ALL
  USING (auth.uid() = commercant_id);

-- Camionneur voit les expéditions disponibles ET les siennes
CREATE POLICY IF NOT EXISTS "camionneur_view_expeditions"
  ON expeditions FOR SELECT
  USING (
    status = 'created' AND camionneur_id IS NULL
    OR auth.uid() = (SELECT user_id FROM camionneurs WHERE id = expeditions.camionneur_id)
  );

-- Camionneur peut mettre à jour le statut de ses expéditions
CREATE POLICY IF NOT EXISTS "camionneur_update_status"
  ON expeditions FOR UPDATE
  USING (
    auth.uid() = (SELECT user_id FROM camionneurs WHERE id = expeditions.camionneur_id)
  );

-- 4. RLS pour camionneurs
ALTER TABLE camionneurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "camionneur_own_profile"
  ON camionneurs FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "all_can_view_camionneurs"
  ON camionneurs FOR SELECT
  USING (true);

-- 5. Storage bucket bons-livraison (à créer dans le dashboard Supabase Storage)
-- Ou via SQL :
INSERT INTO storage.buckets (id, name, public)
VALUES ('bons-livraison', 'bons-livraison', false)
ON CONFLICT (id) DO NOTHING;

-- RLS sur le storage
CREATE POLICY IF NOT EXISTS "user_own_documents"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'bons-livraison'
    AND auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- 6. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_expeditions_commercant_id ON expeditions(commercant_id);
CREATE INDEX IF NOT EXISTS idx_expeditions_camionneur_id ON expeditions(camionneur_id);
CREATE INDEX IF NOT EXISTS idx_expeditions_status ON expeditions(status);
CREATE INDEX IF NOT EXISTS idx_camionneurs_user_id ON camionneurs(user_id);

-- ============================================================
-- Vérification
-- ============================================================
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'expeditions'
ORDER BY ordinal_position;
