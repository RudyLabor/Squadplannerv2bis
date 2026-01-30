# Analyse Comparative: Squad Planner vs Linear.app

## 🔍 DIAGNOSTIC VISUEL

### État Actuel de Squad Planner

D'après les captures d'écran analysées:

| Élément | Squad Planner Actuel | Linear.app |
|---------|---------------------|------------|
| **Background** | Dégradé pastel (beige/rose/turquoise) | Noir profond `#08090a` |
| **Cartes** | Blanc pur + ombres douces | Gris foncé `#1a1a1a` sans ombres |
| **Border Radius** | 16-20px (très arrondi) | 6-8px (subtil) |
| **Couleur primaire** | Violet/gradient | Bleu accent `#5E6AD2` |
| **Typographie** | 14-16px, espacement normal | 13px, letter-spacing -0.02em |
| **Ombres** | Soft shadows partout | Aucune ombre visible |
| **Effets** | Blur, gradients, glow | Flat, minimal |
| **Densité** | Espacé, aéré | Dense, compact |
| **Mode** | Light (clair) | Dark only |

### Score de Similarité: 15/100 ❌

**Verdict**: L'UI actuelle est à l'opposé de Linear. C'est un design "warm premium" vs le design "dark minimal pro" de Linear.

---

## 📋 CHANGEMENTS REQUIS

### 1. COULEURS (Priorité: CRITIQUE)

```css
/* SUPPRIMER */
--bg-base: #f5f3f0;        /* Beige chaud */
--bg-gradient: linear-gradient(...); /* Gradients pastels */

/* REMPLACER PAR */
--bg-base: #08090a;        /* Noir Linear */
--bg-elevated: #111214;    /* Cartes */
--bg-surface: #1a1a1a;     /* Surfaces */
--border: #2a2a2a;         /* Bordures subtiles */
--text-primary: #ffffff;   /* Texte principal */
--text-secondary: #8a8f98; /* Texte secondaire */
--accent: #5E6AD2;         /* Bleu Linear */
```

### 2. TYPOGRAPHIE (Priorité: HAUTE)

```css
/* SUPPRIMER */
font-size: 14-16px;
line-height: 1.6;

/* REMPLACER PAR */
font-size: 13px;
line-height: 1.5;
letter-spacing: -0.02em;
font-family: Inter, -apple-system, sans-serif;
```

### 3. ESPACEMENTS (Priorité: HAUTE)

```css
/* SUPPRIMER */
padding: 24px 32px;
gap: 24px;
border-radius: 16px;

/* REMPLACER PAR */
padding: 12px 16px;
gap: 8px;
border-radius: 6px;
```

### 4. COMPOSANTS (Priorité: CRITIQUE)

#### Boutons
```css
/* Linear style */
height: 32px;
padding: 0 12px;
font-size: 13px;
border-radius: 6px;
background: transparent;
border: 1px solid #2a2a2a;
transition: all 120ms ease;
```

#### Inputs
```css
/* Linear style */
height: 32px;
background: #111214;
border: 1px solid #2a2a2a;
border-radius: 6px;
font-size: 13px;
```

#### Cards
```css
/* Linear style */
background: #111214;
border: 1px solid #1f1f1f;
border-radius: 8px;
box-shadow: none; /* AUCUNE OMBRE */
```

### 5. ANIMATIONS (Priorité: MOYENNE)

```css
/* SUPPRIMER */
transition: all 300ms cubic-bezier(...);
animation: blur-in 500ms;

/* REMPLACER PAR */
transition: all 120ms ease;
/* Animations minimales, rapides, subtiles */
```

---

## 🎯 PLAN D'IMPLÉMENTATION

### Phase 1: Design Tokens (theme.css)
- [ ] Remplacer toutes les couleurs par le système Linear
- [ ] Forcer dark mode uniquement
- [ ] Mettre à jour les variables CSS

### Phase 2: Composants de Base
- [ ] Refactoriser Button (32px height, 6px radius)
- [ ] Refactoriser Input (style Linear)
- [ ] Refactoriser Card (no shadows, dark bg)

### Phase 3: Layout Global
- [ ] Sidebar style Linear (narrow, icons only option)
- [ ] Header compact
- [ ] Densité augmentée partout

### Phase 4: Écrans
- [ ] Appliquer le nouveau système à tous les 68 écrans
- [ ] Supprimer tous les gradients pastels
- [ ] Supprimer toutes les ombres soft

---

## 📸 RÉFÉRENCES VISUELLES

### Linear.app Caractéristiques Clés:
1. **Sidebar**: 240px, fond noir, icônes monochromes
2. **Header**: 48px height, minimal, breadcrumbs
3. **Lists**: Dense, hover subtle, pas de cartes
4. **Forms**: Inline, compacts, labels au-dessus
5. **Modals**: Centrés, fond noir, bordure subtile
6. **Tables**: Lignes fines, hover row highlight

### Ce qui doit DISPARAÎTRE:
- ❌ Gradients pastels (beige/rose/turquoise)
- ❌ Ombres douces (box-shadow avec blur)
- ❌ Coins très arrondis (16px+)
- ❌ Effets de blur/glass
- ❌ Couleurs "warm" (beige, crème)
- ❌ Espacements généreux
- ❌ Mode light

### Ce qui doit APPARAÎTRE:
- ✅ Fond noir profond
- ✅ Bordures subtiles grises
- ✅ Typographie compacte
- ✅ Accent bleu unique
- ✅ Transitions rapides (120ms)
- ✅ Densité élevée
- ✅ Flat design
