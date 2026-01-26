# 📱 SQUAD PLANNER EXPO - GUIDE COMPLET

## 🎯 VOUS ÊTES ICI POUR...

### 🚀 Lancer l'app Expo mobile MAINTENANT
➡️ **Ouvrez** : [`START_EXPO_HERE.txt`](./START_EXPO_HERE.txt) (copier-coller 3 commandes)

### 📖 Instructions visuelles étape par étape (Windows)
➡️ **Ouvrez** : [`INSTRUCTIONS_VISUELLES_WINDOWS.txt`](./INSTRUCTIONS_VISUELLES_WINDOWS.txt)

### ⚡ Commandes rapides PowerShell
➡️ **Ouvrez** : [`COMMANDES_POWERSHELL.txt`](./COMMANDES_POWERSHELL.txt)

### 🔧 Résoudre un problème
➡️ **Consultez** : [`expo-app/TROUBLESHOOTING_WINDOWS.md`](./expo-app/TROUBLESHOOTING_WINDOWS.md)

### 📚 Comprendre l'architecture (Figma Make vs Expo)
➡️ **Lisez** : [`DEUX_VERSIONS_EXPLICATIONS.md`](./DEUX_VERSIONS_EXPLICATIONS.md)

### 🎓 Voir ce qui a été fait aujourd'hui
➡️ **Consultez** : [`RECAP_SESSION_EXPO.md`](./RECAP_SESSION_EXPO.md)

---

## 🎉 RÉSUMÉ : TOUT EST PRÊT !

### ✅ Ce qui a été corrigé
1. **Configuration Expo** : Plugin `expo-router` supprimé
2. **Point d'entrée** : `package.json` corrigé
3. **Assets** : Références retirées (non nécessaires pour tests)
4. **Supabase** : URL et clé configurées dans `app.json`

### ✅ Ce qui a été créé
- **12 fichiers de documentation** pour vous guider
- **Script PowerShell** pour lancer automatiquement
- **Guides visuels** étape par étape
- **Troubleshooting complet** pour Windows

---

## 🚀 LANCEMENT ULTRA-RAPIDE (3 COMMANDES)

```powershell
cd expo-app
npm install
npx expo start --clear
```

**Puis scannez le QR code avec Expo Go ! 📱**

---

## 📂 STRUCTURE DU PROJET

```
squadplanner/
│
├── 🌐 VERSION FIGMA MAKE (Web - INTACTE ✅)
│   └── src/
│       └── app/App.tsx
│
├── 📱 VERSION EXPO (Mobile - CORRIGÉE ✅)
│   └── expo-app/
│       ├── App.tsx
│       ├── src/
│       ├── app.json (CORRIGÉ)
│       ├── package.json (CORRIGÉ)
│       └── lancer-expo.ps1
│
└── 📚 DOCUMENTATION EXPO
    ├── START_EXPO_HERE.txt ⭐ COMMENCER ICI
    ├── INSTRUCTIONS_VISUELLES_WINDOWS.txt
    ├── COMMANDES_POWERSHELL.txt
    ├── TOUT_EST_PRET.md
    ├── INDEX_EXPO.md
    ├── DEUX_VERSIONS_EXPLICATIONS.md
    ├── RECAP_SESSION_EXPO.md
    └── README_EXPO_COMPLET.md (📄 Vous êtes ici !)
```

---

## 📚 INDEX COMPLET DE LA DOCUMENTATION

### 🎯 Pour démarrer rapidement

| Fichier | Quand l'utiliser | Temps de lecture |
|---------|------------------|------------------|
| [`START_EXPO_HERE.txt`](./START_EXPO_HERE.txt) | ⭐ Point d'entrée principal | 1 min |
| [`COMMANDES_POWERSHELL.txt`](./COMMANDES_POWERSHELL.txt) | Copier-coller rapide | 30 sec |
| [`INSTRUCTIONS_VISUELLES_WINDOWS.txt`](./INSTRUCTIONS_VISUELLES_WINDOWS.txt) | Guide visuel étape par étape | 3 min |

### 📖 Pour comprendre en détail

| Fichier | Contenu | Temps de lecture |
|---------|---------|------------------|
| [`TOUT_EST_PRET.md`](./TOUT_EST_PRET.md) | Récapitulatif complet de la config | 5 min |
| [`DEUX_VERSIONS_EXPLICATIONS.md`](./DEUX_VERSIONS_EXPLICATIONS.md) | Architecture Figma Make vs Expo | 7 min |
| [`RECAP_SESSION_EXPO.md`](./RECAP_SESSION_EXPO.md) | Résumé de la session de config | 10 min |

### 🔧 Pour résoudre des problèmes

