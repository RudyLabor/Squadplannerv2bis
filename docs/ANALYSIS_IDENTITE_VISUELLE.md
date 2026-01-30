# Squad Planner - Analyse Complète de l'Identité Visuelle

**Document source:** `Squad Planner - Identite Visuelle.pdf`
**Date d'analyse:** 28 janvier 2026
**Version:** V1

---

## Table des Matières

1. [Vue d'ensemble & Positionnement](#vue-densemble--positionnement)
2. [Palette de Couleurs](#palette-de-couleurs)
3. [Typographie & Hiérarchie](#typographie--hiérarchie)
4. [Animations & Micro-Interactions](#animations--micro-interactions)
5. [Iconographie](#iconographie)
6. [Brief Complet UI/UX](#brief-complet-uiux)
7. [Composants Visuels](#composants-visuels)
8. [Guidelines d'Implémentation](#guidelines-dimplémentation)

---

## Vue d'ensemble & Positionnement

### Description

Squad Planner est **l'outil de coordination des squads sérieux, premium, moderne, no bullshit**. Une identité visuelle qui se positionne entre Discord, Notion, Riot Client et Spotify Dark.

### Valeurs Clés

**Ce que Squad Planner EST:**
- Premium et moderne
- Sans artifice
- Professionnel gaming
- Sophistiqué

**Ce que Squad Planner N'EST PAS:**
- Cartoon
- E-sport flashy low-cost
- SaaS corporate
- Gaming fantasy

### Trois Piliers de l'Identité

#### 1. Positionnement
- Premium, moderne, sans artifice
- Interface qui respire le professionnalisme gaming
- Outil pensé pour les joueurs exigeants

#### 2. Ambiance
- **Dark mode par défaut**
- Atmosphère "night gaming room"
- Minimaliste et mémorable
- Immersion nocturne des sessions gaming

#### 3. Philosophie
> "Organiser une session doit être aussi simple que lancer Spotify."

- Simplicité d'utilisation
- Fluidité et style
- Pas de friction

---

## Palette de Couleurs

### Système de Couleurs Complet

La palette sophistiquée évoque la nuit, le gaming premium et la clarté d'interface. **Chaque couleur a un rôle précis** dans l'expérience utilisateur, créant une hiérarchie visuelle immédiate et intuitive.

### 1. Fondations Sombres

#### Fond Principal
```
Couleur: #0B0E14
Description: Noir bleuté très profond
Usage: Background principal de l'application
```

#### Cartes & Surfaces
```
Couleur: #141A26
Description: Bleu nuit
Usage: Cards, panneaux, surfaces élevées
```

**Concept:** Une base qui évoque l'immersion nocturne des sessions gaming.

### 2. Textes & Lisibilité

#### Texte Principal
```
Couleur: #E6EAF2
Description: Blanc froid
Usage: Titres, texte principal, contenu primaire
Contraste: Optimal pour lecture sans fatigue
```

#### Texte Secondaire
```
Couleur: #9AA3B2
Description: Gris bleuté
Usage: Sous-titres, descriptions, métadonnées
Contraste: Optimal pour hiérarchie visuelle
```

### 3. Couleurs d'Action

#### Accent Principal
```
Couleur: #6C7CFF
Description: Violet électrique
Usage: Boutons primaires, liens, éléments interactifs
Rôle: Action principale, focus utilisateur
```

#### Succès / Disponible
```
Couleur: #2EE59D
Description: Vert néon
Usage: États de succès, disponibilité confirmée, validation
Rôle: Feedback positif
```

#### Refus / Erreur
```
Couleur: #FF5C5C
Description: Rouge clair
Usage: Refus, erreurs, états négatifs
Rôle: Alerte, warning
```

#### En Attente / Warning
```
Couleur: #F5C26B
Description: Jaune ambre
Usage: États en attente, warnings informatifs
Rôle: Information contextuelle
```

### 4. Dégradés

#### Dégradé Violet → Bleu
```
De: #6C7CFF (Violet électrique)
À:  #4FACFE (Bleu clair)
Usage: Highlights, moments d'emphase, CTA premium
```

#### Dégradé Cyan → Violet
```
Usage: Highlights alternatifs, accents secondaires
Application: Subtile, pour moments d'emphase
```

### Tableau Récapitulatif des Couleurs

| Catégorie | Nom | Hex Code | Usage Principal |
|-----------|-----|----------|-----------------|
| **Fond** | Background | `#0B0E14` | Fond principal |
| **Fond** | Cards | `#141A26` | Surfaces élevées |
| **Texte** | Principal | `#E6EAF2` | Contenu primaire |
| **Texte** | Secondaire | `#9AA3B2` | Métadonnées |
| **Action** | Accent | `#6C7CFF` | CTA, focus |
| **Action** | Succès | `#2EE59D` | Validation |
| **Action** | Refus | `#FF5C5C` | Erreur |
| **Action** | Attente | `#F5C26B` | Warning |

---

## Typographie & Hiérarchie

### Système Typographique

La typographie de Squad Planner repose sur des **familles modernes et lisibles** qui garantissent une hiérarchie visuelle claire.

### Familles de Polices

#### Pour les Titres
```
Polices: Inter / Satoshi / SF Pro Display
Weights: 700–900 (Bold à Black)
Usage: Titres H1, H2, H3, headers
Caractéristique: Gros titres impactants qui captent l'attention
```

#### Pour le Texte Courant
```
Polices: Inter / SF Pro
Weights: 400–600 (Regular à SemiBold)
Usage: Paragraphes, body text, descriptions
Caractéristique: Très lisible, ne fatigue jamais l'œil
```

### Règle d'Or

> "Des gros titres impactants qui captent l'attention immédiatement, associés à un texte très lisible qui ne fatigue jamais l'œil."

### Principes Typographiques

1. **Pas de typo "gaming fantasy"**
   - Éviter les polices qui nuisent à la crédibilité
   - Maintenir le professionnalisme de l'outil

2. **Hiérarchie visuelle claire**
   - L'information importante se détache naturellement
   - Scanner l'interface en quelques secondes
   - Comprendre instantanément où porter l'attention

3. **Lisibilité optimale**
   - Contraste suffisant avec le fond sombre
   - Tailles adaptées pour mobile
   - Spacing généreux entre les lignes

### Hiérarchie Recommandée

```
H1 (Titres principaux)
- Police: Satoshi / SF Pro Display
- Weight: 900 (Black)
- Couleur: #E6EAF2

H2 (Sous-titres)
- Police: Inter / SF Pro Display
- Weight: 700 (Bold)
- Couleur: #E6EAF2

H3 (Titres de section)
- Police: Inter
- Weight: 600 (SemiBold)
- Couleur: #E6EAF2

Body Text (Texte principal)
- Police: Inter / SF Pro
- Weight: 400 (Regular)
- Couleur: #E6EAF2

Body Text Secondary (Texte secondaire)
- Police: Inter / SF Pro
- Weight: 400 (Regular)
- Couleur: #9AA3B2

Buttons / CTA
- Police: Inter
- Weight: 600 (SemiBold)
- Couleur: Variable selon état
```

---

## Animations & Micro-Interactions

### Philosophie d'Animation

Les animations de Squad Planner incarnent la **fluidité premium**. Chaque interaction donne une sensation de contrôle et de réactivité.

### Caractéristiques Générales

#### Style
- **Fluide, jamais tape-à-l'œil**
- Transitions naturelles
- Feedback immédiat

#### Paramètres Techniques
```
Transition Type: Fade + Slide vertical léger
Slide Distance: 12–16px
Durée: 180–240ms
Courbe: ease-out cubic
Résultat: Mouvement naturel et organique
```

### 5 Micro-Interactions Clés

#### 1. Sélection de Créneau
```
Animation: Pulse effect
Transformation: scale(1 → 1.05 → 1)
Durée: ~200ms
Objectif: Confirmer visuellement le choix
Sensation: Feedback tactile immédiat
```

#### 2. Vote Confirmé
```
Animation: Check icon + bounce
Type: Apparition avec rebond satisfaisant
Objectif: Récompenser l'action
Sensation: Accomplissement, gamification subtile
```

#### 3. Créneau Validé
```
Animation: Halo lumineux violet (glow effect)
Couleur: #6C7CFF avec opacity
Position: Autour de la carte
Objectif: Célébrer la validation collective
Sensation: Moment de victoire partagée
```

#### 4. CTA Principal (Boutons)
```
Interaction: Hover / Press
Animation: Légère élévation
Transform: translateY(-2px) + box-shadow
Durée: 180ms
Objectif: Sensation tactile et de profondeur
Sensation: Contrôle, réactivité
```

#### 5. Avatars Membres
```
Animation: Entrée en cascade progressive
Timing: Décalé de 80–100ms par avatar
Trigger: Quand un membre répond
Objectif: Créer un effet de vie et de dynamique de groupe
Sensation: Activité collective, engagement
```

### Principes d'Animation

1. **Jamais gratuit** - Chaque animation a un objectif UX
2. **Toujours subtil** - Ne jamais distraire de l'objectif principal
3. **Feedback immédiat** - Confirmer les actions utilisateur
4. **Performance** - Optimisé pour mobile, 60fps minimum
5. **Cohérence** - Même timing et courbes dans toute l'app

---

## Iconographie

### Style Iconographique

Les icônes de Squad Planner suivent un **style line icons épais avec des arrondis**, inspiré des bibliothèques **Lucide** et **Phosphor**.

### Spécifications Techniques

```
Type: Line icons (outline)
Épaisseur du trait: 2px
Style: Arrondis (rounded)
Taille de référence: 24x24px
Variantes: 16px, 20px, 24px, 32px
```

### Objectifs

1. **Cohérence visuelle**
   - Toutes les icônes suivent le même système
   - Reconnaissance immédiate

2. **Lisibilité optimale**
   - Sur tous les écrans
   - Même à petite taille

3. **Intégration harmonieuse**
   - S'intègre dans l'identité dark et premium
   - Jamais trop flashy ou cartoon

### Bibliothèque d'Icônes Principales

#### 1. Temps / Clock
```
Icône: Horloge (clock)
Usage: Créneaux horaires, durée de session
Style: Circle avec aiguilles arrondies
```

#### 2. Jeu / Gaming
```
Icône: Manette de jeu (gamepad)
Usage: Sélection de jeu, type de session
Style: Controller avec boutons et joysticks
```

#### 3. Squad / Team
```
Icône: Utilisateur / Groupe (user/users)
Usage: Gestion squad, liste membres
Style: Avatar simple circulaire
```

#### 4. Rappel / Notification
```
Icône: Cloche (bell)
Usage: Notifications, rappels de session
Style: Bell avec battant arrondi
```

#### 5. Calendrier
```
Icône: Calendrier (calendar)
Usage: Planification, vue calendrier
Style: Grid avec header
```

#### 6. Vocal / Voice
```
Icône: Microphone (mic)
Usage: Passage au vocal, communication
Style: Micro de podcast/streaming
```

### Autres Icônes Recommandées

- **Settings** (gear) - Paramètres
- **Share** (share-2) - Partage
- **Check** (check) - Validation
- **X / Close** (x) - Fermeture
- **Plus** (plus) - Ajout
- **Arrow** (arrow-right) - Navigation
- **Info** (info) - Information
- **Star** (star) - Favoris
- **Message** (message-circle) - Chat

### Sources Recommandées

1. **Lucide Icons** - https://lucide.dev
2. **Phosphor Icons** - https://phosphoricons.com
3. **Heroicons** (variante outline) - https://heroicons.com

---

## Brief Complet UI/UX

### Contexte

> "Tu es un Lead Product Designer senior spécialisé gaming tools. Tu conçois l'interface de l'application mobile Squad Planner avec pour objectif de créer une identité visuelle forte, premium et mémorable dès la V1."

### Mission

**Permettre aux squads de:**
- Proposer des créneaux
- Voter collectivement
- Confirmer une session
- Passer au vocal avec une fluidité totale

### Direction Artistique

#### Ambiance Générale
```
Mode: Dark mode par défaut
Atmosphère: "Night gaming room"
Style: Minimaliste, moderne, premium
```

#### Ce qu'il ne faut PAS faire
- ❌ Ni cartoon
- ❌ Ni e-sport cheap
- ❌ Ni SaaS corporate

### Composants UI

#### Cards
```
Border-radius: 12–16px
Background: #141A26
Padding: 16–24px
Shadow: Subtile, elevation progressive
```

#### Boutons
```
Style: Larges, impactants
Principe: Action unique par écran
States: Default, Hover, Active, Disabled
Border-radius: 8–12px
```

#### Barres de Disponibilité
```
Type: Barres horizontales animées
Animation: Progressive fill
Couleurs: Gradient selon état (#2EE59D, #F5C26B, #FF5C5C)
```

#### Avatars
```
Forme: Circulaires
Taille: 32px, 40px, 48px
Border: 2px avec couleur de statut
States: Online (#2EE59D), Busy (#F5C26B), Offline (#9AA3B2)
```

### Écrans à Designer (Phase 0 & 1)

#### Flux Principal - Création & Coordination
1. **Landing** - Page d'accueil / onboarding
2. **Création session** - Formulaire de nouvelle session
3. **Sélection créneaux** - Choix des horaires disponibles
4. **Partage** - Envoi aux membres du squad
5. **Vote collectif** - Interface de vote en temps réel

#### Flux Secondaire - Gestion & Suivi
1. **Résultat confirmé** - Écran de confirmation finale
2. **Home sessions** - Dashboard des sessions
3. **Détail session** - Vue détaillée d'une session
4. **Squad** - Gestion de l'équipe
5. **Rappels** - Notifications et reminders

### Principe Directeur

> "Chaque écran doit montrer une action principale, avoir une hiérarchie visuelle claire, être utilisable en 5 secondes et donner une sensation de contrôle et de fluidité."

#### Checklist par Écran

✅ **Une action principale** visible immédiatement
✅ **Hiérarchie visuelle claire** - titre, contenu, CTA
✅ **Utilisable en 5 secondes** - pas de friction
✅ **Sensation de contrôle** - feedback immédiat
✅ **Fluidité** - transitions naturelles

---

## Composants Visuels

### Système de Design Components

#### 1. Buttons (Boutons)

##### Primary Button
```
Background: #6C7CFF (accent principal)
Text: #FFFFFF
Height: 48–56px
Border-radius: 12px
Font: Inter SemiBold 16px
Hover: Élévation + légère luminosité
Active: Scale(0.98)
```

##### Secondary Button
```
Background: Transparent
Border: 2px solid #6C7CFF
Text: #6C7CFF
Height: 48–56px
Border-radius: 12px
Font: Inter SemiBold 16px
```

##### Destructive Button
```
Background: #FF5C5C
Text: #FFFFFF
Usage: Actions destructives (annuler session)
```

#### 2. Cards (Cartes)

##### Session Card
```
Background: #141A26
Border-radius: 16px
Padding: 20px
Shadow: 0 4px 16px rgba(0,0,0,0.3)
Contenu:
  - Titre session (H3)
  - Jeu + icône
  - Date/heure
  - Avatars participants
  - État (badge)
```

##### User Card
```
Background: #141A26
Border-radius: 12px
Padding: 16px
Layout: Avatar + nom + statut
```

#### 3. Inputs (Champs de formulaire)

##### Text Input
```
Background: #0B0E14
Border: 1px solid transparent
Focus Border: 2px solid #6C7CFF
Height: 48px
Border-radius: 8px
Padding: 12px 16px
Text: #E6EAF2
Placeholder: #9AA3B2
```

##### Select / Dropdown
```
Style: Identique à Text Input
Icon: Chevron-down (#9AA3B2)
Dropdown BG: #141A26
```

#### 4. Status Indicators

##### Availability Bar
```
Container: Full width
Height: 8px
Border-radius: 4px
Background: #141A26
Fill: Gradient selon ratio
  - 100% dispo: #2EE59D
  - 50–99%: #F5C26B
  - <50%: #FF5C5C
Animation: Progressive fill, 300ms
```

##### Badge Status
```
Sizes: Small (24px), Medium (32px)
Border-radius: 12px
Padding: 4px 12px
Font: Inter Medium 12px

Types:
  - Confirmé: BG #2EE59D, Text #0B0E14
  - En attente: BG #F5C26B, Text #0B0E14
  - Annulé: BG #FF5C5C, Text #FFFFFF
```

#### 5. Navigation

##### Bottom Tab Bar
```
Background: #141A26
Height: 64px
Border-top: 1px solid rgba(255,255,255,0.1)
Icons: 24px, 2px stroke
Active: #6C7CFF
Inactive: #9AA3B2
```

##### Header
```
Background: #0B0E14 ou transparent
Height: 56px
Title: Inter Bold 18px
Back button: Arrow-left icon
Actions: Icons à droite
```

#### 6. Avatars

##### Tailles
```
Small: 32x32px
Medium: 40x40px
Large: 48x48px
XLarge: 64x64px
```

##### States
```
Border-width: 2px
Online: Border #2EE59D
Busy: Border #F5C26B
Offline: Border #9AA3B2
```

##### Stack/Group
```
Overlap: -8px (30% overlap)
Max visible: 4 + counter
Counter: "+X" dans cercle
```

---

## Guidelines d'Implémentation

### Spacing System (Système d'Espacement)

```
xs:  4px   - Micro spacing
sm:  8px   - Small spacing
md:  16px  - Medium spacing (défaut)
lg:  24px  - Large spacing
xl:  32px  - Extra large
2xl: 48px  - Section spacing
3xl: 64px  - Page spacing
```

### Grid System

```
Mobile: 4px grid
Columns: 12 columns
Gutter: 16px
Margins: 16px (mobile), 24px (tablet+)
```

### Elevation System (Ombres)

```css
/* Level 1 - Cards légères */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

/* Level 2 - Cards principales */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

/* Level 3 - Modals, popovers */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

/* Level 4 - Glow effect (accent) */
box-shadow: 0 0 24px rgba(108, 124, 255, 0.4);
```

### Border Radius

```
Small: 8px    - Input, small buttons
Medium: 12px  - Buttons, small cards
Large: 16px   - Cards principales
XLarge: 24px  - Sections, modals
Circle: 50%   - Avatars, icon buttons
```

### Transitions

```css
/* Standard */
transition: all 180ms ease-out;

/* Slow (emphasis) */
transition: all 240ms ease-out;

/* Fast (micro-interactions) */
transition: all 120ms ease-out;
```

### Responsive Breakpoints

```
Mobile: 0–599px
Tablet: 600–1023px
Desktop: 1024px+
```

### Accessibility Guidelines

#### Contraste
- Texte principal sur fond: Minimum 7:1 (AAA)
- Texte secondaire sur fond: Minimum 4.5:1 (AA)
- Éléments interactifs: Minimum 3:1

#### Touch Targets
- Minimum: 44x44px
- Recommandé: 48x48px
- Espacement entre targets: 8px minimum

#### États Interactifs
- Hover: Visible et distinct
- Focus: Outline 2px #6C7CFF avec offset
- Active: Feedback visuel immédiat
- Disabled: Opacity 0.4 + cursor not-allowed

### Performance

#### Animations
- 60fps minimum
- GPU acceleration (transform, opacity)
- Éviter: width, height, margin, padding animés

#### Images
- Format: WebP avec fallback PNG
- Avatars: 64x64px max (2x retina = 128x128px)
- Icons: SVG uniquement
- Lazy loading pour images hors viewport

---

## Ressources & Assets

### Polices à Installer

1. **Inter** - https://rsms.me/inter/
2. **Satoshi** - https://www.fontshare.com/fonts/satoshi
3. **SF Pro** (Apple) - Système iOS/macOS

### Bibliothèques d'Icônes

1. **Lucide** - https://lucide.dev
2. **Phosphor** - https://phosphoricons.com

### Outils de Design Recommandés

- **Figma** - Design et prototypage
- **Framer** - Prototypage avancé avec animations
- **Principle** - Micro-interactions

---

## Checklist de Conformité

### Pour chaque écran designer

- [ ] Dark mode activé (#0B0E14 background)
- [ ] Une seule action principale clairement visible
- [ ] Hiérarchie visuelle: Titre → Contenu → CTA
- [ ] Utilisable en moins de 5 secondes
- [ ] Couleurs respectent la palette définie
- [ ] Typographie: Inter/Satoshi/SF Pro uniquement
- [ ] Icônes: Line style 2px stroke
- [ ] Border-radius: 12–16px pour cards
- [ ] Spacing: Multiple de 4px
- [ ] Animations: 180–240ms ease-out
- [ ] Touch targets: Minimum 48x48px
- [ ] Contraste texte: Minimum AA (4.5:1)
- [ ] États interactifs définis (hover, active, disabled)

### Validation Finale

- [ ] L'écran respire le professionnalisme gaming
- [ ] Sensation premium (pas cheap, pas corporate)
- [ ] Pas d'éléments cartoon ou gaming fantasy
- [ ] Cohérence avec l'identité "night gaming room"
- [ ] Fluidité équivalente à Spotify/Discord/Notion

---

## Notes Importantes

### À Faire
✅ Privilégier la simplicité
✅ Une action par écran
✅ Feedback immédiat sur chaque interaction
✅ Animations subtiles et fluides
✅ Dark mode par défaut
✅ Cohérence visuelle absolue

### À Éviter
❌ Surcharge visuelle
❌ Multiples CTA concurrents
❌ Animations tape-à-l'œil
❌ Style cartoon ou gaming cheap
❌ Typographies fantaisistes
❌ Couleurs flashy e-sport

---

## Conclusion

L'identité visuelle de Squad Planner repose sur trois piliers fondamentaux:

1. **Premium & Moderne** - Interface sophistiquée qui respire le professionnalisme
2. **Fluidité Totale** - Organiser une session aussi simple que lancer Spotify
3. **Night Gaming Room** - Ambiance dark, minimaliste et mémorable

Cette charte garantit une expérience utilisateur cohérente, premium et sans friction, positionnant Squad Planner comme l'outil de référence pour les squads exigeants.

---

**Document créé par:** Claude Sonnet 4.5
**Date:** 28 janvier 2026
**Fichier source:** `C:\Users\RudyL\Documents\Maquette figma\Présentation SquadPlanner\Squad Planner - Identite Visuelle.pdf`
