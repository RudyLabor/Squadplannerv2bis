# 🔧 TROUBLESHOOTING WINDOWS / POWERSHELL

## ❓ Problèmes courants et solutions

---

## ❌ ERREUR : "expo-router plugin not found"

### Symptôme
```
Failed to resolve plugin for module "expo-router"
```

### ✅ Solution
**Déjà corrigé !** Les fichiers `app.json` et `package.json` ont été mis à jour.

Si l'erreur persiste :
```powershell
rm -r -Force node_modules
npm install
npx expo start --clear
```

---

## ❌ ERREUR : "Cannot find module"

### Symptôme
```
Error: Cannot find module '@babel/core'
```

### ✅ Solution
```powershell
cd expo-app
rm -r -Force node_modules
npm install
npx expo start --clear
```

---

## ❌ ERREUR : PowerShell bloque l'exécution de scripts

### Symptôme
```
.\lancer-expo.ps1 : Impossible d'exécuter ce script
```

### ✅ Solution 1 : Autoriser temporairement
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\lancer-expo.ps1
```

### ✅ Solution 2 : Utiliser les commandes manuelles
```powershell
npm install
npx expo start
```

---

## ❌ ERREUR : "Port already in use"

### Symptôme
```
Error: Port 8081 is already in use
```

### ✅ Solution
```powershell
npx expo start --port 8082
```

---

## ❌ ERREUR : QR code ne s'affiche pas

### Symptôme
Le terminal démarre mais aucun QR code n'apparaît.

### ✅ Solution 1 : Mode tunnel
```powershell
npx expo start --tunnel
```

### ✅ Solution 2 : Vérifier le réseau
- Assurez-vous que votre PC et téléphone sont sur le **même WiFi**
- Désactivez temporairement le pare-feu Windows

---

## ❌ ERREUR : "npm not found"

### Symptôme
```
npm : Le terme 'npm' n'est pas reconnu
```

### ✅ Solution
Vous devez installer Node.js :
1. Téléchargez : https://nodejs.org/
2. Installez la version LTS (recommandée)
3. Redémarrez PowerShell
4. Vérifiez : `node --version`

---

## ❌ ERREUR : L'app crash sur Expo Go

### Symptôme
L'app se ferme immédiatement après le scan du QR code.

### ✅ Solution 1 : Vérifier les logs
Dans Expo Go, secouez le téléphone → "Show DevTools" → Consultez les erreurs.

### ✅ Solution 2 : Nettoyer le cache
```powershell
npx expo start --clear
```

### ✅ Solution 3 : Vérifier Supabase
Assurez-vous que l'URL Supabase dans `app.json` est correcte :
```json
"EXPO_PUBLIC_SUPABASE_URL": "https://cwtoprbowdqcemdjrtir.supabase.co"
```

---

## ❌ ERREUR : Installation lente ou bloquée

### Symptôme
`npm install` prend plus de 10 minutes ou se bloque.

### ✅ Solution 1 : Changer de registre npm
```powershell
npm config set registry https://registry.npmjs.org/
npm install
```

### ✅ Solution 2 : Utiliser pnpm (plus rapide)
```powershell
npm install -g pnpm
pnpm install
npx expo start
```

---

## ❌ ERREUR : "EACCES" ou "Permission denied"

### Symptôme
```
Error: EACCES: permission denied
```

### ✅ Solution
Exécutez PowerShell en tant qu'**Administrateur** :
1. Faites un clic droit sur PowerShell
2. "Exécuter en tant qu'administrateur"
3. `cd` vers le dossier expo-app
4. Relancez les commandes

---

## ❌ ERREUR : Expo Go ne trouve pas l'app

### Symptôme
Après le scan du QR code, Expo Go affiche "Impossible de se connecter".

### ✅ Solution 1 : Même réseau WiFi
- PC et téléphone doivent être sur le **même réseau WiFi**
- Pas de VPN actif

### ✅ Solution 2 : Mode tunnel
```powershell
npx expo start --tunnel
```

⚠️ Le mode tunnel est plus lent mais fonctionne même avec des réseaux différents.

---

## ❌ ERREUR : "Invalid character in header"

### Symptôme
```
SyntaxError: Invalid or unexpected token
```

### ✅ Solution
Fichier corrompu ou encodage incorrect :
```powershell
rm -r -Force node_modules
rm package-lock.json
npm install
npx expo start --clear
```

---

## ❌ ERREUR : L'écran reste blanc dans Expo Go

### Symptôme
L'app se lance mais reste sur un écran blanc.

### ✅ Solution 1 : Vérifier App.tsx
Assurez-vous que `/expo-app/App.tsx` existe et contient le code React Navigation.

### ✅ Solution 2 : Vérifier les imports
Ouvrez les DevTools dans Expo Go (secouer le téléphone) et consultez les erreurs.

### ✅ Solution 3 : Relancer avec cache vidé
```powershell
npx expo start --clear
```

---

## ❌ ERREUR : "Module not found: @react-navigation"

### Symptôme
```
Error: Module not found: Can't resolve '@react-navigation/native'
```

### ✅ Solution
```powershell
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npx expo start --clear
```

---

## ❌ ERREUR : "Supabase is not defined"

### Symptôme
```
ReferenceError: supabase is not defined
```

### ✅ Solution
Vérifiez que `app.json` contient bien :
```json
"extra": {
  "EXPO_PUBLIC_SUPABASE_URL": "https://cwtoprbowdqcemdjrtir.supabase.co",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY": "votre_clé_ici"
}
```

Puis relancez :
```powershell
npx expo start --clear
```

---

## ❌ ERREUR : "Cannot access 'Constants' before initialization"

### Symptôme
```
ReferenceError: Cannot access 'Constants' before initialization
```

### ✅ Solution
Installez `expo-constants` :
```powershell
npx expo install expo-constants
npx expo start --clear
```

---

## 🧹 SOLUTION ULTIME : RÉINITIALISATION COMPLÈTE

Si **rien ne fonctionne**, réinitialisez tout :

```powershell
# Aller dans le dossier expo-app
cd expo-app

