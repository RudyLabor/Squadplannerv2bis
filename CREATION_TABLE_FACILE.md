# 🚀 CRÉER LA TABLE - 2 MINUTES

## Option 1 : Via Supabase Dashboard (RECOMMANDÉ) ✅

### Étape 1 : Ouvre Supabase
👉 https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir

### Étape 2 : Va dans SQL Editor
Dans le menu de gauche, clique sur **"SQL Editor"**

### Étape 3 : Copie ce SQL

```sql
-- Créer la table kv_store_e884809f
CREATE TABLE IF NOT EXISTS public.kv_store_e884809f (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_kv_key_prefix 
  ON public.kv_store_e884809f (key text_pattern_ops);

CREATE INDEX IF NOT EXISTS idx_kv_updated_at 
  ON public.kv_store_e884809f (updated_at DESC);

-- Activer Row Level Security
ALTER TABLE public.kv_store_e884809f ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Service role full access" ON public.kv_store_e884809f;
DROP POLICY IF EXISTS "Anon users have access" ON public.kv_store_e884809f;

-- Créer les policies
CREATE POLICY "Service role full access" 
  ON public.kv_store_e884809f 
  FOR ALL TO service_role 
  USING (true) WITH CHECK (true);

CREATE POLICY "Anon users have access" 
  ON public.kv_store_e884809f 
  FOR ALL TO anon 
  USING (true) WITH CHECK (true);

-- Message de succès
SELECT '✅ Table créée avec succès !' as status;
```

### Étape 4 : Exécute le SQL
Clique sur **"RUN"** ou appuie sur `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### Étape 5 : Vérifie
Tu devrais voir : `✅ Table créée avec succès !`

---

## Option 2 : Via endpoint automatique (EXPÉRIMENTAL) 🔬

### Si SUPABASE_DB_URL est configuré

1. Dans Figma Make, ouvre la console (F12)
2. Colle ce code :

```javascript
fetch('https://cwtoprbowdqcemdjrtir.supabase.co/functions/v1/make-server-e884809f/setup', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(console.log);
```

---

## ✅ Vérifier que ça fonctionne

### Méthode 1 : Via Supabase Dashboard
1. Va dans **"Table Editor"**
2. Cherche **`kv_store_e884809f`**
3. Elle doit apparaître avec 4 colonnes

### Méthode 2 : Via l'app
1. Dans Figma Make, clique sur **Preview (▶️)**
2. Si tu ne vois plus l'erreur `Could not find the table`, c'est bon ! ✅

---

## 🎯 Après avoir créé la table

Tu pourras enfin :
1. ✅ Tester l'app en preview
2. ✅ Te connecter avec `rudylabor@hotmail.fr` / `password123`
3. ✅ Publier l'app
4. ✅ Tester sur ton téléphone ! 📱

---

## ❓ Ça ne marche toujours pas ?

### Si l'erreur persiste :

1. **Vérifie que la table existe** :
   - Ouvre Supabase Dashboard
   - Table Editor
   - Cherche `kv_store_e884809f`

2. **Vérifie les policies** :
   - Clique sur la table
   - Onglet "Policies"
   - Tu dois voir 2 policies actives

3. **Redémarre l'app** :
   - Ferme la preview
   - Rouvre-la (▶️)

---

## 📞 Besoin d'aide supplémentaire ?

Si tu bloques, donne-moi :
- Le message d'erreur exact
- Une capture d'écran du SQL Editor après exécution
- Ce que tu vois dans Table Editor

Je t'aiderai à débloquer ! 🚀
