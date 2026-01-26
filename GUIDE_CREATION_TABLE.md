# 🎯 GUIDE COMPLET - CRÉER LA TABLE

## 🚀 MÉTHODE RAPIDE (2 MINUTES)

### Étape 1 : Ouvre Supabase SQL Editor
👉 **[Clique ici pour ouvrir directement](https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/sql/new)**

### Étape 2 : Choisis ta version

#### ✅ VERSION SIMPLE (Recommandée pour commencer)
Ouvre le fichier **`/CREATE_TABLE_SIMPLE.sql`** et copie tout le contenu

#### ✅ VERSION COMPLÈTE (Avec vérifications et tests)
Ouvre le fichier **`/CREATE_TABLE_COMPLETE.sql`** et copie tout le contenu

### Étape 3 : Colle dans SQL Editor
1. Colle le SQL copié dans l'éditeur Supabase
2. Clique sur le bouton **"RUN"** en haut à droite
3. Ou appuie sur `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### Étape 4 : Vérifie le succès
Tu devrais voir :
```
✅ Table kv_store_e884809f créée avec succès !
```

---

## 📋 CONTENU DE LA TABLE

La table `kv_store_e884809f` contient :

| Colonne | Type | Description |
|---------|------|-------------|
| `key` | TEXT | Clé unique (PRIMARY KEY) |
| `value` | JSONB | Valeur JSON (données de l'app) |
| `created_at` | TIMESTAMPTZ | Date de création |
| `updated_at` | TIMESTAMPTZ | Date de mise à jour |

### Patterns de clés utilisés

- `user:{userId}` → Profils utilisateurs
- `squad:{squadId}` → Données des squads
- `session:{squadId}:{sessionId}` → Sessions de jeu
- `webhook:{userId}:{webhookId}` → Webhooks
- `message:{squadId}:{messageId}` → Messages
- `notification:{userId}:{notifId}` → Notifications
- `checkin:{sessionId}:{userId}` → Check-ins
- `invite:{inviteCode}` → Codes d'invitation

---

## 🔍 VÉRIFICATIONS

### Vérifier que la table existe

1. Dans Supabase Dashboard, va dans **"Table Editor"**
2. Cherche **`kv_store_e884809f`** dans la liste
3. Elle doit apparaître avec 4 colonnes

### Vérifier les policies

1. Clique sur la table `kv_store_e884809f`
2. Va dans l'onglet **"Policies"**
3. Tu dois voir 2 policies actives :
   - ✅ `Service role full access`
   - ✅ `Anon users have access`

### Vérifier les index

1. Dans SQL Editor, exécute :
```sql
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'kv_store_e884809f';
```

2. Tu devrais voir au moins 2 index :
   - `kv_store_e884809f_pkey` (PRIMARY KEY)
   - `idx_kv_key_prefix`
   - `idx_kv_updated_at`

---

## 🧪 TESTER LA TABLE

### Test 1 : Insérer une donnée

```sql
INSERT INTO public.kv_store_e884809f (key, value) 
VALUES ('test:hello', '{"message": "Hello Squad Planner!"}');
```

### Test 2 : Lire la donnée

```sql
SELECT * FROM public.kv_store_e884809f 
WHERE key = 'test:hello';
```

### Test 3 : Mettre à jour

```sql
UPDATE public.kv_store_e884809f 
SET value = '{"message": "Hello World!", "updated": true}' 
WHERE key = 'test:hello';
```

### Test 4 : Vérifier l'auto-update du timestamp

```sql
SELECT key, value, created_at, updated_at 
FROM public.kv_store_e884809f 
WHERE key = 'test:hello';
```

Le champ `updated_at` devrait être différent de `created_at` !

### Test 5 : Nettoyer

```sql
DELETE FROM public.kv_store_e884809f 
WHERE key LIKE 'test:%';
```

---

## ✅ APRÈS LA CRÉATION

### 1. Teste l'app en Preview
1. Retourne dans Figma Make
2. Clique sur **▶️ Preview**
3. L'erreur `Could not find the table` devrait avoir disparu

### 2. Connecte-toi
Utilise le compte de test :
- **Email** : `rudylabor@hotmail.fr`
- **Password** : `password123`

### 3. Vérifie que ça fonctionne
Tu devrais voir :
- ✅ L'écran de connexion
- ✅ Le home screen après connexion
- ✅ Ton profil utilisateur
- ✅ La possibilité de créer des squads

### 4. Publie l'app
1. Clique sur **"Publish"** dans Figma Make
2. Copie l'URL reçue
3. Envoie-la sur ton téléphone
4. Ouvre-la dans Safari ou Chrome
5. **Teste Squad Planner en conditions réelles ! 🎮📱**

---

## ❌ RÉSOLUTION DE PROBLÈMES

### Erreur : "relation already exists"
✅ **C'est bon signe !** La table existe déjà. Continue au test.

### Erreur : "permission denied"
❌ Vérifie que tu es connecté avec le bon compte Supabase (celui qui a créé le projet Squad Planner)

### Erreur : "syntax error"
❌ Assure-toi d'avoir copié **tout le contenu** du fichier SQL sans rien modifier

### L'erreur persiste dans l'app
1. Vérifie que la table existe vraiment dans Table Editor
2. Vérifie que les policies sont actives
3. Redémarre la preview (ferme et rouvre)
4. Vide le cache du navigateur (Ctrl+Shift+Delete)

---

## 🆘 BESOIN D'AIDE ?

Si tu bloques, envoie-moi :
1. **Le message d'erreur exact** après avoir exécuté le SQL
2. **Une capture d'écran** du Table Editor montrant si la table existe ou non
3. **Le message d'erreur** dans l'app (ouvre la console avec F12)

Je t'aiderai à résoudre le problème ! 💪

---

## 📚 FICHIERS DISPONIBLES

- **`/CREATE_TABLE_SIMPLE.sql`** ← Version rapide (30 lignes)
- **`/CREATE_TABLE_COMPLETE.sql`** ← Version complète avec vérifications (200 lignes)
- **`/setup-instructions.html`** ← Guide visuel (ouvre dans ton navigateur)
- `/START_ICI.md` ← Guide de démarrage
- `/MARCHE_A_SUIVRE_MAINTENANT.md` ← Guide complet

---

**🚀 Prêt ? Copie le SQL et exécute-le dans Supabase !**