# Supprimer tout
rm -r -Force node_modules
rm package-lock.json

# Réinstaller
npm install

# Relancer avec cache vidé
npx expo start --clear
```

---

## 🆘 TOUJOURS DES PROBLÈMES ?

### Vérifiez votre environnement
```powershell
node --version   # Doit être >= 18
npm --version    # Doit être >= 9
npx expo --version   # Doit être >= 52
```

### Mettez à jour Expo CLI
```powershell
npm install -g expo-cli
```

### Consultez les logs détaillés
```powershell
npx expo start --verbose
```

---

## ✅ CHECKLIST DE VÉRIFICATION

Avant de demander de l'aide, vérifiez :

- [ ] Vous êtes dans le dossier `expo-app/` : `cd expo-app`
- [ ] Node.js est installé : `node --version`
- [ ] Les dépendances sont installées : `ls node_modules`
- [ ] Le fichier `app.json` existe et est valide
- [ ] Le fichier `package.json` contient `"main": "node_modules/expo/AppEntry.js"`
- [ ] PC et téléphone sont sur le même WiFi
- [ ] Expo Go est installé sur le téléphone
- [ ] Le cache a été vidé : `npx expo start --clear`

---

## 📚 RESSOURCES UTILES

- **Documentation Expo** : https://docs.expo.dev/
- **Expo Go sur Google Play** : https://play.google.com/store/apps/details?id=host.exp.exponent
- **Expo Go sur App Store** : https://apps.apple.com/app/expo-go/id982107779
- **Forum Expo** : https://forums.expo.dev/

---

## 🎯 COMMANDES DE SECOURS

### Réinstallation rapide
```powershell
cd expo-app && rm -r -Force node_modules && npm install && npx expo start --clear
```

### Lancement en mode tunnel (réseau différent)
```powershell
npx expo start --tunnel --clear
```

### Lancement sur un autre port
```powershell
npx expo start --port 8082 --clear
```

---

**Si vous avez suivi toutes ces étapes et que ça ne fonctionne toujours pas, copiez-collez le message d'erreur complet pour obtenir de l'aide ciblée ! 🆘**
