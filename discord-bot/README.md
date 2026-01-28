# 🤖 Squad Planner Discord Bot

Bot Discord officiel pour Squad Planner - Coordonne tes sessions de jeu directement depuis Discord !

## ✨ Fonctionnalités

- **`/session`** - Créer une session de jeu
- **`/rsvp`** - Répondre à une invitation
- **`/squad`** - Voir les infos du squad
- **`/retard`** - Signaler un retard
- **`/profil`** - Gérer son compte lié
- **`/help`** - Afficher l'aide

### Notifications automatiques
- 📢 Rappel 24h avant la session
- ⏰ Rappel 1h avant la session
- 🎮 Notification au démarrage
- ✅ Notifications RSVP en temps réel

---

## 🚀 Installation (Guide Débutant)

### Prérequis
- [Node.js 18+](https://nodejs.org/) installé
- Un compte [Discord Developer](https://discord.com/developers/applications)
- Accès au projet [Supabase](https://supabase.com/)

### Étape 1: Configuration Discord

1. Va sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique sur ton application **SquadPlanner** (ou crée-en une)
3. Dans **Bot** :
   - Copie le **Token** (garde-le secret !)
   - Active les intents : `SERVER MEMBERS INTENT`, `MESSAGE CONTENT INTENT`
4. Dans **OAuth2 > General** :
   - Copie le **Client ID**
5. Dans **OAuth2 > URL Generator** :
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Send Messages`, `Embed Links`, `Read Message History`, `Use Slash Commands`
   - Copie l'URL et ouvre-la pour inviter le bot sur ton serveur

### Étape 2: Configuration Supabase

1. Va sur ton [Dashboard Supabase](https://supabase.com/dashboard)
2. **Settings > API** :
   - Copie l'**URL** du projet
   - Copie la clé **service_role** (pas anon !)

### Étape 3: Installation du Bot

```bash
# 1. Aller dans le dossier du bot
cd discord-bot

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env
cp .env.example .env
```

### Étape 4: Configuration .env

Ouvre le fichier `.env` et remplis les valeurs :

```env
# Discord
DISCORD_TOKEN=ton_token_bot
DISCORD_CLIENT_ID=ton_client_id
DISCORD_GUILD_ID=id_de_ton_serveur_test

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1...
```

> 💡 **Comment trouver l'ID du serveur ?**
> 1. Active le mode développeur dans Discord (Paramètres > Avancé)
> 2. Clic droit sur ton serveur > Copier l'identifiant

### Étape 5: Enregistrer les commandes

```bash
# Enregistrer les slash commands (à faire une seule fois)
npm run deploy-commands
```

### Étape 6: Lancer le bot

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

Tu devrais voir :
```
🚀 Starting Squad Planner Discord Bot...
🤖 Squad Planner Bot is online!
📊 Logged in as: SquadPlanner#1234
🌐 Serving 1 server(s)
⚡ 6 slash commands loaded
✅ Reminders scheduler started
```

---

## 🗄️ Tables Supabase Requises

Le bot nécessite ces tables supplémentaires dans ta base de données :

```sql
-- Table pour lier les comptes Discord aux comptes Squad Planner
CREATE TABLE discord_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id TEXT UNIQUE NOT NULL,
  discord_username TEXT,
  discord_avatar TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour lier les serveurs Discord aux squads
CREATE TABLE discord_guild_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT UNIQUE NOT NULL,
  guild_name TEXT,
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les codes de liaison temporaires
CREATE TABLE discord_link_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour tracker les rappels envoyés
CREATE TABLE session_reminders_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'h24', 'h1', 'h0'
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, reminder_type)
);

-- Index pour les recherches rapides
CREATE INDEX idx_discord_links_discord_id ON discord_links(discord_id);
CREATE INDEX idx_discord_guild_links_guild_id ON discord_guild_links(guild_id);
CREATE INDEX idx_session_reminders_session ON session_reminders_sent(session_id);
```

---

## 🚀 Déploiement en Production

### Option 1: Railway (Recommandé - Gratuit)

1. Va sur [railway.app](https://railway.app)
2. Connecte ton GitHub
3. Clique "New Project" > "Deploy from GitHub repo"
4. Sélectionne ton repo, dossier `discord-bot`
5. Ajoute les variables d'environnement dans Settings
6. Deploy !

### Option 2: Render (Gratuit)

1. Va sur [render.com](https://render.com)
2. Connecte ton GitHub
3. "New" > "Background Worker"
4. Configure :
   - Build: `npm install && npm run build`
   - Start: `npm start`
5. Ajoute les variables d'environnement
6. Deploy !

### Option 3: VPS (DigitalOcean, etc.)

```bash
# Sur ton serveur
git clone <ton-repo>
cd discord-bot
npm install
npm run build

# Avec PM2 pour garder le bot en vie
npm install -g pm2
pm2 start dist/index.js --name squadplanner-bot
pm2 save
pm2 startup
```

---

## 📝 Commandes Disponibles

| Commande | Description | Exemple |
|----------|-------------|---------|
| `/session` | Créer une session | `/session Valorant demain 21h` |
| `/rsvp` | Répondre à une session | `/rsvp oui` |
| `/squad info` | Voir les infos du squad | `/squad info` |
| `/squad sessions` | Sessions à venir | `/squad sessions` |
| `/squad membres` | Liste des membres | `/squad membres` |
| `/squad link` | Lier un serveur (Admin) | `/squad link ABC123` |
| `/retard` | Signaler un retard | `/retard 15 embouteillages` |
| `/profil info` | Voir son profil | `/profil info` |
| `/profil link` | Lier son compte | `/profil link CODE123` |
| `/help` | Afficher l'aide | `/help` |

---

## 🔧 Dépannage

### Le bot ne répond pas aux commandes
1. Vérifie que les commandes sont enregistrées : `npm run deploy-commands`
2. Vérifie que le bot a les permissions nécessaires
3. Vérifie les logs du bot

### "Compte non lié"
L'utilisateur doit lier son compte Discord à Squad Planner :
1. Dans l'app Squad Planner : Profil > Intégrations > Discord
2. Générer un code de liaison
3. Dans Discord : `/profil link <code>`

### "Serveur non configuré"
Un admin du serveur doit lier le serveur à un squad :
1. Obtenir le code d'invitation du squad depuis l'app
2. Dans Discord : `/squad link <code>`

---

## 📜 Licence

Propriétaire - Squad Planner © 2026
