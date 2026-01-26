# 📸 Générateur de Screenshots - Squad Planner

Ce script génère automatiquement des screenshots de **tous les 61 écrans** de l'application.

## ⚡ Utilisation Rapide

### 1. Installation
```bash
npm install --save-dev puppeteer
```

### 2. Lancement

**Terminal 1 - Lance l'app :**
```bash
npm run dev
```

Attends que l'app soit disponible sur `http://localhost:5173`

**Terminal 2 - Génère les screenshots :**
```bash
node scripts/generate-screenshots.js
```

### 3. Visualisation

```bash
# Ouvre le fichier HTML généré
open screenshots/index.html
```

## 📁 Résultat

```
screenshots/
├── 01-Auth/           (3 écrans)
├── 02-Main/           (4 écrans)
├── 03-Squads/         (8 écrans)
├── 04-Sessions/       (5 écrans)
├── 05-Profile/        (4 écrans)
├── 06-Social/         (4 écrans)
├── 07-Stats/          (4 écrans)
├── 08-Gamification/   (8 écrans)
├── 09-Advanced/       (5 écrans)
├── 10-Integrations/   (5 écrans)
├── 11-Esport/         (4 écrans)
├── 12-Settings/       (4 écrans)
├── 13-Documentation/  (5 écrans)
└── index.html         ← Ouvre ce fichier !
```

## 🎨 Caractéristiques

- ✅ Format iPhone X (375x812 @ 2x)
- ✅ Screenshots haute qualité (Retina)
- ✅ Organisation par catégories
- ✅ Page HTML interactive
- ✅ Bypass auth automatique
- ✅ ~5 minutes pour 61 écrans

## 🛠️ Résolution de Problèmes

### L'app n'est pas lancée
```bash
# Assure-toi que l'app tourne sur le bon port
npm run dev
# Puis vérifie http://localhost:5173
```

### Erreur "Cannot find module 'puppeteer'"
```bash
npm install --save-dev puppeteer
```

### Screenshots vides ou blancs
Le script attend 3 secondes par page. Si ton ordinateur est lent, augmente le délai :
```javascript
// Ligne 200 dans le script
await page.waitForTimeout(5000); // Augmente à 5 secondes
```

### Timeout errors
Augmente le timeout :
```javascript
// Ligne 192 dans le script
timeout: 30000, // Augmente à 30 secondes
```

## 🎯 Formats Différents

Pour changer le format des screenshots, modifie les lignes 132-136 :

**iPad :**
```javascript
defaultViewport: {
  width: 768,
  height: 1024,
  deviceScaleFactor: 2,
}
```

**Desktop :**
```javascript
defaultViewport: {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
}
```

## 📤 Partage

Une fois générés, tu peux :
1. Compresser le dossier : `zip -r screenshots.zip screenshots/`
2. Partager sur Google Drive / Dropbox
3. Commit sur GitHub
4. Envoyer à ton agent IA

## ✅ Checklist

- [ ] Puppeteer installé
- [ ] App lancée sur localhost:5173
- [ ] Script exécuté sans erreurs
- [ ] 61 screenshots générés
- [ ] index.html fonctionne

---

**Besoin d'aide ?** Consulte `/INSTRUCTIONS_SCREENSHOTS.md` pour plus de détails.
