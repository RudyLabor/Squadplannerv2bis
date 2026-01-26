# 🤝 Guide de contribution - Squad Planner

Merci de votre intérêt pour contribuer à Squad Planner ! Ce guide vous aidera à bien démarrer.

---

## 📋 Table des matières

1. [Code de conduite](#code-de-conduite)
2. [Comment contribuer](#comment-contribuer)
3. [Standards de code](#standards-de-code)
4. [Process de développement](#process-de-développement)
5. [Commit et PR](#commit-et-pr)
6. [Tests](#tests)

---

## 📜 Code de conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite :

- ✅ Être respectueux envers tous les contributeurs
- ✅ Accepter les critiques constructives
- ✅ Se concentrer sur ce qui est meilleur pour la communauté
- ❌ Harcèlement ou comportement inapproprié

---

## 🚀 Comment contribuer

### Types de contributions acceptées

- 🐛 **Bug fixes** : Corrections de bugs
- ✨ **Features** : Nouvelles fonctionnalités
- 📝 **Documentation** : Améliorations de la doc
- 🎨 **UI/UX** : Améliorations visuelles
- ⚡ **Performance** : Optimisations
- ♿ **Accessibilité** : Améliorations a11y

### Processus

1. **Fork** le repository
2. **Clone** votre fork localement
3. **Créer une branche** pour votre contribution
4. **Développer** votre feature/fix
5. **Tester** localement
6. **Commit** avec un message clair
7. **Push** vers votre fork
8. **Ouvrir une Pull Request**

---

## 💻 Standards de code

### TypeScript

```typescript
// ✅ BON : Types explicites
interface SquadMember {
  id: string;
  name: string;
  reliabilityScore: number;
}

function addMember(member: SquadMember): void {
  // ...
}

// ❌ MAUVAIS : Types any
function addMember(member: any) {
  // ...
}
```

### React Components

```tsx
// ✅ BON : Composant fonctionnel avec types
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
}

// ❌ MAUVAIS : Props sans types
export function Button(props) {
  return <button>{props.label}</button>;
}
```

### Naming Conventions

- **Composants** : PascalCase (`SquadCard`, `SessionVote`)
- **Hooks** : camelCase avec préfixe `use` (`useSquads`, `useAuth`)
- **Utils** : camelCase (`formatDate`, `calculateScore`)
- **Constants** : UPPER_SNAKE_CASE (`MAX_SQUAD_SIZE`, `API_URL`)
- **Types/Interfaces** : PascalCase (`Squad`, `Session`, `UserProfile`)

### CSS / Tailwind

```tsx
// ✅ BON : Classes Tailwind organisées
<div className="
  flex items-center gap-4
  p-6 rounded-2xl
  bg-gradient-to-br from-amber-500/10 to-teal-500/10
  border border-white/10
  shadow-lg shadow-amber-500/20
">

// ❌ MAUVAIS : Classes désordonnées
<div className="flex gap-4 bg-gradient-to-br p-6 from-amber-500/10 items-center">
```

**Ordre recommandé** :
1. Layout (flex, grid, position)
2. Spacing (p-, m-, gap-)
3. Sizing (w-, h-, max-)
4. Typography (text-, font-)
5. Colors (bg-, text-, border-)
6. Effects (shadow-, rounded-, opacity-)

---

## 🔄 Process de développement

### Setup initial

```bash
# Fork et clone
git clone https://github.com/VOTRE-USERNAME/squad-planner.git
cd squad-planner

# Installer les dépendances
pnpm install

# Créer votre branche
git checkout -b feature/ma-super-feature
```

### Développement

```bash
# Démarrer le serveur de dev
pnpm dev

# Dans un autre terminal : Supabase local
supabase start

# Servir les edge functions
supabase functions serve
```

### Structure des branches

- `main` : Code de production stable
- `develop` : Code en développement (pre-prod)
- `feature/*` : Nouvelles fonctionnalités
- `fix/*` : Corrections de bugs
- `docs/*` : Modifications documentation
- `perf/*` : Optimisations performance

### Avant de soumettre

- ✅ Le code compile sans erreurs TypeScript
- ✅ Aucune erreur ESLint (si configuré)
- ✅ Les composants sont testés manuellement
- ✅ La documentation est mise à jour si nécessaire
- ✅ Les commits sont propres et clairs

---

## 📝 Commit et PR

### Format des commits

Utiliser **Conventional Commits** :

```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

**Types** :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Formatage, points-virgules manquants, etc.
- `refactor`: Refactoring de code
- `perf`: Amélioration de performance
- `test`: Ajout de tests
- `chore`: Maintenance, config, build

**Exemples** :

```bash
git commit -m "feat(sessions): add recurring sessions support"
git commit -m "fix(auth): resolve login redirect issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "perf(cache): implement stale-while-revalidate strategy"
```

### Pull Requests

**Titre** : Clair et descriptif
```
feat: Add Discord bot integration
fix: Resolve RSVP notification bug
docs: Improve API documentation
```

**Description** : Template à suivre

```markdown
## Description
Brève description de ce que fait cette PR.

## Type de changement
- [ ] Bug fix (non-breaking change qui corrige un problème)
- [ ] New feature (non-breaking change qui ajoute une fonctionnalité)
- [ ] Breaking change (fix ou feature qui casserait une fonctionnalité existante)
- [ ] Documentation

## Comment tester ?
1. Aller sur la page X
2. Cliquer sur Y
3. Vérifier que Z s'affiche

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai testé mes changements
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] Aucune erreur TypeScript
- [ ] Les composants sont responsive

## Screenshots (si applicable)
[Ajouter des captures d'écran]

## Notes additionnelles
Toute information supplémentaire pertinente.
```

---

## 🧪 Tests

### Tests manuels

Pour l'instant, les tests sont principalement manuels :

**Checklist de test** :
- ✅ Desktop (Chrome, Firefox, Safari)
- ✅ Mobile (iOS Safari, Android Chrome)
- ✅ Tablette
- ✅ Dark mode
- ✅ Slow network (throttling)
- ✅ Navigation clavier
- ✅ Screen readers (si changement a11y)

### Tests automatisés (À venir)

Le projet sera bientôt équipé de :
- **Unit tests** : Vitest
- **Component tests** : React Testing Library
- **E2E tests** : Playwright

---

## 🎨 Design System

### Respecter la palette

```typescript
// Utiliser les couleurs du theme
import { colors } from '@/styles/theme';

// ✅ BON
<div className="bg-primary text-primary-dark">

// ❌ MAUVAIS
<div style={{ backgroundColor: '#F59E0B' }}>
```

### Composants UI réutilisables

Toujours vérifier si un composant existe déjà dans `/src/app/components/ui/` avant d'en créer un nouveau.

**Composants disponibles** :
- Button, Badge, Card
- Input, Select, Switch
- Dialog, Sheet, Drawer
- Toast, Alert
- Avatar, Skeleton
- Et 40+ autres...

---

## 📚 Ressources

### Documentation

- [README_PREMIUM.md](./README_PREMIUM.md) - Vue d'ensemble
- [ARCHITECTURE_2026.md](./ARCHITECTURE_2026.md) - Architecture technique
- [DESIGN_SYSTEM_PREMIUM.md](./DESIGN_SYSTEM_PREMIUM.md) - Design system
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API Backend

### Technologies

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Motion (Framer Motion)](https://motion.dev/)

---

## 🆘 Besoin d'aide ?

- 📖 Consultez la [documentation complète](./INDEX_DOCUMENTATION.md)
- 💬 Ouvrez une [Discussion GitHub](https://github.com/votre-org/squad-planner/discussions)
- 🐛 Signalez un [bug](https://github.com/votre-org/squad-planner/issues)
- 💡 Proposez une [feature](https://github.com/votre-org/squad-planner/issues)

---

## 🙏 Merci !

Votre contribution, quelle qu'elle soit, est précieuse pour la communauté Squad Planner. Merci de prendre le temps d'améliorer le projet ! 🎮✨

---

**Maintenu avec ❤️ par la communauté Squad Planner**
