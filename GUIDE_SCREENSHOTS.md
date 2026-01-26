# 📸 Guide Complet pour Obtenir les Screenshots de Squad Planner

## 🎯 3 Méthodes Disponibles

---

## ✅ **MÉTHODE 1 : Galerie Intégrée dans l'App** (RECOMMANDÉ - 0 EFFORT)

### Avantages
- ✅ Déjà disponible dans l'app
- ✅ Aucune installation nécessaire
- ✅ Screenshots en temps réel
- ✅ Visualisation interactive

### Étapes

1. **Lance l'application**
   ```bash
   npm run dev
   # Ou pour mobile
   cd expo-app && npx expo start
   ```

2. **Navigue vers la galerie**
   - Clique sur **Profil** (icône en bas à droite)
   - Clique sur **Paramètres** (icône engrenage en haut à droite)
   - Clique sur **Design System**
   - Sélectionne l'onglet **"📱 Galerie (56+ écrans)"**

3. **Prends des screenshots**
   - Chaque écran est listé avec son nom
   - Utilise l'outil de capture d'écran de ton système :
     - **Windows :** `Win + Shift + S`
     - **Mac :** `Cmd + Shift + 4`
     - **Mobile :** Bouton Power + Volume Bas

4. **Organisé automatiquement**
   - Les écrans sont groupés par catégorie
   - Facile de naviguer entre les pages

---

## 🤖 **MÉTHODE 2 : Script Automatique** (RECOMMANDÉ - GÉNÉRATION MASSIVE)

### Avantages
- ✅ Génère TOUS les screenshots automatiquement
- ✅ Organisés par catégories
- ✅ Page HTML de visualisation incluse
- ✅ Screenshots haute qualité (2x)

### Prérequis

```bash
# Installer Puppeteer
npm install --save-dev puppeteer
```

### Étapes

1. **Lance l'app en mode dev**
   ```bash
   npm run dev
   # L'app doit tourner sur http://localhost:5173
   ```

2. **Dans un autre terminal, exécute le script**
   ```bash
   node scripts/generate-screenshots.js
   ```

3. **Résultat**
   - Screenshots générés dans `/screenshots/`
   - Organisés par catégorie :
     ```
     screenshots/
     ├── Auth/
     │   ├── login.png
     │   └── signup.png
     ├── Main/
     │   ├── home.png
     │   ├── squads.png
     │   ├── sessions.png
     │   └── profile.png
     ├── Squads/
     ├── Sessions/
     ├── Profile/
     ├── Social/
     ├── Stats/
     ├── Gamification/
     ├── Advanced/
     ├── Integrations/
     ├── Esport/
     ├── Settings/
     └── Documentation/
     └── index.html  # Page de visualisation
     ```

4. **Visualise le résultat**
   ```bash
   # Ouvre dans le navigateur
   open screenshots/index.html
   # Ou
   firefox screenshots/index.html
   # Ou
   chrome screenshots/index.html
   ```

### Options de personnalisation

Tu peux modifier le script pour ajuster :

```javascript
// Taille d'écran (ligne 88-92)
defaultViewport: {
  width: 375,      // iPhone X width
  height: 812,     // iPhone X height
  deviceScaleFactor: 2,  // Retina 2x
}

// Changer pour desktop
defaultViewport: {
  width: 1920,     // Desktop HD
  height: 1080,
  deviceScaleFactor: 1,
}

// Changer pour tablet
defaultViewport: {
  width: 768,      // iPad
  height: 1024,
  deviceScaleFactor: 2,
}
```

---

## 📱 **MÉTHODE 3 : Screenshots Manuels Organisés**

### Avantages
- ✅ Contrôle total sur chaque screenshot
- ✅ Peut capturer des états spécifiques (hover, erreurs, etc.)
- ✅ Pas de configuration technique

### Checklist des 61 Écrans

#### 🔐 Auth (2)
- [ ] Login
- [ ] Signup

#### 🏠 Main (4)
- [ ] Home
- [ ] Squads
- [ ] Sessions
- [ ] Profile

#### 👥 Squads (8)
- [ ] Create Squad
- [ ] Squad Detail
- [ ] Squad Management
- [ ] Squad Chat
- [ ] Squad Health
- [ ] Squad Composition
- [ ] Join Squad
- [ ] Discover Squads

#### 🎮 Sessions (5)
- [ ] Propose Session
- [ ] Vote Session
- [ ] Recurring Session
- [ ] Check In
- [ ] History

#### 👤 Profile (4)
- [ ] Edit Profile
- [ ] Public Profile
- [ ] Preferences
- [ ] Privacy

#### 💬 Social (4)
- [ ] Friends
- [ ] Search Players
- [ ] Community
- [ ] Activity Feed

#### 📊 Stats (4)
- [ ] Advanced Stats
- [ ] Availability Heatmap
- [ ] Leadership Analysis
- [ ] Weekly Recap

#### 🏆 Gamification (8)
- [ ] Achievements
- [ ] Badges
- [ ] Leaderboard
- [ ] Ranking
- [ ] Challenges
- [ ] Seasons
- [ ] Tournaments
- [ ] Leagues

#### 🧠 Advanced (5)
- [ ] Smart Suggestions
- [ ] Intelligence
- [ ] Auto Coaching
- [ ] Coaching Tools
- [ ] Academy

#### 🔌 Integrations (5)
- [ ] Integrations
- [ ] Calendar Sync
- [ ] Discord Bot
- [ ] Webhooks
- [ ] Plugins

#### ⚡ Esport (4)
- [ ] Esport Team
- [ ] Esport Integrations
- [ ] Streamer Dashboard
- [ ] Organization

