# 📋 GUIDE : Copier les fichiers manquants manuellement

## 🎯 OBJECTIF

Vous avez déjà dans `C:\Users\Rudyl\Documents\squadplanner\` :
- ✅ contexts/
- ✅ navigation/
- ✅ screens/
- ✅ utils/

**Il manque les 8 fichiers de configuration à la racine.**

---

## 📝 ÉTAPE PAR ÉTAPE

### 1️⃣ Créez `package.json`

**Dans PowerShell, tapez :**

```powershell
notepad package.json
```

**Puis collez ce contenu exactement :**

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

**Sauvegardez et fermez Notepad.**

---

### 2️⃣ Créez `app.json`

```powershell
notepad app.json
```

**Collez :**

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

### 3️⃣ Créez `App.tsx`

```powershell
notepad App.tsx
```

**Collez :**

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

### 4️⃣ Créez `babel.config.js`

```powershell
notepad babel.config.js
```

**Collez :**

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

### 5️⃣ Créez `tailwind.config.js`

```powershell
notepad tailwind.config.js
```

**Collez :**

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

### 6️⃣ Créez `tsconfig.json`

```powershell
notepad tsconfig.json
```

**Collez :**

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

### 7️⃣ Créez `.gitignore`

```powershell
notepad .gitignore
```

**Collez :**

```
# OSX
.DS_Store

# Xcode
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
project.xcworkspace

# Android/IntelliJ
build/
.idea
.gradle
local.properties
*.iml
*.hprof
.cxx/
*.keystore
!debug.keystore

# node.js
node_modules/
npm-debug.log
yarn-error.log

# Bundle artifact
*.jsbundle

# Ruby / CocoaPods
/ios/Pods/
/vendor/bundle/

# Temporary files created by Metro to check the health of the file watcher
.metro-health-check*

# testing
/coverage

# Expo
.expo/
dist/
web-build/

# Environment
.env
.env.local
.env.*.local
```

**Sauvegardez.**

---

### 8️⃣ Vérifiez que tout est là

```powershell
dir
```

**Vous devez voir :**
```
- package.json        ✅
- app.json           ✅
- App.tsx            ✅
- babel.config.js    ✅
- tailwind.config.js ✅
- tsconfig.json      ✅
- .gitignore         ✅
- contexts/          ✅
- navigation/        ✅
- screens/           ✅
- utils/             ✅
```

---

## 🚀 MAINTENANT : Lancez l'installation !

```powershell
npm install
```

Puis :

```powershell
npx expo start
```

---

## 🎉 C'EST PRÊT !

Scannez le QR code avec Expo Go et profitez de Squad Planner ! 🎮
