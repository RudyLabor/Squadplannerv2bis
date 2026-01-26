# 📂 SQUAD PLANNER : DEUX VERSIONS EN PARALLÈLE

## 🎯 POURQUOI DEUX VERSIONS ?

Votre projet Squad Planner existe en **deux versions indépendantes** :

### 1️⃣ **VERSION FIGMA MAKE** (Production)
- 📁 **Dossier** : `/src/`
- 🌐 **Technologie** : React + Vite + Tailwind
- 🖥️ **Utilisation** : Application web dans Figma Make
- ✅ **Statut** : Version principale, déployée

### 2️⃣ **VERSION EXPO** (Test mobile local)
- 📁 **Dossier** : `/expo-app/`
- 📱 **Technologie** : React Native + Expo + NativeWind
- 🖥️ **Utilisation** : Test sur téléphone via Expo Go
- ✅ **Statut** : Version de développement mobile

---

## 🔄 ELLES SONT INDÉPENDANTES

```
squadplanner/
│
├── src/                          ← VERSION FIGMA MAKE (NE PAS TOUCHER)
│   ├── app/App.tsx               ← Point d'entrée Figma Make
│   ├── app/components/
│   ├── app/screens/
│   └── styles/
│
├── expo-app/                     ← VERSION EXPO MOBILE (SÉPARÉE)
│   ├── App.tsx                   ← Point d'entrée Expo
│   ├── src/contexts/
│   ├── src/navigation/
│   ├── src/screens/
│   ├── package.json              ← Dépendances Expo
│   ├── app.json                  ← Config Expo
│   └── lancer-expo.ps1           ← Script de lancement PowerShell
│
├── package.json                  ← Dépendances Figma Make
├── vite.config.ts                ← Config Vite (Figma Make)
└── Guidelines.md                 ← Règles de design communes
```

---

## 🚀 COMMENT UTILISER CHAQUE VERSION ?

### ✅ VERSION FIGMA MAKE
**Ouvrir dans Figma Make** :
- Pas besoin de PowerShell
- Fonctionne directement dans le navigateur Figma Make
- Toutes vos fonctionnalités premium sont là

### ✅ VERSION EXPO
**Lancer en local avec PowerShell** :

#### Option 1 : Script automatique (RECOMMANDÉ)
```powershell
cd expo-app
.\lancer-expo.ps1
```

#### Option 2 : Commandes manuelles
```powershell
cd expo-app
npm install       # Première fois uniquement
npx expo start
```

---

## 🎨 DESIGN SYSTEM COMMUN

Les deux versions utilisent **les mêmes Guidelines.md** :
- ✅ Palette Amber + Teal
- ✅ Design mobile-first premium
- ✅ Même logique UX (RSVP, Squads, Sessions)
- ✅ Même backend Supabase

**MAIS** :
- Version Figma Make = **Tailwind CSS v4**
- Version Expo = **NativeWind (Tailwind pour React Native)**

---

## 🔧 MODIFICATIONS

### Si vous modifiez le design dans Figma Make
✅ Les changements sont **automatiquement sauvegardés** dans `/src/`
❌ La version Expo n'est **PAS affectée**

### Si vous modifiez le code Expo
✅ Les changements sont dans `/expo-app/`
❌ Figma Make n'est **PAS affecté**

---

## ⚠️ RÈGLES IMPORTANTES

1. **NE JAMAIS SUPPRIMER** `/src/` (version Figma Make)
2. **NE JAMAIS MÉLANGER** les fichiers des deux versions
3. Les **deux versions peuvent coexister** sans problème
4. Vous pouvez **lancer Expo sans affecter Figma Make**

---

## 📱 WORKFLOW RECOMMANDÉ

### Pour développer dans Figma Make
1. Ouvrir Figma Make normalement
2. Modifier les fichiers dans `/src/`
3. Tester dans le navigateur Figma Make

### Pour tester sur mobile
1. Ouvrir PowerShell
2. `cd expo-app`
3. `.\lancer-expo.ps1`
4. Scanner le QR code avec Expo Go
5. Tester sur votre téléphone réel

---

## 🎯 RÉSUMÉ

| Aspect | Figma Make | Expo Mobile |
|--------|------------|-------------|
| **Dossier** | `/src/` | `/expo-app/` |
| **Technologie** | React + Vite | React Native + Expo |
| **Lancement** | Figma Make | PowerShell |
| **Test** | Navigateur web | Téléphone réel |
| **Production** | ✅ Version principale | ⚙️ Version dev |
| **Backend** | ✅ Supabase | ✅ Supabase |

---

## ✅ AVANTAGES DE CETTE ARCHITECTURE

1. **Séparation claire** : Pas de conflit entre les deux versions
2. **Figma Make protégé** : Vous ne risquez pas de casser la version web
3. **Test mobile facile** : Expo Go permet de tester sur téléphone réel
4. **Même logique métier** : Les deux versions partagent la même API Supabase
5. **Flexibilité** : Vous pouvez développer sur les deux versions indépendamment

---

## 🆘 EN CAS DE PROBLÈME

### "Je ne vois plus mon app dans Figma Make !"
➡️ **Aucun problème** : Expo ne touche pas `/src/`, votre app Figma Make est intacte.

### "Expo ne lance pas !"
➡️ Vérifiez que vous êtes dans `/expo-app/` avec `cd expo-app`

### "Les deux versions ont des styles différents !"
➡️ **Normal** : Tailwind CSS (web) ≠ NativeWind (mobile), mais le design global est le même.

---

## 🎮 PROFITEZ DES DEUX VERSIONS !

Vous avez maintenant :
- ✅ Une version web premium dans Figma Make
- ✅ Une version mobile testable avec Expo Go
- ✅ Les deux partagent le même backend Supabase
- ✅ Aucun risque de conflit

**C'est le meilleur des deux mondes ! 🚀**
