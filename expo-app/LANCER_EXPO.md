# 🚀 LANCER SQUAD PLANNER EN LOCAL (VERSION EXPO)

## ⚠️ IMPORTANT : Figma Make n'est PAS affecté

Cette version Expo est **séparée** de votre application Figma Make.
- ✅ **Figma Make** : Fonctionne normalement dans `/src/app/App.tsx`
- ✅ **Version Expo mobile** : Se trouve dans `/expo-app/`

---

## 📋 ÉTAPE 1 : Ouvrir PowerShell dans le bon dossier

```powershell
# Naviguer dans le dossier expo-app
cd expo-app
```

---

## 📦 ÉTAPE 2 : Installer les dépendances (PREMIÈRE FOIS UNIQUEMENT)

```powershell
npm install
```

⏱️ Cela prend ~1-2 minutes.

---

## 🚀 ÉTAPE 3 : Lancer Expo

```powershell
npx expo start
```

**OU avec nettoyage du cache :**

```powershell
npx expo start --clear
```

---

## 📱 ÉTAPE 4 : Tester sur votre téléphone

1. **Installez "Expo Go"** sur votre smartphone :
   - 🤖 **Android** : https://play.google.com/store/apps/details?id=host.exp.exponent
   - 🍎 **iOS** : https://apps.apple.com/app/expo-go/id982107779

2. **Scannez le QR code** qui apparaît dans PowerShell :
   - Sur Android : Ouvrez Expo Go → "Scan QR Code"
   - Sur iOS : Ouvrez l'appareil photo natif → Scannez le QR code

3. **L'app se lance automatiquement** sur votre téléphone ! 🎮

---

## 🌐 ÉTAPE 5 : Tester dans le navigateur (optionnel)

Dans le terminal Expo, appuyez sur :
```
w
```

Cela ouvre l'app dans votre navigateur web.

---

## 🛑 ARRÊTER EXPO

Dans PowerShell, appuyez sur :
```
Ctrl + C
```

---

## 🔧 COMMANDES UTILES

### Relancer avec cache vidé
```powershell
npx expo start --clear
```

### Lancer directement sur Android (si émulateur installé)
```powershell
npx expo start --android
```

### Lancer directement sur iOS (Mac uniquement)
```powershell
npx expo start --ios
```

---

## ❌ EN CAS D'ERREUR

### Erreur "Cannot find module"
```powershell
rm -r -Force node_modules
npm install
npx expo start --clear
```

### Erreur "expo-router"
✅ **DÉJÀ CORRIGÉ** dans `app.json` et `package.json`

### Erreur de port (port déjà utilisé)
```powershell
npx expo start --port 8082
```

---

## ✅ VÉRIFICATION QUE TOUT FONCTIONNE

Quand Expo démarre avec succès, vous devez voir :
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

---

## 📂 STRUCTURE DU PROJET EXPO

```
expo-app/
├── App.tsx                    # Point d'entrée principal
├── src/
│   ├── contexts/             # AuthContext, UserContext
│   ├── navigation/           # Navigation React Navigation
│   ├── screens/              # Tous les écrans
│   └── utils/                # API, Supabase client
├── app.json                  # Configuration Expo
├── package.json              # Dépendances
└── babel.config.js           # Config Babel pour NativeWind
```

---

## 🎮 PROFITEZ DE SQUAD PLANNER !

Une fois lancé, vous pouvez :
- ✅ Créer un compte
- ✅ Créer une squad
- ✅ Proposer des sessions
- ✅ Voter avec RSVP
- ✅ Voir votre profil de fiabilité

---

## 🆘 BESOIN D'AIDE ?

Si vous rencontrez des erreurs, copiez-collez le message d'erreur complet pour obtenir de l'aide.
