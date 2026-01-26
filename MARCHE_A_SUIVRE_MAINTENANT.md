# 🎯 MARCHE À SUIVRE POUR PUBLIER TON APP

## Situation actuelle

✅ **Serveur refactorisé** : Réduction de 97% du fichier principal (3148 → 100 lignes)  
❌ **Table KV Store manquante** : La base de données n'a pas la table nécessaire

## 📋 Étapes pour résoudre

### 1️⃣ Créer la table dans Supabase (5 minutes)

**Pourquoi ?** Ton app a besoin d'une table pour stocker les données (profils, squads, sessions).

**Comment faire ?**

1. Va sur **https://supabase.com/dashboard**
2. Sélectionne ton projet **Squad Planner**
3. Clique sur **"SQL Editor"** dans le menu de gauche
4. Copie **tout le SQL** du fichier `/FIX_KV_STORE_TABLE.md` (section "Copie et exécute ce SQL")
5. Colle-le dans l'éditeur
6. Clique sur **"RUN"** (ou `Ctrl+Enter`)
7. Tu devrais voir : `✅ Table kv_store_e884809f créée avec succès !`

### 2️⃣ Vérifier que la table existe

1. Dans Supabase Dashboard, clique sur **"Table Editor"**
2. Cherche la table **`kv_store_e884809f`**
3. Elle doit avoir 4 colonnes : `key`, `value`, `created_at`, `updated_at`

### 3️⃣ Tester l'app en local

1. Dans Figma Make, clique sur le bouton **Preview (▶️)**
2. L'erreur `Could not find the table` devrait disparaître
3. Essaye de te connecter avec :
   - Email : `rudylabor@hotmail.fr`
   - Password : `password123`
4. Si ça fonctionne, tu verras l'écran Home ! 🎉

### 4️⃣ Publier l'app

1. Dans Figma Make, clique sur le bouton **"Publish"**
2. Avec le serveur refactorisé, ça devrait fonctionner maintenant
3. Tu recevras une **URL** de ton app publiée

### 5️⃣ Tester sur ton téléphone

1. Copie l'URL reçue après la publication
2. Envoie-la sur ton téléphone (WhatsApp, SMS, mail...)
3. Ouvre l'URL dans **Safari** (iOS) ou **Chrome** (Android)
4. Teste ton **Squad Planner** en conditions réelles ! 📱🎮

---

## 🔧 SQL à exécuter dans Supabase

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

-- Policy 1: Service role a un accès complet
CREATE POLICY "Service role full access" 
  ON public.kv_store_e884809f
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy 2: Les utilisateurs anonymes ont accès complet (pour le prototypage)
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

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS trigger_update_kv_store_updated_at 
  ON public.kv_store_e884809f;

CREATE TRIGGER trigger_update_kv_store_updated_at
  BEFORE UPDATE ON public.kv_store_e884809f
  FOR EACH ROW
  EXECUTE FUNCTION update_kv_store_updated_at();

-- Message de succès
SELECT '✅ Table kv_store_e884809f créée avec succès !' as status;
```

---

## ✅ Résumé des améliorations effectuées

### Problème 1 : Serveur trop volumineux ✅ RÉSOLU
- **Avant** : 1 fichier de 3148 lignes
- **Après** : 6 fichiers modulaires de ~100 lignes chacun
- **Impact** : Publication possible sur Figma Make

### Problème 2 : Table manquante ⏳ À FAIRE
- **Action** : Exécuter le SQL ci-dessus dans Supabase Dashboard
- **Durée** : 2 minutes
- **Impact** : App fonctionnelle

---

## 🎯 Une fois que tout fonctionne

Tu pourras :
- 📱 Tester sur ton téléphone
- 🎮 Créer des squads
- 📅 Proposer des sessions
- 👥 Inviter des amis
- 💯 Voir les scores de fiabilité
- 🔔 Recevoir des notifications
- 📊 Consulter des stats

---

## 💡 Besoin d'aide ?

Si tu bloques sur une étape :
1. Vérifie les logs dans la console du navigateur (F12)
2. Vérifie les logs du serveur Supabase
3. Assure-toi que la table `kv_store_e884809f` existe bien

**Tu y es presque ! 🚀**
