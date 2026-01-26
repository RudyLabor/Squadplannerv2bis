# 🎯 START ICI - 5 ÉTAPES POUR PUBLIER TON APP

## 📋 CHECKLIST

### ✅ Étape 1 : Ouvre Supabase Dashboard
👉 https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir

### ✅ Étape 2 : Va dans SQL Editor
Menu de gauche → **SQL Editor**

### ✅ Étape 3 : Copie et exécute ce SQL

<details>
<summary>📋 Clique ici pour voir le SQL à copier</summary>

```sql
CREATE TABLE IF NOT EXISTS public.kv_store_e884809f (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kv_key_prefix ON public.kv_store_e884809f (key text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_kv_updated_at ON public.kv_store_e884809f (updated_at DESC);

ALTER TABLE public.kv_store_e884809f ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON public.kv_store_e884809f;
DROP POLICY IF EXISTS "Anon users have access" ON public.kv_store_e884809f;

CREATE POLICY "Service role full access" ON public.kv_store_e884809f FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Anon users have access" ON public.kv_store_e884809f FOR ALL TO anon USING (true) WITH CHECK (true);

SELECT '✅ Table créée avec succès !' as status;
```

</details>

**→ Clique sur RUN**

Tu dois voir : `✅ Table créée avec succès !`

### ✅ Étape 4 : Teste en Preview dans Figma Make
1. Retourne dans Figma Make
2. Clique sur **▶️ Preview**
3. L'erreur `Could not find table` devrait disparaître

### ✅ Étape 5 : Publie ton app
1. Clique sur **Publish** dans Figma Make
2. Copie l'URL reçue
3. Envoie-la sur ton téléphone
4. Ouvre-la dans Safari/Chrome
5. **TESTE TON APP ! 🎮📱**

---

## 🎯 Connexion de test

Une fois sur l'app :
- **Email** : `rudylabor@hotmail.fr`
- **Password** : `password123`

---

## ❌ Si ça ne marche toujours pas

### Problème de publication ?
→ Lis `/REFACTORING_COMPLETE.md`

### Problème de table ?
→ Lis `/CREATION_TABLE_FACILE.md`

### Autre erreur ?
→ Copie l'erreur exacte et on débogue ensemble !

---

## 📚 Documentation complète

- `/MARCHE_A_SUIVRE_MAINTENANT.md` - Guide détaillé complet
- `/REFACTORING_COMPLETE.md` - Détails de la refactorisation serveur
- `/CREATION_TABLE_FACILE.md` - Guide création table détaillé
- `/FIX_KV_STORE_TABLE.md` - Explications techniques

---

## 🚀 C'EST PARTI !

**Tu es à 2 minutes de tester Squad Planner sur ton téléphone !**

Commence par l'étape 1 ci-dessus ☝️
