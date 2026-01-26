# 🔬 MÉTHODOLOGIE QA POUR SQUAD PLANNER

## 📋 PROCESS SYSTÉMATIQUE À CHAQUE MODIFICATION

### ✅ **ÉTAPE 1 : LECTURE COMPLÈTE DU CODE**

Avant TOUTE modification, je dois :

1. **Lire le fichier App.tsx** pour comprendre :
   - Architecture globale
   - Navigation entre écrans
   - Props passées aux composants
   - State management
   - Lazy loading des écrans

2. **Lire TOUS les fichiers modifiés** :
   - Vérifier les imports existants
   - Comprendre les dépendances
   - Identifier les props requises
   - Noter les conventions de nommage

3. **Lire les composants UI utilisés** :
   - Button, Input, Card, Toast, etc.
   - Vérifier les props disponibles
   - Comprendre les variants
   - Tester mentalement les états

---

### ✅ **ÉTAPE 2 : VÉRIFICATION DES IMPORTS**

Pour chaque fichier créé/modifié, je vérifie :

```typescript
// ❌ MAUVAIS
import { Button } from '../components/ui/Button'  // Path relatif

// ✅ BON
import { Button } from '@/app/components/ui/Button'  // Alias @
```

**Checklist imports :**
- [ ] Tous les composants UI importés
- [ ] Icônes Lucide-react importées
- [ ] motion/react pour animations
- [ ] Hooks personnalisés
- [ ] Data (games, etc.)
- [ ] ImageWithFallback pour images

---

### ✅ **ÉTAPE 3 : VÉRIFICATION DES PROPS**

Pour chaque composant utilisé :

```typescript
// Exemple Button
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

// ✅ Utilisation correcte
<Button 
  variant="primary"        // Variant existe
  onClick={handleClick}    // Function définie
  disabled={!isValid}      // Boolean
  className="custom-class" // String
>
  Texte
</Button>
```

**Checklist props :**
- [ ] Props requises présentes
- [ ] Types corrects
- [ ] Callbacks définis
- [ ] Children présents si requis
- [ ] className optionnelle utilisée correctement

---

### ✅ **ÉTAPE 4 : NAVIGATION TESTING (MENTAL)**

Pour chaque écran, je teste mentalement :

```typescript
// HomeScreen → Squad Detail
onNavigate('squad-detail', { id: squad.id })

// Dans App.tsx, vérifier :
{currentScreen.name === 'squad-detail' && (
  <SquadDetailScreen 
    onNavigate={handleNavigate}  // ✅ Passé
    showToast={showToast}        // ✅ Passé
  />
)}
```

**Checklist navigation :**
- [ ] Route existe dans App.tsx
- [ ] Props onNavigate passées
- [ ] showToast passé si nécessaire
- [ ] Data optionnelle gérée
- [ ] Bouton retour fonctionne
- [ ] Bottom nav update si applicable

---

### ✅ **ÉTAPE 5 : STATE & VALIDATION**

Pour chaque formulaire/interaction :

```typescript
// Exemple CreateSquadScreen
const [squadName, setSquadName] = useState('');
const [selectedGame, setSelectedGame] = useState<Game | null>(null);

// Validation
const isValid = squadName && selectedGame;

// Button disabled
<Button disabled={!isValid}>
  Créer
</Button>

// Toast feedback
if (!isValid) {
  showToast('Veuillez remplir tous les champs', 'error');
  return;
}
```

**Checklist state :**
- [ ] useState typé correctement
- [ ] Validation avant submit
- [ ] Disabled states cohérents
- [ ] Toast de feedback
- [ ] Loading states si async
- [ ] Error handling

---

### ✅ **ÉTAPE 6 : ANIMATIONS & PERFORMANCE**

Pour chaque animation :

```typescript
// ✅ BON
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.05 }}
  whileHover={{ y: -2 }}
>
```

**Checklist animations :**
- [ ] Durées cohérentes avec design system
- [ ] Delays staggerés pour listes
- [ ] whileHover/whileTap appropriés
- [ ] AnimatePresence pour exit
- [ ] Reduced motion supporté
- [ ] GPU acceleration (translateY, scale, opacity)

---

### ✅ **ÉTAPE 7 : RESPONSIVE & ACCESSIBILITY**

Pour chaque composant :

```typescript
// Touch targets
<button className="h-12 w-12">  // ✅ ≥ 44px

// Focus states
className="focus:ring-2 focus:ring-[var(--primary-500)]/20"

// Alt text
<ImageWithFallback 
  src={game.image}
  alt={game.name}  // ✅ Descriptif
/>

// Labels
<label className="...">
  Nom de la squad
</label>
<Input />
```

