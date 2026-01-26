# 📚 INDEX - DOCUMENTATION EXPO MOBILE

## 🎯 Vous voulez quoi faire ?

### 🚀 **Lancer l'app Expo mobile maintenant**
➡️ Ouvrez : [COMMANDES_POWERSHELL.txt](./COMMANDES_POWERSHELL.txt)  
➡️ Copiez-collez les commandes dans PowerShell

---

### 📖 **Comprendre les deux versions (Figma Make vs Expo)**
➡️ Lisez : [DEUX_VERSIONS_EXPLICATIONS.md](./DEUX_VERSIONS_EXPLICATIONS.md)

---

### 📱 **Instructions détaillées de lancement Expo**
➡️ Consultez : [expo-app/LANCER_EXPO.md](./expo-app/LANCER_EXPO.md)

---

### 🔧 **Comprendre la structure du code Expo**
➡️ Ouvrez : [expo-app/README.md](./expo-app/README.md)

---

### ⚡ **Lancement ultra-rapide (résumé visuel)**
➡️ Ouvrez : [LANCER_EXPO_MOBILE.txt](./LANCER_EXPO_MOBILE.txt)

---

## 📂 FICHIERS CRÉÉS POUR VOUS

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| [COMMANDES_POWERSHELL.txt](./COMMANDES_POWERSHELL.txt) | ✅ **Commandes à copier-coller** | ⭐ **COMMENCEZ ICI** |
| [LANCER_EXPO_MOBILE.txt](./LANCER_EXPO_MOBILE.txt) | Instructions visuelles rapides | Référence rapide |
| [DEUX_VERSIONS_EXPLICATIONS.md](./DEUX_VERSIONS_EXPLICATIONS.md) | Explications Figma Make vs Expo | Comprendre l'architecture |
| [expo-app/LANCER_EXPO.md](./expo-app/LANCER_EXPO.md) | Guide détaillé de lancement | Troubleshooting |
| [expo-app/README.md](./expo-app/README.md) | Documentation complète Expo | Référence technique |
| [expo-app/lancer-expo.ps1](./expo-app/lancer-expo.ps1) | Script PowerShell automatique | Lancement scripté |

---

## 🎯 WORKFLOW RAPIDE

### 🥇 **Première fois** (installation)

```powershell
cd expo-app
npm install
npx expo start --clear
```

### 🔄 **Les fois suivantes** (relancer)

```powershell
cd expo-app
npx expo start
```

### 🧹 **En cas de problème** (nettoyage complet)

```powershell
cd expo-app
rm -r -Force node_modules
npm install
npx expo start --clear
```

---

## ⚠️ RAPPELS IMPORTANTS

### ✅ FIGMA MAKE EST PROTÉGÉ
- La version Expo est dans `/expo-app/`
- La version Figma Make est dans `/src/`
- **Les deux sont indépendantes**
- **Aucun risque de conflit**

### ✅ MÊME BACKEND
- Les deux versions utilisent Supabase
- Même URL : `https://cwtoprbowdqcemdjrtir.supabase.co`
- Mêmes données
- Mêmes utilisateurs

### ✅ MÊME DESIGN
- Palette Amber + Teal
- Design mobile-first premium
- Guidelines.md respectées à 100%

---

## 📱 APRÈS LE LANCEMENT

Une fois Expo lancé avec succès :

1. **Sur téléphone** : Scannez le QR code avec Expo Go
2. **Dans le navigateur** : Appuyez sur `w` dans PowerShell
3. **Sur Android Emulator** : Appuyez sur `a` dans PowerShell
4. **Sur iOS Simulator** : Appuyez sur `i` dans PowerShell (Mac uniquement)

---

## 🆘 AIDE

### Expo ne démarre pas ?
➡️ Consultez [expo-app/LANCER_EXPO.md](./expo-app/LANCER_EXPO.md) section "EN CAS D'ERREUR"

### Je ne comprends pas pourquoi deux versions ?
➡️ Lisez [DEUX_VERSIONS_EXPLICATIONS.md](./DEUX_VERSIONS_EXPLICATIONS.md)

### J'ai peur de casser Figma Make
➡️ **Aucun risque** : Expo ne touche que `/expo-app/`, jamais `/src/`

---

## 🎮 PROFITEZ DE SQUAD PLANNER !

Vous avez maintenant :
- ✅ Une version web premium dans Figma Make
- ✅ Une version mobile testable avec Expo Go
- ✅ La même logique métier
- ✅ Le même backend Supabase
- ✅ Le même design premium

**Les deux versions coexistent parfaitement ! 🚀**

---

## 🚀 COMMENCEZ MAINTENANT

**Ouvrez ce fichier et copiez-collez les commandes dans PowerShell :**

➡️ [COMMANDES_POWERSHELL.txt](./COMMANDES_POWERSHELL.txt)

**C'est tout ce dont vous avez besoin ! 🎉**