#### ⚙️ Settings (4)
- [ ] Notifications
- [ ] Notification Settings
- [ ] Premium
- [ ] Share

#### 📚 Documentation (5)
- [ ] Design Doc
- [ ] API Docs
- [ ] Features Demo
- [ ] QA Tests
- [ ] Test Setup

### Organisation suggérée

Crée cette structure de dossiers :

```
screenshots/
├── 01-auth/
├── 02-main/
├── 03-squads/
├── 04-sessions/
├── 05-profile/
├── 06-social/
├── 07-stats/
├── 08-gamification/
├── 09-advanced/
├── 10-integrations/
├── 11-esport/
├── 12-settings/
└── 13-documentation/
```

Nomme les fichiers de manière cohérente :
```
01-auth/01-login.png
01-auth/02-signup.png
02-main/01-home.png
02-main/02-squads.png
...
```

---

## 🎨 **MÉTHODE 4 : Export Figma (Si tu as le fichier source)**

Si tu as le fichier Figma d'origine :

1. Ouvre Figma
2. Sélectionne tous les frames
3. `File` > `Export` > `PNG @ 2x`
4. Choisis un dossier de destination
5. Organise selon les catégories ci-dessus

---

## 📤 **Partage des Screenshots**

### Pour partager avec Google Antigravity :

#### Option A : Zip complet
```bash
# Créer une archive
zip -r squad-planner-screenshots.zip screenshots/

# Partager le fichier zip
```

#### Option B : Google Drive / Dropbox
1. Upload le dossier `screenshots/` sur Drive/Dropbox
2. Génère un lien de partage public
3. Partage le lien avec l'IA

#### Option C : GitHub Repository
```bash
# Commit et push
git add screenshots/
git commit -m "Add app screenshots"
git push origin main

# Partage le lien du repo
```

#### Option D : Images individuelles
Si l'IA ne peut traiter qu'une image à la fois :
1. Commence par les écrans principaux (Home, Squads, Sessions, Profile)
2. Puis envoie les écrans secondaires par catégorie
3. Utilise des descriptions pour chaque image

---

## 🤖 **Prompt pour Google Antigravity**

Une fois que tu as les screenshots, utilise ce prompt :

```
Je te partage les screenshots de toutes les pages de Squad Planner.

📊 STATISTIQUES :
- 61 écrans au total
- 13 catégories
- Design System v4.0 "Warm Premium"
- Palette : Amber (#F59E0B) + Teal (#14B8A6)

📁 ORGANISATION :
Les screenshots sont organisés par catégorie :
1. Auth (2 écrans)
2. Main (4 écrans)
3. Squads (8 écrans)
4. Sessions (5 écrans)
5. Profile (4 écrans)
6. Social (4 écrans)
7. Stats (4 écrans)
8. Gamification (8 écrans)
9. Advanced (5 écrans)
10. Integrations (5 écrans)
11. Esport (4 écrans)
12. Settings (4 écrans)
13. Documentation (5 écrans)

🎯 TA MISSION :
En analysant ces screenshots, tu dois :
1. Comprendre le design system complet
2. Identifier les patterns UI récurrents
3. Noter les composants réutilisables
4. Observer la hiérarchie visuelle
5. Comprendre le flow utilisateur
6. Maintenir la cohérence visuelle dans tes futures contributions

📌 FOCUS SUR :
- Palette de couleurs (Amber + Teal)
- Typography (Inter + Clash Display)
- Spacing system
- Cards design (glass effect)
- Buttons styles
- Navigation patterns
- Animations subtiles

[ATTACHE ENSUITE LES SCREENSHOTS OU LE LIEN]

Confirme que tu as bien reçu et analysé toutes les images.
```

---

## ⚡ **Quick Start (Le plus rapide)**

Si tu veux juste quelques images représentatives :

```bash
# 1. Lance l'app
npm run dev

# 2. Va sur ces 10 pages essentielles et screenshot :
- http://localhost:5173/                    # Home
- http://localhost:5173/login               # Login
- http://localhost:5173/squads              # Squads List
- http://localhost:5173/squads/detail       # Squad Detail
- http://localhost:5173/sessions/propose    # Propose Session
- http://localhost:5173/profile             # Profile
- http://localhost:5173/leaderboard         # Leaderboard
- http://localhost:5173/achievements        # Achievements
- http://localhost:5173/design-doc          # Design System
- http://localhost:5173/settings            # Settings
```

Ces 10 écrans donnent déjà un excellent aperçu de l'app !

---

## 🎬 **Bonus : Vidéo de Démonstration**

Au lieu de screenshots statiques, tu peux aussi créer une vidéo :

### Avec OBS Studio (gratuit)
1. Télécharge [OBS Studio](https://obsproject.com/)
2. Configure la capture d'écran
3. Lance l'enregistrement
4. Navigue dans toutes les pages
5. Stop et exporte la vidéo

### Avec Loom (le plus simple)
1. Installe [Loom Extension](https://www.loom.com/)
2. Clique sur "Start Recording"
3. Navigue dans l'app
4. Partage le lien vidéo avec l'IA

---

## ✅ Résumé des Recommandations

| Méthode | Effort | Qualité | Automatisation | Recommandation |
|---------|---------|---------|----------------|----------------|
| Galerie intégrée | ⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ✅ Débutants |
| Script auto | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Pros |
| Manuel | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | Pour contrôle total |
| Vidéo | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Pour démo complète |

**Ma recommandation : Commence par la Méthode 1 (galerie intégrée) pour visualiser, puis utilise la Méthode 2 (script automatique) pour générer tous les screenshots d'un coup !** 🚀

---

Besoin d'aide pour l'une de ces méthodes ? Dis-moi laquelle tu choisis ! 😊
