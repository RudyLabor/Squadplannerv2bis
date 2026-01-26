# 🎮 Squad Planner - Version Expo Mobile

## ⚠️ IMPORTANT : Cette version N'AFFECTE PAS Figma Make

Cette version Expo est **totalement indépendante** de la version Figma Make dans `/src/`.

---

## 🚀 LANCEMENT RAPIDE (PowerShell)

### Option 1 : Script automatique (RECOMMANDÉ)
```powershell
.\lancer-expo.ps1
```

### Option 2 : Commandes manuelles
```powershell
npm install       # Première fois uniquement
npx expo start    # Lancer Expo
```

---

## 📱 TESTER SUR TÉLÉPHONE

1. **Installez Expo Go** :
   - Android : [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS : [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Scannez le QR code** affiché dans PowerShell

3. **L'app se lance automatiquement** ! 🎉

---

## 📂 STRUCTURE

```
expo-app/
├── App.tsx                  # Point d'entrée Expo
├── src/
│   ├── contexts/           # AuthContext, UserContext, TranslationContext
│   ├── navigation/         # React Navigation (Stack + Tabs)
│   ├── screens/            # Tous les écrans
│   │   ├── auth/          # Login, Signup
│   │   ├── main/          # Home, Squads, Sessions, Profile
│   │   ├── squads/        # CreateSquad, SquadDetail
│   │   ├── sessions/      # ProposeSession
│   │   └── profile/       # EditProfile
│   └── utils/             # API, Supabase client
├── app.json               # Configuration Expo
├── package.json           # Dépendances
├── babel.config.js        # Config Babel (NativeWind)
├── tailwind.config.js     # Config NativeWind
└── lancer-expo.ps1        # Script PowerShell de lancement
```

---

## 🎨 DESIGN SYSTEM

- **Palette** : Amber (#F59E0B) + Teal (#14B8A6)
- **Fond** : `#1A1816` (sombre premium)
- **Typo** : Inter (clean & moderne)
- **Animations** : React Native Reanimated
- **Icons** : Lucide React Native

---

## 🔧 COMMANDES UTILES

### Nettoyer le cache
```powershell
npx expo start --clear
```

### Lancer sur Android (émulateur)
```powershell
npx expo start --android
```

### Lancer sur iOS (Mac uniquement)
```powershell
npx expo start --ios
```

### Réinstaller les dépendances
```powershell
rm -r -Force node_modules
npm install
```

---

## 🌐 BACKEND

Cette version utilise le **même backend Supabase** que la version Figma Make :

- **URL** : `https://cwtoprbowdqcemdjrtir.supabase.co`
- **Auth** : Supabase Auth (email/password)
- **Storage** : Key-Value Store via `/supabase/functions/server/`
- **Routes** : `/make-server-e884809f/*`

---

## ✅ FONCTIONNALITÉS IMPLÉMENTÉES

### ✅ Authentification
- [x] Inscription (SignupScreen)
- [x] Connexion (LoginScreen)
- [x] Contexte Auth global
- [x] Navigation conditionnelle

### ✅ Squads
- [x] Liste des squads (SquadsScreen)
- [x] Créer une squad (CreateSquadScreen)
- [x] Détail squad (SquadDetailScreen)
- [x] Membres et invitations

### ✅ Sessions
- [x] Liste des sessions (SessionsScreen)
- [x] Proposer un créneau (ProposeSessionScreen)
- [x] RSVP (Je suis partant / Pas dispo)
- [x] Compteur de participants

### ✅ Profil
- [x] Profil utilisateur (ProfileScreen)
- [x] Édition profil (EditProfileScreen)
- [x] Score de fiabilité
- [x] Historique de présence

### ✅ Navigation
- [x] Bottom Tabs (Home, Squads, Sessions, Profile)
- [x] Stack Navigation
- [x] Deep linking
- [x] Transitions fluides

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### Erreur "Cannot find module"
```powershell
rm -r -Force node_modules
npm install
npx expo start --clear
```

### Erreur "expo-router"
✅ **CORRIGÉ** : `app.json` et `package.json` utilisent React Navigation

### QR code ne fonctionne pas
- Vérifiez que votre téléphone et PC sont sur le **même réseau WiFi**
- Essayez le mode Tunnel : `npx expo start --tunnel`

### L'app crash au démarrage
- Vérifiez que Supabase est bien configuré dans `app.json`
- Consultez les logs dans Expo Go

---

## 📖 DOCUMENTATION COMPLÈTE

- 📄 **Instructions de lancement** : [LANCER_EXPO.md](./LANCER_EXPO.md)
- 📄 **Explications des deux versions** : [/DEUX_VERSIONS_EXPLICATIONS.md](../DEUX_VERSIONS_EXPLICATIONS.md)
- 📄 **Lancement rapide** : [/LANCER_EXPO_MOBILE.txt](../LANCER_EXPO_MOBILE.txt)

---

## 🎯 PROCHAINES ÉTAPES (OPTIONNEL)

- [ ] Build APK Android (avec EAS Build)
- [ ] Build IPA iOS (avec EAS Build)
- [ ] Publier sur Expo (pour partager avec d'autres testeurs)
- [ ] Migrer vers une vraie app standalone

---

## 🆘 BESOIN D'AIDE ?

1. Consultez [LANCER_EXPO.md](./LANCER_EXPO.md)
2. Lisez [/DEUX_VERSIONS_EXPLICATIONS.md](../DEUX_VERSIONS_EXPLICATIONS.md)
3. Vérifiez que vous êtes dans le dossier `/expo-app/`

---

## ✅ RAPPEL : FIGMA MAKE EST INTACT

Cette version Expo **ne touche PAS** :
- `/src/` (version Figma Make)
- `package.json` à la racine
- `vite.config.ts`
- Aucun fichier de la version web

**Les deux versions coexistent sans problème ! 🚀**