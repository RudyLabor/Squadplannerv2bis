# 🚀 Guide de Publication App Store - Squad Planner

## Prérequis

### Comptes nécessaires
- [ ] **Apple Developer Account** ($99/an) - https://developer.apple.com
- [ ] **Google Play Console** ($25 une fois) - https://play.google.com/console
- [ ] **Compte Expo** (gratuit) - https://expo.dev

### Outils à installer
```bash
npm install -g eas-cli
eas login
```

---

## Étape 1 : Créer les Assets

### Fichiers requis (dans `assets/`)
- `icon.png` (1024x1024) - Icône de l'app
- `splash.png` (1284x2778) - Écran de chargement
- `adaptive-icon.png` (1024x1024) - Icône Android adaptive
- `favicon.png` (48x48) - Favicon web

Voir `assets/README.md` pour les détails.

---

## Étape 2 : Configurer EAS

### 2.1 Initialiser le projet EAS
```bash
cd expo-app
eas init
```

### 2.2 Configurer les credentials iOS
```bash
eas credentials
```
Suivre les instructions pour :
- Créer/lier un App ID
- Créer un Distribution Certificate
- Créer un Provisioning Profile

### 2.3 Configurer les credentials Android
```bash
eas credentials --platform android
```
Suivre les instructions pour :
- Créer une keystore
- Générer une clé de signature

---

## Étape 3 : Build de l'Application

### Build de développement (test local)
```bash
eas build --profile development --platform all
```

### Build de preview (test interne)
```bash
eas build --profile preview --platform all
```

### Build de production (App Store)
```bash
eas build --profile production --platform all
```

---

## Étape 4 : Publication iOS (App Store)

### 4.1 Préparer App Store Connect
1. Aller sur https://appstoreconnect.apple.com
2. Créer une nouvelle app
3. Remplir les informations :
   - Nom : Squad Planner
   - Catégorie : Social Networking / Games
   - Langue : Français
   - Bundle ID : com.squadplanner.app

### 4.2 Informations requises
- **Nom** : Squad Planner
- **Sous-titre** : Organise tes sessions gaming
- **Description** : 
```
Squad Planner est l'application ultime pour organiser vos sessions gaming entre amis.

🎮 FONCTIONNALITÉS PRINCIPALES
• Créez et gérez vos squads
• Planifiez des sessions de jeu
• RSVP en un tap
• Statistiques de fiabilité
• Intégration Discord

🏆 POURQUOI SQUAD PLANNER ?
• Fini les "qui est dispo ce soir ?"
• Visibilité claire sur les disponibilités
• Score de fiabilité pour les joueurs
• Interface moderne et intuitive

📱 GRATUIT
Squad Planner est 100% gratuit. Rejoignez la communauté gaming !
```

- **Mots-clés** : gaming, squad, session, valorant, apex, groupe, amis, planifier, esport
- **URL Support** : https://squadplanner.app/support
- **URL Privacy Policy** : https://squadplanner.app/privacy

### 4.3 Screenshots requis
- iPhone 6.5" (1284x2778) - 3-5 screenshots
- iPhone 5.5" (1242x2208) - 3-5 screenshots
- iPad 12.9" (2048x2732) - si supportsTablet: true

### 4.4 Soumettre le build
```bash
eas submit --platform ios
```

---

## Étape 5 : Publication Android (Google Play)

### 5.1 Préparer Google Play Console
1. Aller sur https://play.google.com/console
2. Créer une nouvelle application
3. Remplir les informations

### 5.2 Informations requises
- **Nom** : Squad Planner
- **Description courte** : Organise tes sessions gaming entre amis
- **Description complète** : (même que iOS)
- **Catégorie** : Social / Communication

### 5.3 Screenshots requis
- Téléphone (au moins 2)
- Tablette 7" (optionnel)
- Tablette 10" (optionnel)

### 5.4 Soumettre le build
```bash
eas submit --platform android
```

---

## Checklist finale

### Avant soumission
- [ ] Tous les assets créés et placés dans `assets/`
- [ ] App testée sur iOS et Android
- [ ] Pas de crash
- [ ] Toutes les fonctionnalités marchent
- [ ] Textes en français corrects
- [ ] Privacy Policy en ligne
- [ ] Screenshots prêts

### Soumission iOS
- [ ] Build production créé
- [ ] App Store Connect configuré
- [ ] Informations remplies
- [ ] Screenshots uploadés
- [ ] Build soumis
- [ ] Review passée ✅

### Soumission Android
- [ ] Build production créé
- [ ] Google Play Console configuré
- [ ] Informations remplies
- [ ] Screenshots uploadés
- [ ] Build soumis
- [ ] Review passée ✅

---

## Commandes utiles

```bash
# Status des builds
eas build:list

# Voir les logs d'un build
eas build:view

# Annuler un build
eas build:cancel

# Mettre à jour OTA (sans rebuild)
eas update --branch production

# Voir les credentials
eas credentials
```

---

## Timeline estimée

| Étape | Durée |
|-------|-------|
| Création assets | 1-2 heures |
| Configuration EAS | 30 min |
| Build production | 15-30 min |
| Remplir App Store Connect | 1 heure |
| Remplir Google Play Console | 1 heure |
| Review iOS | 1-3 jours |
| Review Android | 1-7 jours |

**Total : 2-4 jours pour être sur les stores !**

---

## Support

- Documentation Expo : https://docs.expo.dev
- Documentation EAS : https://docs.expo.dev/eas
- Discord Expo : https://chat.expo.dev

---

*Créé le 27 janvier 2026*
*Version 1.0.0*
