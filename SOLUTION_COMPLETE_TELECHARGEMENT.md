# 🎯 SOLUTION COMPLÈTE : Comment télécharger Squad Planner correctement

## ⚠️ VOTRE SITUATION ACTUELLE

Sur votre PC Windows (`C:\Users\Rudyl\Documents\squadplanner\`), vous avez :
- ✅ contexts/
- ✅ navigation/
- ✅ screens/
- ✅ utils/
- ❌ **MANQUE** : 8 fichiers de configuration à la racine

---

## 📥 MÉTHODE 1 : Télécharger depuis Figma Make (RECOMMANDÉ)

### Étape 1 : Dans Figma Make

1. **Cliquez sur le panneau de fichiers** (à gauche)
2. **Trouvez le dossier `expo-app`**
3. **Clic droit sur `expo-app`**
4. **"Download" ou "Export as ZIP"**

### Étape 2 : Sur votre PC

1. **Ouvrez le fichier `.zip` téléchargé**
2. **Extrayez TOUT le contenu** dans un nouveau dossier (ex: `squad-planner-complet`)
3. **Supprimez votre dossier `squadplanner` actuel** (il est incomplet)
4. **Renommez `squad-planner-complet` en `squadplanner`**

### Étape 3 : Vérification

```powershell
cd C:\Users\Rudyl\Documents\squadplanner
dir
```

**Vous devez voir :**
```
- package.json          ✅
- app.json             ✅
- App.tsx              ✅
- babel.config.js      ✅
- tailwind.config.js   ✅
- tsconfig.json        ✅
- src/                 ✅
  ├── contexts/
  ├── navigation/
  ├── screens/
  └── utils/
```

### Étape 4 : Installation

```powershell
npm install
npx expo start
```

---

## 📋 MÉTHODE 2 : Copie manuelle fichier par fichier

**SI la Méthode 1 ne fonctionne pas**, vous devez créer 8 fichiers manuellement :

### 1. `package.json`

**Dans PowerShell :**
```powershell
cd C:\Users\Rudyl\Documents\squadplanner
notepad package.json
```

**Copiez-collez ce contenu :**

```json
{
  "name": "squad-planner-expo",
  "version": "1.0.0",
  "main": "expo-router",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/stack": "^7.0.0",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0",
    "@supabase/supabase-js": "^2.91.1",
    "nativewind": "^4.0.0",
    "react-native-svg": "15.8.0",
    "expo-linear-gradient": "~14.0.0",
    "expo-blur": "~14.0.0",
    "expo-haptics": "~14.0.0",
    "expo-constants": "~17.0.0",
    "date-fns": "^3.6.0",
    "lucide-react-native": "^0.460.0",
    "@react-native-async-storage/async-storage": "^2.1.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "tailwindcss": "^3.4.0"
  },
  "private": true
}
```

**Sauvegardez et fermez.**

---

### 2. `app.json`

```powershell
notepad app.json
```

**Copiez-collez :**

```json
{
  "expo": {
    "name": "Squad Planner",
    "slug": "squad-planner",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#F5F3F0"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.squadplanner.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#F5F3F0"
      },
      "package": "com.squadplanner.app"
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "squadplanner",
    "extra": {
      "eas": {
        "projectId": "squad-planner-expo"
      },
      "EXPO_PUBLIC_SUPABASE_URL": "https://cwtoprbowdqcemdjrtir.supabase.co",
      "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQyNjMsImV4cCI6MjA4NDc5MDI2M30.FUpLncLIZc7l4hukBu5oOzj0tHl2IiwIIJ2Ghml8-6k"
    }
  }
}
```

**Sauvegardez.**

---

### 3. `App.tsx`

```powershell
notepad App.tsx
```

**Copiez-collez :**

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';
import { TranslationProvider } from './src/contexts/TranslationContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TranslationProvider>
          <AuthProvider>
            <UserProvider>
              <NavigationContainer>
                <StatusBar style="dark" backgroundColor="#F5F3F0" />
                <RootNavigator />
              </NavigationContainer>
            </UserProvider>
          </AuthProvider>
        </TranslationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

**Sauvegardez.**

---

### 4. `babel.config.js`

```powershell
notepad babel.config.js
```

**Copiez-collez :**

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
```

**Sauvegardez.**

---

### 5. `tailwind.config.js`

```powershell
notepad tailwind.config.js
```

**Copiez-collez :**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        secondary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          700: '#047857',
        },
        warning: {
          50: '#FFF7ED',
          500: '#F97316',
          700: '#C2410C',
        },
        destructive: {
          50: '#FFF1F2',
          500: '#F43F5E',
          700: '#BE123C',
        },
        bg: {
          base: '#F5F3F0',
          elevated: '#FDFCFB',
          subtle: '#EAE7E3',
        },
        fg: {
          primary: 'rgba(28, 25, 23, 0.95)',
          secondary: 'rgba(28, 25, 23, 0.70)',
          tertiary: 'rgba(28, 25, 23, 0.50)',
        },
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
      },
    },
  },
  plugins: [],
};
```

**Sauvegardez.**

---

### 6. `tsconfig.json`

```powershell
notepad tsconfig.json
```

**Copiez-collez :**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Sauvegardez.**

---

### 7. `.gitignore`

```powershell
notepad .gitignore
```

**Copiez-collez :**

```
node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.env
.env.local
```

**Sauvegardez.**

---

### 8. Vérification finale

```powershell
dir
```

**Vous devez voir :**
- ✅ package.json
- ✅ app.json
- ✅ App.tsx
- ✅ babel.config.js
- ✅ tailwind.config.js
- ✅ tsconfig.json
- ✅ .gitignore
- ✅ src/ (avec contexts, navigation, screens, utils)

---

## 🚀 INSTALLATION ET LANCEMENT

```powershell
# Installer les dépendances
npm install

# Démarrer Expo
npx expo start
```

---

## 📱 UTILISATION

1. **Installez Expo Go** sur votre téléphone (Android ou iOS)
2. **Scannez le QR code** affiché dans le terminal
3. **L'app se lance automatiquement** sur votre téléphone

---

## ❓ PROBLÈMES POSSIBLES

### "npm: command not found"
```powershell
# Installez Node.js depuis nodejs.org
# Puis relancez PowerShell
```

### "expo: command not found"
```powershell
# Utilisez npx au lieu d'expo directement
npx expo start
```

### Erreur "Module not found"
```powershell
# Supprimez node_modules et réinstallez
rm -r node_modules
npm install
```

---

## ✅ CHECKLIST FINALE

- [ ] Tous les fichiers sont présents (8 fichiers + src/)
- [ ] `npm install` a fonctionné sans erreur
- [ ] `npx expo start` affiche un QR code
- [ ] Expo Go est installé sur votre téléphone
- [ ] Le scan du QR code lance l'application

---

**Si tout est ✅, vous êtes prêt ! 🎮**