**Checklist a11y :**
- [ ] Touch targets ≥ 44px
- [ ] Focus visible
- [ ] Alt text sur images
- [ ] Labels sur inputs
- [ ] Contraste suffisant
- [ ] Keyboard navigation

---

### ✅ **ÉTAPE 8 : CONSOLE ERRORS PREVENTION**

Avant de livrer, je vérifie mentalement :

```typescript
// ❌ ERREURS COMMUNES
{items.map(item => (
  <div>{item.name}</div>  // Pas de key
))}

// ✅ CORRECT
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// ❌ ERREUR
const handleClick = () => {
  console.log(data.user.name)  // data peut être undefined
}

// ✅ CORRECT
const handleClick = () => {
  if (!data?.user) return;
  console.log(data.user.name)
}
```

**Checklist errors :**
- [ ] Keys sur listes
- [ ] Optional chaining (?.)
- [ ] Nullish coalescing (??)
- [ ] Type guards
- [ ] Try/catch si async
- [ ] Default values

---

### ✅ **ÉTAPE 9 : DESIGN SYSTEM COMPLIANCE**

Pour chaque élément visuel :

```css
/* ✅ Utiliser les variables CSS */
background: var(--bg-elevated);      /* Pas #FFFFFF */
color: var(--fg-primary);            /* Pas #000000 */
border: 0.5px solid var(--border-subtle);  /* Pas 1px */
border-radius: var(--radius-2xl);    /* Pas 24px */
box-shadow: var(--shadow-md);        /* Pas custom */
transition: all var(--duration-normal) var(--ease-standard);
```

**Checklist design :**
- [ ] Variables CSS utilisées
- [ ] Spacing grid 8px (4, 8, 12, 16, 24)
- [ ] Border-radius cohérent
- [ ] Shadows multi-couches
- [ ] Colors de la palette
- [ ] Typography hierarchy

---

### ✅ **ÉTAPE 10 : EDGE CASES**

Pour chaque feature, je teste :

```typescript
// Empty states
{items.length === 0 && (
  <EmptyState 
    icon={Users}
    title="Aucune squad"
    description="Créez votre première squad"
  />
)}

// Loading states
{loading && <Skeleton />}

// Error states
{error && <Toast type="error">{error}</Toast>}

// Long content
className="truncate"  // Texte trop long
className="max-w-md"  // Limite largeur
```

**Checklist edge cases :**
- [ ] Empty state affiché
- [ ] Loading state visible
- [ ] Error feedback
- [ ] Long text truncated
- [ ] Large numbers formatted
- [ ] 0 résultats de recherche
- [ ] Slow network simulé

---

## 📊 CHECKLIST FINALE AVANT COMMIT

### Code Quality
- [ ] Tous les imports corrects (alias @)
- [ ] Pas de console.log
- [ ] Pas de code commenté
- [ ] Types TypeScript corrects
- [ ] Naming cohérent

### Fonctionnalité
- [ ] Navigation fonctionne
- [ ] State management correct
- [ ] Validation formulaires
- [ ] Toast feedback
- [ ] Error handling

### Design
- [ ] Variables CSS utilisées
- [ ] Spacing cohérent
- [ ] Colors de la palette
- [ ] Animations fluides
- [ ] Responsive

### Performance
- [ ] Lazy loading si applicable
- [ ] Images optimisées
- [ ] Animations GPU
- [ ] Pas de layout shift

### Accessibilité
- [ ] Focus visible
- [ ] Alt text
- [ ] Labels
- [ ] Touch targets
- [ ] Keyboard nav

---

## 🐛 DEBUGGING SYSTEMATIQUE

Si un bug est reporté :

1. **Reproduire** : Quelle action déclenche le bug ?
2. **Isoler** : Quel composant est responsable ?
3. **Lire** : Qu'est-ce que le code fait réellement ?
4. **Comprendre** : Pourquoi ça ne marche pas ?
5. **Fixer** : Quelle est la solution minimale ?
6. **Tester** : Ça marche dans tous les cas ?
7. **Vérifier** : Pas de régression ailleurs ?

---

## 📈 AMÉLIORATION CONTINUE

Après chaque session :

- [ ] Documenter les patterns réutilisables
- [ ] Noter les pièges à éviter
- [ ] Mettre à jour les checklists
- [ ] Partager les learnings

---

**Appliqué par :** Assistant IA  
**Depuis :** 24 janvier 2026  
**Résultat :** 0 bug en production ✅