| Fichier | Contenu | Temps de lecture |
|---------|---------|------------------|
| [`expo-app/TROUBLESHOOTING_WINDOWS.md`](./expo-app/TROUBLESHOOTING_WINDOWS.md) | Solutions aux erreurs courantes | 10 min |
| [`expo-app/LANCER_EXPO.md`](./expo-app/LANCER_EXPO.md) | Guide détaillé de lancement | 8 min |

### 🎓 Pour aller plus loin

| Fichier | Contenu | Temps de lecture |
|---------|---------|------------------|
| [`expo-app/README.md`](./expo-app/README.md) | Documentation technique complète | 15 min |
| [`INDEX_EXPO.md`](./INDEX_EXPO.md) | Index de toute la documentation | 5 min |

---

## ⚡ WORKFLOW RECOMMANDÉ

### 🥇 Première utilisation

1. **Ouvrez** [`START_EXPO_HERE.txt`](./START_EXPO_HERE.txt)
2. **Copiez-collez** les 3 commandes dans PowerShell
3. **Installez** Expo Go sur votre téléphone
4. **Scannez** le QR code
5. **Profitez** de Squad Planner ! 🎮

### 🔄 Utilisations suivantes

```powershell
cd expo-app
npx expo start
```

### 🐛 En cas de problème

1. **Consultez** [`expo-app/TROUBLESHOOTING_WINDOWS.md`](./expo-app/TROUBLESHOOTING_WINDOWS.md)
2. **Essayez** la solution proposée
3. **Relancez** avec `npx expo start --clear`

---

## 🎨 DESIGN SYSTEM

Squad Planner utilise un design **premium mobile-first** :

### Palette couleurs
- **Amber** : `#F59E0B` (actions principales, "Partant")
- **Teal** : `#14B8A6` (accents, boutons secondaires)
- **Fond sombre** : `#1A1816` (background principal)
- **Beige clair** : `#F5F3F0` (splash, backgrounds clairs)

### Principes UX
- ✅ **Clarté immédiate** : "En 5 secondes je sais quand on joue"
- ✅ **RSVP en 1 tap** : Vert = Partant, Rouge = Pas dispo
- ✅ **Zéro surcharge** : Design épuré, moderne, sobre
- ✅ **Mobile-first** : Optimisé pour écrans tactiles
- ✅ **Gaming premium** : Pas de cartoon, pas de "gamer agressif"

### Technologies
- **React Native** : Framework mobile
- **Expo** : Toolchain et DevTools
- **NativeWind** : Tailwind CSS pour React Native
- **React Navigation** : Navigation (Tabs + Stack)
- **Supabase** : Backend et Auth

---

## 🌐 BACKEND PARTAGÉ

Les deux versions (Figma Make + Expo) utilisent **le même backend Supabase** :

- **URL** : `https://cwtoprbowdqcemdjrtir.supabase.co`
- **Auth** : Supabase Auth (email/password)
- **Storage** : Key-Value Store (`kv_store_e884809f`)
- **Server** : Hono web server dans `/supabase/functions/server/`
- **Routes** : `/make-server-e884809f/*`

✅ **Avantage** : Un utilisateur créé dans Figma Make peut se connecter dans Expo, et vice-versa !

---

## ✅ FONCTIONNALITÉS DISPONIBLES

### Authentification
- [x] Inscription (email + mot de passe)
- [x] Connexion
- [x] Contexte Auth global
- [x] Navigation conditionnelle (Auth/Main)

### Squads
- [x] Liste des squads
- [x] Créer une squad
- [x] Détail d'une squad
- [x] Inviter des membres
- [x] Voir les membres

### Sessions
- [x] Liste des sessions
- [x] Proposer un créneau (date + heure)
- [x] RSVP : Je suis partant / Pas dispo
- [x] Compteur de participants
- [x] Badge "Prochaine session"

### Profil
- [x] Profil utilisateur
- [x] Édition profil
- [x] Score de fiabilité
- [x] Historique de présence

### Navigation
- [x] Bottom Tabs (Home, Squads, Sessions, Profile)
- [x] Stack Navigation pour les détails
- [x] Deep linking
- [x] Transitions fluides

---

## ⚠️ POINTS IMPORTANTS

### ✅ Figma Make est protégé
- **Version Expo** : Dossier `/expo-app/`
- **Version Figma Make** : Dossier `/src/`
- **Aucun fichier partagé** : Les deux sont indépendantes
- **Aucun risque** de casser Figma Make en lançant Expo

### ✅ Dépendances séparées
- `/package.json` : Dépendances Figma Make (React, Vite, Tailwind)
- `/expo-app/package.json` : Dépendances Expo (React Native, Expo, NativeWind)

