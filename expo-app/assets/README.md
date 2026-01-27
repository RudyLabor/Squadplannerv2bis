# 📱 Assets requis pour l'App Store

## Fichiers à créer

### 1. `icon.png` (Icône de l'app)
- **Taille** : 1024 x 1024 pixels
- **Format** : PNG
- **Coins** : Carrés (iOS arrondit automatiquement)
- **Fond** : Opaque (pas de transparence pour iOS)

### 2. `splash.png` (Écran de chargement)
- **Taille recommandée** : 1284 x 2778 pixels (iPhone 14 Pro Max)
- **Format** : PNG
- **Couleur de fond** : #F5F3F0 (beige Squad Planner)

### 3. `adaptive-icon.png` (Android)
- **Taille** : 1024 x 1024 pixels
- **Format** : PNG avec transparence
- **Zone sûre** : Logo au centre dans un cercle de 66%

### 4. `favicon.png` (Web)
- **Taille** : 48 x 48 pixels
- **Format** : PNG

---

## Design recommandé

### Icône Squad Planner
- Logo hexagonal avec les couleurs :
  - Amber : #F59E0B
  - Teal : #14B8A6
- Fond : Gradient amber vers teal
- Symbole : Manette de jeu ou icône de groupe

### Splash Screen
- Fond : #F5F3F0
- Logo centré
- Texte "Squad Planner" en dessous

---

## Outils pour créer les assets

### Option 1 : Figma (Gratuit)
1. Créer un nouveau fichier 1024x1024
2. Designer l'icône
3. Exporter en PNG

### Option 2 : Canva (Gratuit)
1. Nouveau design "Logo"
2. Taille personnalisée 1024x1024
3. Télécharger en PNG

### Option 3 : icon.kitchen (Générateur)
1. Aller sur https://icon.kitchen
2. Uploader votre logo
3. Générer tous les formats automatiquement

---

## Une fois les assets créés

1. Placer les fichiers dans ce dossier `assets/`
2. Vérifier que les noms correspondent :
   - `icon.png`
   - `splash.png`
   - `adaptive-icon.png`
   - `favicon.png`

3. Lancer le build :
```bash
cd expo-app
npx eas build --platform all
```
