# 🎨 DESIGN SYSTEM PREMIUM - SQUAD PLANNER

## PHILOSOPHIE
- **Fini le coloriage** : On utilise des dégradés subtils, du glass morphism, et des borders colorées
- **Premium & raffiné** : Tout doit respirer la qualité et la modernité 2026
- **Cohérence sémantique** : Chaque couleur a une signification précise

---

## 🎯 HIÉRARCHIE DES COULEURS

### 1. **PREMIUM / IA** → Violet-Pourpre
```css
/* Utilisé pour : Intelligence IA, fonctionnalités premium exclusives */
bg-gradient-to-br from-violet-500 to-purple-600
shadow-lg shadow-violet-500/20
border-violet-200
```

### 2. **PRIMARY / ENGAGEMENT** → Amber
```css
/* Utilisé pour : Actions principales, engagement, compétition */
bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)]
shadow-lg shadow-[var(--primary-500)]/20
border-[var(--primary-200)]
```

### 3. **SECONDARY / SOCIAL** → Teal
```css
/* Utilisé pour : Social, découverte, collaboration */
bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)]
shadow-lg shadow-[var(--secondary-500)]/20
border-[var(--secondary-200)]
```

### 4. **SUCCESS** → Vert
```css
/* Utilisé pour : Confirmations, succès, validations */
bg-gradient-to-br from-[var(--success-50)] to-[var(--success-100)]
border-[var(--success-200)]
text-[var(--success-700)]
/* Au hover : */
hover:from-[var(--success-500)] hover:to-[var(--success-600)] hover:text-white
```

### 5. **ERROR** → Rouge
```css
/* Utilisé pour : Refus, erreurs, alertes */
bg-gradient-to-br from-[var(--error-50)] to-[var(--error-100)]
border-[var(--error-200)]
text-[var(--error-700)]
/* Au hover : */
hover:from-[var(--error-500)] hover:to-[var(--error-600)] hover:text-white
```

### 6. **WARNING** → Orange
```css
/* Utilisé pour : Avertissements, métriques moyennes */
bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)]
border-[var(--warning-200)]
text-[var(--warning-700)]
```

### 7. **STANDARD / NEUTRE** → Blanc
```css
/* Utilisé pour : Fonctionnalités standard, cartes neutres */
bg-white
border-[0.5px] border-[var(--border-subtle)]
shadow-sm hover:shadow-lg
/* Avec icônes colorées selon le contexte */
```

---

## 📐 COMPOSANTS TYPES

### **Bouton CTA Principal**
```tsx
<button className="px-6 py-3 rounded-2xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white font-bold shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 transition-all duration-200">
  Action
</button>
```

### **Bouton RSVP Succès**
```tsx
<button className="px-4 py-2 rounded-xl bg-gradient-to-br from-[var(--success-50)] to-[var(--success-100)] border border-[var(--success-200)] text-[var(--success-700)] font-bold hover:from-[var(--success-500)] hover:to-[var(--success-600)] hover:text-white transition-all duration-200">
  ✓ Confirmer
</button>
```

### **Bouton RSVP Refus**
```tsx
<button className="px-4 py-2 rounded-xl bg-gradient-to-br from-[var(--error-50)] to-[var(--error-100)] border border-[var(--error-200)] text-[var(--error-700)] font-bold hover:from-[var(--error-500)] hover:to-[var(--error-600)] hover:text-white transition-all duration-200">
  ✕ Refuser
</button>
```

### **Badge de statut (succès)**
```tsx
<span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--success-50)] to-[var(--success-100)] border border-[var(--success-200)] text-xs font-bold text-[var(--success-700)]">
  Confirmé
</span>
```

### **Badge de statut (actif/urgent)**
```tsx
<span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--primary-600)]/10 border border-[var(--primary-500)]/20 text-xs font-bold text-[var(--primary-600)]">
  Bientôt
</span>
```

### **Carte standard premium**
```tsx
<div className="bg-white rounded-2xl border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-lg transition-all duration-200">
  {/* Contenu */}
</div>
```

### **Carte highlight (session active)**
```tsx
<div className="bg-gradient-to-r from-[var(--primary-50)] to-[var(--primary-100)] border border-[var(--primary-200)] rounded-2xl p-4">
  {/* Contenu */}
</div>
```

### **Filtre actif (pills)**
```tsx
{/* Actif */}
<button className="px-5 py-2.5 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white font-semibold shadow-lg shadow-[var(--primary-500)]/20">
  Filtre
</button>

{/* Inactif */}
<button className="px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-sm border-[0.5px] border-[var(--border-medium)] text-[var(--fg-secondary)] font-semibold hover:bg-white hover:border-[var(--border-strong)] shadow-sm">
  Filtre
</button>
```

### **Indicateur de métrique (fiabilité)**
```tsx
{/* Excellente (≥90%) */}
<span className="px-2 py-0.5 rounded-full bg-gradient-to-br from-[var(--success-50)] to-[var(--success-100)] border border-[var(--success-200)] text-xs font-bold text-[var(--success-700)]">
  92%
</span>

{/* Bonne (75-89%) */}
<span className="px-2 py-0.5 rounded-full bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] border border-[var(--primary-200)] text-xs font-bold text-[var(--primary-700)]">
  84%
</span>

{/* Moyenne (<75%) */}
<span className="px-2 py-0.5 rounded-full bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)] border border-[var(--warning-200)] text-xs font-bold text-[var(--warning-700)]">
  68%
</span>
```

---

## 🚫 À ÉVITER ABSOLUMENT

❌ **Fonds pleins sans dégradé** (sauf blanc neutre)
```tsx
// MAUVAIS
<div className="bg-[var(--primary-500)]">

// BON
<div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)]">
```

❌ **Couleurs saturées sans contexte**
```tsx
// MAUVAIS
<div className="bg-yellow-500">

// BON (avec sémantique)
<div className="bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)] border border-[var(--warning-200)]">
```

❌ **Absence de shadow sur les éléments interactifs**
```tsx
// MAUVAIS
<button className="bg-blue-500">

// BON
<button className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] shadow-lg shadow-[var(--primary-500)]/20">
```

---

## ✅ CHECKLIST AVANT DE PUBLIER UN COMPOSANT

- [ ] Les dégradés sont subtils (50→100 ou 500→600, jamais plus)
- [ ] Les shadows ont de l'opacité (shadow-color/20 ou shadow-color/30)
- [ ] Les borders sont fines (0.5px ou 1px max)
- [ ] Les couleurs suivent la sémantique (Primary=Engagement, Success=Validation, etc.)
- [ ] Les transitions sont fluides (duration-200)
- [ ] Le hover apporte une valeur visuelle claire
- [ ] Pas de "coloriage" : chaque couleur a une raison d'être

---

## 🎯 EXEMPLES CONCRETS

### Page Sessions → Timeline
- **Layout** : Timeline verticale avec ligne de connexion
- **Time badges** : Fond dégradé primary si aujourd'hui, blanc sinon
- **Status** : Badges success/error avec dégradés légers
- **Actions** : Boutons RSVP avec hover transformatif

### Page Squads → Grid
- **Layout** : Grid 2 colonnes, cartes verticales
- **Game badges** : Centré avec border blanche
- **Reliability** : Badges colorés selon score
- **Active state** : Fond dégradé primary léger sur footer

### Page Home → Mixed
- **CTA** : Boutons primary avec shadow colorée
- **Stats** : Cartes blanches avec hover subtil
- **Features** : Mix de gradients selon importance (Violet=IA, Amber=Primary, Blanc=Standard)