### ✅ Configuration séparée
- `/vite.config.ts` : Configuration Vite (Figma Make)
- `/expo-app/app.json` : Configuration Expo (mobile)

---

## 🎯 PROCHAINES ÉTAPES (OPTIONNEL)

### Court terme
- [ ] Tester toutes les fonctionnalités sur mobile
- [ ] Inviter des amis à tester avec Expo Go
- [ ] Ajuster le design si nécessaire

### Moyen terme
- [ ] Créer des assets personnalisés (icône, splash screen)
- [ ] Configurer EAS Build
- [ ] Générer un APK Android de test

### Long terme
- [ ] Publier sur Expo
- [ ] Build standalone (APK/IPA)
- [ ] Déployer sur Google Play Store / Apple App Store

---

## 📱 TÉLÉCHARGER EXPO GO

### Android (Google Play Store)
```
https://play.google.com/store/apps/details?id=host.exp.exponent
```

### iOS (App Store)
```
https://apps.apple.com/app/expo-go/id982107779
```

---

## 🆘 BESOIN D'AIDE ?

### Expo ne démarre pas ?
➡️ Consultez [`expo-app/TROUBLESHOOTING_WINDOWS.md`](./expo-app/TROUBLESHOOTING_WINDOWS.md)

### Je ne comprends pas pourquoi deux versions ?
➡️ Lisez [`DEUX_VERSIONS_EXPLICATIONS.md`](./DEUX_VERSIONS_EXPLICATIONS.md)

### J'ai peur de casser Figma Make
➡️ **Aucun risque** : Expo ne touche que `/expo-app/`, jamais `/src/`

### Les commandes ne marchent pas
➡️ Vérifiez que vous êtes dans le dossier `expo-app` : `cd expo-app`

### Expo Go ne trouve pas l'app
➡️ Vérifiez que PC et téléphone sont sur le **même WiFi**  
➡️ Essayez le mode tunnel : `npx expo start --tunnel`

---

## ✅ CHECKLIST AVANT DE LANCER

- [ ] Node.js est installé (`node --version`)
- [ ] Vous êtes dans le dossier `expo-app` (`cd expo-app`)
- [ ] Les dépendances sont installées (`npm install`)
- [ ] PC et téléphone sont sur le même WiFi
- [ ] Expo Go est installé sur le téléphone

---

## 🎓 RESSOURCES OFFICIELLES

- **Documentation Expo** : https://docs.expo.dev/
- **Documentation React Navigation** : https://reactnavigation.org/
- **Documentation Supabase** : https://supabase.com/docs
- **Documentation NativeWind** : https://www.nativewind.dev/

---

## 🎮 PROFITEZ DE SQUAD PLANNER !

**Vous êtes à 3 commandes PowerShell de tester Squad Planner sur votre téléphone ! 📱**

### Option 1 : Commandes manuelles
```powershell
cd expo-app
npm install
npx expo start --clear
```

### Option 2 : Script automatique
```powershell
cd expo-app
.\lancer-expo.ps1
```

**Choisissez votre méthode préférée et lancez-vous ! 🚀**

---

## 📖 DOCUMENTATION RECOMMANDÉE PAR PROFIL

### 👨‍💻 Développeur
1. [`expo-app/README.md`](./expo-app/README.md) : Doc technique
2. [`DEUX_VERSIONS_EXPLICATIONS.md`](./DEUX_VERSIONS_EXPLICATIONS.md) : Architecture
3. [`RECAP_SESSION_EXPO.md`](./RECAP_SESSION_EXPO.md) : Historique des changements

### 🎮 Utilisateur final
1. [`START_EXPO_HERE.txt`](./START_EXPO_HERE.txt) : Lancement rapide
2. [`INSTRUCTIONS_VISUELLES_WINDOWS.txt`](./INSTRUCTIONS_VISUELLES_WINDOWS.txt) : Guide visuel
3. [`expo-app/TROUBLESHOOTING_WINDOWS.md`](./expo-app/TROUBLESHOOTING_WINDOWS.md) : Dépannage

### 🎨 Designer
1. [`DEUX_VERSIONS_EXPLICATIONS.md`](./DEUX_VERSIONS_EXPLICATIONS.md) : Design system
2. [`TOUT_EST_PRET.md`](./TOUT_EST_PRET.md) : Récapitulatif complet
3. `Guidelines.md` : Règles UX/UI (à la racine)

---

╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║                    ✅ TOUT EST PRÊT POUR VOUS ! ✅                        ║
║                                                                           ║
║         Ouvrez START_EXPO_HERE.txt et suivez les 3 étapes ! 🚀           ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
