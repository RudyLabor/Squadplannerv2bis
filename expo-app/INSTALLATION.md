# 🚀 Guide d'installation Squad Planner Expo

## Étape 1 : Prérequis

Assurez-vous d'avoir installé :
- ✅ **Node.js** (version 18 ou supérieure) - https://nodejs.org
- ✅ **PowerShell** (inclus avec Windows)
- ✅ **Expo Go** app sur votre smartphone :
  - iOS : https://apps.apple.com/app/expo-go/id982107779
  - Android : https://play.google.com/store/apps/details?id=host.exp.exponent

## Étape 2 : Copier le projet

1. Copiez **tout le dossier `/expo-app/`** depuis Figma Make vers votre machine Windows
2. Placez-le où vous voulez (par exemple : `C:\Users\VotreNom\Documents\squad-planner-expo\`)

## Étape 3 : Ouvrir PowerShell

1. **Ouvrez l'Explorateur de fichiers** Windows
2. **Naviguez** jusqu'au dossier `expo-app` que vous venez de copier
3. Dans la barre d'adresse, tapez `powershell` et appuyez sur **Entrée**
4. PowerShell s'ouvre directement dans ce dossier

## Étape 4 : Installer les dépendances

Dans PowerShell, exécutez :

```powershell
npm install
```

⏱️ Cela prendra quelques minutes (téléchargement de ~500 MB de dépendances).

**Si vous voyez des warnings**, ce n'est pas grave, tant qu'il n'y a pas d'erreurs rouges.

## Étape 5 : Lancer l'application

Dans PowerShell, exécutez :

```powershell
npx expo start
```

Vous verrez quelque chose comme :

```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
```

## Étape 6 : Tester sur votre téléphone

### Sur Android :
1. Ouvrez **Expo Go** sur votre téléphone
2. Appuyez sur **"Scan QR Code"**
3. Scannez le QR code affiché dans PowerShell
4. L'app se charge automatiquement ! ✨

### Sur iPhone :
1. Ouvrez l'app **Appareil photo** (Camera)
2. Scannez le QR code affiché dans PowerShell
3. Une notification apparaît, appuyez dessus
4. L'app s'ouvre dans Expo Go ! ✨

## Étape 7 : Se connecter

### Option 1 : Créer un nouveau compte
- Appuyez sur **"Créer un compte"**
- Remplissez le formulaire
- Vous êtes connecté ! 🎉

### Option 2 : Utiliser un compte de démo
Les données de démo sont générées automatiquement par le serveur au premier lancement.

## ⚙️ Commandes utiles

### Relancer l'app
Dans PowerShell où Expo tourne, appuyez sur **`r`** pour recharger

### Effacer le cache
Si quelque chose ne fonctionne pas :
```powershell
npx expo start --clear
```

### Arrêter Expo
Dans PowerShell, appuyez sur **`Ctrl + C`**

## 🐛 Résolution de problèmes courants

### ❌ "npm n'est pas reconnu"
➡️ Node.js n'est pas installé ou pas dans le PATH
- Réinstallez Node.js : https://nodejs.org
- Redémarrez PowerShell

### ❌ "Expo Go ne se connecte pas"
➡️ Vérifiez que :
- Votre PC et votre téléphone sont sur le **même réseau Wi-Fi**
- Pas de VPN actif
- Pare-feu Windows autorise Node.js

**Solution** : Utilisez le mode tunnel :
```powershell
npx expo start --tunnel
```

### ❌ "Module not found"
➡️ Réinstallez les dépendances :
```powershell
rmdir node_modules -Recurse -Force
npm install
```

### ❌ "Port already in use"
➡️ Un autre process utilise le port :
```powershell
npx expo start --port 8082
```

### ❌ Écran blanc / App crash
➡️ Effacez le cache :
```powershell
npx expo start --clear
```

## 📱 Tester sur un émulateur (optionnel)

### Android Emulator
1. Installez **Android Studio**
2. Configurez un émulateur Android
3. Dans PowerShell avec Expo qui tourne, appuyez sur **`a`**

### iOS Simulator (Mac uniquement)
1. Installez **Xcode**
2. Dans le terminal avec Expo qui tourne, appuyez sur **`i`**

## 🌐 Tester sur le Web

Dans PowerShell avec Expo qui tourne, appuyez sur **`w`**

L'app s'ouvre dans votre navigateur ! (http://localhost:8081)

## 🎯 Prochaines étapes

Une fois l'app lancée :
1. ✅ Créez votre compte
2. ✅ Créez votre première squad
3. ✅ Proposez une session
4. ✅ Explorez toutes les fonctionnalités !

## 💡 Astuces

### Rechargement automatique
Toute modification du code recharge automatiquement l'app sur votre téléphone.

### Logs de débogage
Les logs s'affichent dans PowerShell et dans l'app Expo Go (secouez votre téléphone).

### Mode développement
Secouez votre téléphone pour ouvrir le menu développeur :
- Reload
- Debug Remote JS
- Show Performance Monitor

## 📞 Besoin d'aide ?

Si vous rencontrez un problème :
1. Vérifiez cette documentation
2. Consultez la documentation Expo : https://docs.expo.dev
3. Vérifiez les logs dans PowerShell

## ✅ Checklist finale

Avant de commencer :
- [ ] Node.js installé
- [ ] Dossier expo-app copié
- [ ] PowerShell ouvert dans le bon dossier
- [ ] `npm install` exécuté sans erreur
- [ ] Expo Go installé sur le téléphone
- [ ] PC et téléphone sur le même Wi-Fi
- [ ] `npx expo start` lancé
- [ ] QR code scanné
- [ ] App chargée sur le téléphone !

---

**C'est tout !** Vous avez maintenant Squad Planner qui tourne sur votre téléphone ! 🎮🚀

Bon jeu ! 🎉
