# 📸 Instructions pour Générer TOUS les Screenshots

## ⚡ Solution Rapide (5 minutes)

### Étape 1 : Installation de Puppeteer

```bash
# Ouvre un terminal dans le dossier du projet
npm install --save-dev puppeteer
```

### Étape 2 : Lance l'application

```bash
# Terminal 1 : Lance l'app
npm run dev

# Attends que l'app soit prête sur http://localhost:5173
```

### Étape 3 : Exécute le script de génération

```bash
# Terminal 2 : Lance le générateur de screenshots
node scripts/generate-screenshots.js
```

### Étape 4 : Visualise les résultats

```bash
# Ouvre le fichier index.html généré
# Windows
start screenshots/index.html

# Mac
open screenshots/index.html

# Linux
xdg-open screenshots/index.html
```

---

## 📁 Résultat Attendu

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
│   ├── create-squad.png
│   ├── squad-detail.png
│   ├── squad-management.png
│   ├── squad-chat.png
│   ├── squad-health.png
│   ├── squad-composition.png
│   ├── join-squad.png
│   └── discover-squads.png
├── Sessions/
│   ├── propose-session.png
│   ├── vote-session.png
│   ├── recurring-session.png
│   ├── check-in.png
│   └── history.png
├── Profile/
│   ├── edit-profile.png
│   ├── public-profile.png
│   ├── preferences.png
│   └── privacy.png
├── Social/
│   ├── friends.png
│   ├── search-players.png
│   ├── community.png
│   └── activity-feed.png
├── Stats/
│   ├── advanced-stats.png
│   ├── availability-heatmap.png
│   ├── leadership-analysis.png
│   └── weekly-recap.png
├── Gamification/
│   ├── achievements.png
│   ├── badges.png
│   ├── leaderboard.png
│   ├── ranking.png
│   ├── challenges.png
│   ├── seasons.png
│   ├── tournaments.png
│   └── leagues.png
├── Advanced/
│   ├── smart-suggestions.png
│   ├── intelligence.png
│   ├── auto-coaching.png
│   ├── coaching-tools.png
│   └── academy.png
├── Integrations/
│   ├── integrations.png
│   ├── calendar-sync.png
│   ├── discord-bot.png
│   ├── webhooks.png
│   └── plugins.png
├── Esport/
│   ├── esport-team.png
│   ├── esport-integrations.png
│   ├── streamer-dashboard.png
│   └── organization.png
├── Settings/
│   ├── notifications.png
│   ├── notification-settings.png
│   ├── premium.png
│   └── share.png
├── Documentation/
│   ├── design-doc.png
│   ├── api-docs.png
│   ├── features-demo.png
│   ├── qa-tests.png
│   └── test-setup.png
└── index.html ← Ouvre ce fichier pour tout visualiser
```

---

## 🛠️ Problèmes Possibles et Solutions

### ❌ Erreur : "Cannot find module 'puppeteer'"

**Solution :**
```bash
npm install --save-dev puppeteer
```

### ❌ Erreur : "Navigation timeout"

**Causes possibles :**
1. L'app n'est pas lancée sur http://localhost:5173
2. Une page prend trop de temps à charger

**Solution :**
```bash
# 1. Vérifie que l'app tourne
npm run dev

# 2. Augmente le timeout dans le script (ligne 138)
await page.goto(`${BASE_URL}${screen.path}`, {
  waitUntil: 'networkidle2',
  timeout: 30000, // Augmente à 30 secondes
});
```

### ❌ Erreur : "Address already in use"

**Solution :**
```bash
# Tue le processus sur le port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9

# Puis relance
npm run dev
```

### ❌ Les screenshots sont vides ou blancs

**Causes :**
- Le bypass mode est activé
- Les données de démo ne sont pas chargées

**Solution :**
Modifier le script pour attendre plus longtemps :
```javascript
// Ligne 142 du script
await page.waitForTimeout(5000); // Augmente à 5 secondes
```

---

## 🎯 Alternative : Screenshots Manuels

Si le script ne fonctionne pas, voici comment faire manuellement :

### Outils recommandés

**Windows :**
- Outil Capture d'écran (Win + Shift + S)
- Snagit (payant mais excellent)

**Mac :**
- Capture d'écran (Cmd + Shift + 4)
- CleanShot X (payant mais excellent)

**Chrome Extension :**
- Awesome Screenshot
- Fireshot

### Processus manuel

1. **Lance l'app**
   ```bash
   npm run dev
   ```

2. **Configure la fenêtre en mode mobile**
   - Chrome DevTools (F12)
   - Toggle device toolbar (Ctrl + Shift + M)
   - Sélectionne "iPhone 12 Pro" ou "Pixel 5"

3. **Navigue et screenshot chaque page**
   - Va sur http://localhost:5173/login
   - Prends un screenshot
   - Sauvegarde comme `01-auth/login.png`
   - Répète pour les 61 écrans

4. **Organise dans des dossiers**
   Crée la structure de dossiers mentionnée ci-dessus

---

## 🎨 Personnalisation des Screenshots

Tu peux modifier le script pour capturer différentes tailles :

### Format iPhone
```javascript
defaultViewport: {
  width: 375,
  height: 812,
  deviceScaleFactor: 2,
}
```

### Format iPad
```javascript
defaultViewport: {
  width: 768,
  height: 1024,
  deviceScaleFactor: 2,
}
```

### Format Desktop
```javascript
defaultViewport: {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
}
```

### Générer plusieurs formats

Modifie le script pour générer toutes les tailles :

```javascript
const viewports = [
  { name: 'mobile', width: 375, height: 812, scale: 2 },
  { name: 'tablet', width: 768, height: 1024, scale: 2 },
  { name: 'desktop', width: 1920, height: 1080, scale: 1 },
];

for (const viewport of viewports) {
  await page.setViewport({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.scale,
  });
  
  const filename = `${screen.name}-${viewport.name}.png`;
  // ... reste du code
}
```

---

## ✅ Checklist Finale

Après la génération, vérifie :

- [ ] Toutes les catégories ont des screenshots
- [ ] Chaque screenshot est lisible
- [ ] Les couleurs sont correctes (Amber + Teal)
- [ ] Pas de screenshots vides ou d'erreurs
- [ ] L'index.html s'ouvre correctement
- [ ] Tu peux naviguer entre les catégories

---

## 📤 Partage avec Google Antigravity

Une fois générés :

1. **Crée une archive**
   ```bash
   zip -r squad-planner-screenshots.zip screenshots/
   ```

2. **Upload sur Google Drive**
   - Upload le zip
   - Génère un lien de partage public

3. **Partage avec l'IA**
   ```
   Voici tous les screenshots de Squad Planner :
   [LIEN GOOGLE DRIVE]
   
   Organisation :
   - 61 screenshots total
   - 13 catégories
   - Format mobile (375x812)
   - Qualité 2x (Retina)
   
   Analyse ces images et familiarise-toi avec le design system.
   ```

---

## 🎉 C'est Tout !

Le script devrait générer les 61 screenshots en ~5 minutes.

Si tu rencontres un problème, vérifie :
1. ✅ L'app tourne sur http://localhost:5173
2. ✅ Puppeteer est installé
3. ✅ Le script est dans /scripts/generate-screenshots.js
4. ✅ Tu exécutes depuis la racine du projet

**Besoin d'aide ?** Copie-colle l'erreur exacte que tu obtiens.
