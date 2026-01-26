# 🔧 FIX: Créer la table KV Store dans Supabase

## ❌ Problème
Erreur : `Could not find the table 'public.kv_store_e884809f' in the schema cache`

La table pour stocker les données n'existe pas dans ta base de données Supabase.

## ✅ Solution : Créer la table manuellement

### Étape 1 : Ouvre le Dashboard Supabase

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet **Squad Planner** (project ID: `cwtoprbowdqcemdjrtir`)
3. Dans le menu de gauche, clique sur **"SQL Editor"**

### Étape 2 : Copie et exécute ce SQL

Copie **tout le code ci-dessous** et colle-le dans l'éditeur SQL :

```sql
-- Créer la table kv_store_e884809f
CREATE TABLE IF NOT EXISTS public.kv_store_e884809f (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer les index pour la performance
CREATE INDEX IF NOT EXISTS idx_kv_key_prefix 
  ON public.kv_store_e884809f (key text_pattern_ops);

CREATE INDEX IF NOT EXISTS idx_kv_updated_at 
  ON public.kv_store_e884809f (updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_kv_value_gin 
  ON public.kv_store_e884809f USING gin (value);

-- Activer Row Level Security
ALTER TABLE public.kv_store_e884809f ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Service role full access" ON public.kv_store_e884809f;
DROP POLICY IF EXISTS "Anon users have access" ON public.kv_store_e884809f;

-- Policy 1: Service role a un accès complet (pour les opérations serveur)
CREATE POLICY "Service role full access" 
  ON public.kv_store_e884809f
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy 2: Les utilisateurs anonymes ont accès complet (simplifié pour le prototypage)
CREATE POLICY "Anon users have access" 
  ON public.kv_store_e884809f
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_kv_store_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at à chaque modification
DROP TRIGGER IF EXISTS trigger_update_kv_store_updated_at 
  ON public.kv_store_e884809f;

CREATE TRIGGER trigger_update_kv_store_updated_at
  BEFORE UPDATE ON public.kv_store_e884809f
  FOR EACH ROW
  EXECUTE FUNCTION update_kv_store_updated_at();

-- Message de succès
SELECT '✅ Table kv_store_e884809f créée avec succès !' as status;
```

### Étape 3 : Exécute le SQL

1. Clique sur le bouton **"RUN"** (ou appuie sur `Ctrl+Enter` / `Cmd+Enter`)
2. Tu devrais voir un message : `✅ Table kv_store_e884809f créée avec succès !`

### Étape 4 : Vérifie que la table existe

1. Dans le menu de gauche, clique sur **"Table Editor"**
2. Tu devrais voir la table **`kv_store_e884809f`** dans la liste
3. Elle devrait avoir 4 colonnes :
   - `key` (TEXT, PRIMARY KEY)
   - `value` (JSONB)
   - `created_at` (TIMESTAMPTZ)
   - `updated_at` (TIMESTAMPTZ)

### Étape 5 : Redémarre ton app

1. Dans Figma Make, clique sur le bouton **Preview (▶️)**
2. L'erreur devrait disparaître !
3. Essaye de te connecter avec :
   - Email : `rudylabor@hotmail.fr`
   - Password : `password123`

---

## 🎯 Pourquoi cette erreur ?

Le système Figma Make utilise un **KV Store** (Key-Value Store) pour stocker toutes les données :
- Profils utilisateurs
- Squads
- Sessions
- Messages
- etc.

Cette table doit exister dans Supabase pour que l'app fonctionne.

---

## 📱 Après avoir fixé

Une fois la table créée, ton app devrait fonctionner normalement et tu pourras :
- Te connecter
- Créer des squads
- Proposer des sessions
- Inviter des amis
- Tout tester sur ton téléphone !

---

## ⚠️ Note de Sécurité

Les policies actuelles donnent un **accès complet** aux utilisateurs anonymes pour simplifier le prototypage.

**Pour la production**, tu devrais restreindre l'accès :
- Chaque utilisateur ne peut accéder qu'à ses propres données
- Utiliser `auth.uid()` pour filtrer par utilisateur
- Créer des policies spécifiques pour squads, sessions, etc.

Mais pour l'instant, c'est parfait pour tester ! 🚀
