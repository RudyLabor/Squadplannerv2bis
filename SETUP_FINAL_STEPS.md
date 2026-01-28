# 🚀 Étapes Finales - Squad Planner

Tout est presque prêt ! Voici les dernières étapes à suivre.

---

## ✅ Déjà Fait
- [x] Discord Bot code complet
- [x] Fichier `.env` configuré avec tes credentials
- [x] VAPID keys générées pour push notifications
- [x] Dépendances installées
- [x] Code compilé

---

## 📋 À Faire (5 minutes)

### 1. Trouver ton Guild ID (ID du serveur Discord)

1. Ouvre **Discord**
2. Va dans **Paramètres utilisateur** (roue dentée en bas)
3. **Avancé** → Active le **Mode développeur**
4. **Clic droit sur ton serveur** (dans la liste à gauche)
5. **"Copier l'identifiant"**
6. Modifie le fichier `discord-bot/.env` et remplace `REMPLACE_PAR_TON_GUILD_ID` par l'ID copié

### 2. Appliquer les migrations SQL

1. Va sur **[Supabase Dashboard SQL Editor](https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/sql/new)**
2. Copie-colle le contenu de `supabase/migrations/20260129_discord_bot_tables.sql`
3. Clique **Run**
4. Copie-colle le contenu de `supabase/migrations/20260129_push_subscriptions.sql`
5. Clique **Run**

### 3. Inviter le bot sur ton serveur

Ouvre ce lien (remplace CLIENT_ID si besoin) :
```
https://discord.com/api/oauth2/authorize?client_id=1466209230909476918&permissions=277025508352&scope=bot%20applications.commands
```

### 4. Enregistrer les slash commands

```bash
cd discord-bot
npm run deploy-commands
```

### 5. Lancer le bot

```bash
cd discord-bot
npm run dev
```

Tu devrais voir :
```
🚀 Starting Squad Planner Discord Bot...
🤖 Squad Planner Bot is online!
```

---

## 🎮 Tester le bot

Dans ton serveur Discord :
- `/help` - Afficher l'aide
- `/squad info` - Voir les infos du squad
- `/session Valorant demain 21h` - Créer une session

---

## ❓ Problèmes courants

### "Missing Access" ou erreur 50001
→ Le bot n'est pas sur le serveur ou manque de permissions

### "Unknown Guild"
→ Le GUILD_ID dans `.env` est incorrect

### Commandes non visibles
→ Relance `npm run deploy-commands`

---

## 📞 Support

Si tu as des questions, je suis là pour t'aider !
