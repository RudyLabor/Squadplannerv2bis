# 🎨 SQUAD PLANNER - ALIGNEMENT UI/UX SUR MAQUETTES FIGMA

> **Objectif** : Aligner 100% de l'implémentation sur les maquettes Figma
> **Créé le** : 27 janvier 2026
> **Status** : EN COURS

---

## 📐 DESIGN SYSTEM DE RÉFÉRENCE

### Couleurs principales
| Nom | Hex | Usage |
|-----|-----|-------|
| **Beige Background** | `#F5F3F0` | Fond principal de l'app |
| **Amber Primary** | `#F59E0B` | Boutons CTA, accents |
| **Amber Dark** | `#D97706` | Hover states |
| **White** | `#FFFFFF` | Cards, surfaces |
| **Gray 900** | `#111827` | Texte principal |
| **Gray 500** | `#6B7280` | Texte secondaire |
| **Gray 300** | `#D1D5DB` | Bordures légères |
| **Green Success** | `#10B981` | Fiabilité haute, succès |
| **Orange Warning** | `#F59E0B` | Fiabilité moyenne |
| **Purple Accent** | `#8B5CF6` | Intelligence IA |
| **Teal Accent** | `#14B8A6` | Récap hebdo |

### Typographie
| Élément | Taille | Poids | Couleur |
|---------|--------|-------|---------|
| H1 (Titre écran) | 28px | Bold | Gray 900 |
| H2 (Section) | 18px | Semibold | Gray 900 |
| H3 (Card title) | 16px | Semibold | Gray 900 |
| Body | 14px | Regular | Gray 700 |
| Caption | 12px | Medium | Gray 500 |
| Stats number | 24px | Bold | Gray 900 |

### Espacements
| Nom | Valeur |
|-----|--------|
| Page padding | 16px (mobile), 24px (desktop) |
| Section gap | 24px |
| Card padding | 16px |
| Card gap | 12px |
| Border radius (cards) | 16px |
| Border radius (buttons) | 9999px (full) |
| Border radius (inputs) | 12px |

### Ombres
| Nom | Valeur |
|-----|--------|
| Card shadow | `0 1px 3px rgba(0,0,0,0.05)` |
| Card hover | `0 4px 12px rgba(0,0,0,0.08)` |
| Button shadow | `0 2px 8px rgba(245,158,11,0.3)` |

---

## 🔧 PHASE 0 : FONDATIONS (À faire en premier)

### 0.1 Variables CSS globales
| Tâche | Status | Notes |
|-------|--------|-------|
| Mettre à jour `--bg-primary` → `#F5F3F0` | ⏳ | |
| Mettre à jour `--primary-500` → `#F59E0B` | ⏳ | |
| Ajouter toutes les couleurs du design system | ⏳ | |
| Vérifier les border-radius globaux | ⏳ | |
| Simplifier les ombres | ⏳ | |

### 0.2 Composants UI de base
| Composant | Status | Notes |
|-----------|--------|-------|
| Button (style maquette) | ✅ | ActionButton dans DesignSystem.tsx |
| Card (style maquette) | ✅ | FeatureCard, SquadCard dans DesignSystem.tsx |
| Input (style maquette) | ✅ | Input, SearchBar dans DesignSystem.tsx |
| Badge (coloré) | ✅ | Badge component dans DesignSystem.tsx |
| StatCard (grille stats) | ✅ | StatCard, StatsRow dans DesignSystem.tsx |

### 0.3 Layout global
| Tâche | Status | Notes |
|-------|--------|-------|
| Supprimer sidebar desktop complexe | ⏳ | Mobile-first |
| Centrer le contenu (max-w-md) | ⏳ | |
| Supprimer animations lourdes | ⏳ | Garder transitions simples |
| Background beige global | ⏳ | |

---

## 📱 PHASE 1 : ÉCRANS PRINCIPAUX (Priorité HAUTE)

### 1.1 HomeScreen ✅ TERMINÉ
| Élément | Maquette | Status | Notes |
|---------|----------|--------|-------|
| Header "Squad Planner" | Titre 28px bold + sous-titre | ✅ | |
| Stats row (3 colonnes) | Sessions / Joueurs / Fiabilité | ✅ | |
| Boutons action | Orange (Créer) + Blanc (Rejoindre) | ✅ | |
| Section "Intelligence & Outils" | Cards colorées (violet/teal) | ✅ | |
| Section "Social & Compétition" | Cards violet/orange | ✅ | |
| Section "Communauté & B2B" | Cards standard | ✅ | |
| Section "Mes Squads" | Liste horizontale | ✅ | |

### 1.2 SquadsScreen ✅ TERMINÉ
| Élément | Maquette | Status | Notes |
|---------|----------|--------|-------|
| Header "Mes squads" + count | ✓ | ✅ | |
| Search bar + bouton orange (+) | ✓ | ✅ | |
| Cards en grille 2 colonnes | ✓ | ✅ | |
| Badge sessions (vert avec icône wifi) | ✓ | ✅ | |
| Image jeu arrondie | ✓ | ✅ | |
| Stats Membres + Fiabilité | ✓ | ✅ | |
| Date prochaine session | ✓ | ✅ | |

### 1.3 ProfileScreen ✅ TERMINÉ
| Élément | Maquette | Status | Notes |
|---------|----------|--------|-------|
| Header avec avatar + badge niveau | ✓ | ✅ | |
| Nom + rôle + email | ✓ | ✅ | |
| Grille stats 2x2 (Fiabilité, Sessions, MVP, Heures) | ✓ | ✅ | |
| Cards Premium + Stats Pro | ✓ | ✅ | |
| Section "Social & Compétition" | ✓ | ✅ | |
| Section "Activité récente" | ✓ | ✅ | |
| Section "Paramètres" (liste) | ✓ | ✅ | |

### 1.4 SessionsScreen ✅ TERMINÉ
| Élément | Maquette | Status | Notes |
|---------|----------|--------|-------|
| Header + filtres | ✓ | ✅ | |
| Cards sessions avec image | ✓ | ✅ | |
| Badge participants | ✓ | ✅ | |
| Bouton RSVP | ✓ | ✅ | |

### 1.5 PremiumScreen ✅ TERMINÉ
| Élément | Maquette | Status | Notes |
|---------|----------|--------|-------|
| Header avec couronne | ✓ | ✅ | |
| Toggle Mensuel/Annuel | ✓ | ✅ | |
| Prix avec réduction | ✓ | ✅ | |
| Liste features avec badges PRO | ✓ | ✅ | |
| Bouton CTA gradient | ✓ | ✅ | |
| Témoignages | ✓ | ✅ | |

---

## 📱 PHASE 2 : ÉCRANS SQUADS & SESSIONS (Priorité HAUTE)

### 2.1 SquadDetailScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Header avec image banner | ⏳ | |
| Stats squad (membres, fiabilité) | ⏳ | |
| Liste membres avec avatars | ⏳ | |
| Prochaines sessions | ⏳ | |
| Actions (inviter, quitter) | ⏳ | |

### 2.2 CreateSquadScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Form inputs style maquette | ⏳ | |
| Game picker | ⏳ | |
| Bouton créer orange | ⏳ | |

### 2.3 JoinSquadScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Code input | ⏳ | |
| QR Scanner option | ⏳ | |
| Liste squads publics | ⏳ | |

### 2.4 ProposeSessionScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Date/Time picker | ⏳ | |
| Squad selector | ⏳ | |
| Description input | ⏳ | |

### 2.5 VoteSessionScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Options de créneaux | ⏳ | |
| Votes visuels | ⏳ | |
| Bouton voter | ⏳ | |

### 2.6 SquadChatScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Messages bubbles | ⏳ | |
| Input message | ⏳ | |
| Avatars | ⏳ | |

---

## 📱 PHASE 3 : ÉCRANS INTELLIGENCE & PREMIUM (Priorité MOYENNE)

### 3.1 IntelligenceScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Cards colorées IA | ⏳ | |
| Suggestions | ⏳ | |

### 3.2 SmartSuggestionsScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Liste suggestions | ⏳ | |
| Cards avec actions | ⏳ | |

### 3.3 WeeklyRecapScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Stats semaine | ⏳ | |
| Graphiques | ⏳ | |

### 3.4 AdvancedStatsScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Charts | ⏳ | |
| Filtres | ⏳ | |

### 3.5 CoachingToolsScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Outils liste | ⏳ | |
| Cards fonctionnalités | ⏳ | |

---

## 📱 PHASE 4 : ÉCRANS SOCIAL & COMPÉTITION (Priorité MOYENNE)

### 4.1 FriendsScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Liste amis | ⏳ | |
| Search | ⏳ | |
| Invitations | ⏳ | |

### 4.2 LeaderboardScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Top 3 podium | ⏳ | |
| Liste classement | ⏳ | |
| Filtres | ⏳ | |

### 4.3 AchievementsScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Badges grid | ⏳ | |
| Progress bars | ⏳ | |

### 4.4 TournamentsScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Liste tournois | ⏳ | |
| Cards avec dates | ⏳ | |

### 4.5 ChallengesScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Défis actifs | ⏳ | |
| Progress | ⏳ | |

---

## 📱 PHASE 5 : ÉCRANS PARAMÈTRES & AUTH (Priorité BASSE)

### 5.1 LoginScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Logo centré | ⏳ | |
| Inputs style maquette | ⏳ | |
| Bouton connexion orange | ⏳ | |

### 5.2 SignupScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Form complet | ⏳ | |
| Validation visuelle | ⏳ | |

### 5.3 EditProfileScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Avatar editor | ⏳ | |
| Form fields | ⏳ | |

### 5.4 PreferencesScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Toggles | ⏳ | |
| Sections organisées | ⏳ | |

### 5.5 NotificationsScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Liste notifications | ⏳ | |
| Read/unread states | ⏳ | |

---

## 📱 PHASE 6 : ÉCRANS B2B & ÉCOSYSTÈME (Priorité BASSE)

### 6.1 IntegrationsScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Cards intégrations | ⏳ | |
| Status connecté/non | ⏳ | |

### 6.2 DiscordBotScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Setup guide | ⏳ | |
| Configuration | ⏳ | |

### 6.3 CalendarSyncScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Providers (Google, Apple) | ⏳ | |
| Status sync | ⏳ | |

### 6.4 ApiDocsScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Documentation | ⏳ | |
| Code examples | ⏳ | |

### 6.5 WebhooksScreen
| Élément | Status | Notes |
|---------|--------|-------|
| Liste webhooks | ⏳ | |
| CRUD | ⏳ | |

---

## ✅ CHECKLIST FINALE

### Avant soumission App Store
- [ ] Tous les écrans alignés sur maquettes
- [ ] Couleurs 100% cohérentes
- [ ] Typographie uniforme
- [ ] Espacements respectés
- [ ] Ombres et arrondis corrects
- [ ] Animations légères uniquement
- [ ] Test sur iPhone (Safari)
- [ ] Test sur Android (Chrome)
- [ ] Test mode sombre (si applicable)
- [ ] Performance OK (pas de lag)
- [ ] Aucune erreur console
- [ ] Assets App Store prêts

---

## 📊 PROGRESSION GLOBALE

| Phase | Écrans | Status | % |
|-------|--------|--------|---|
| Phase 0 - Fondations | - | ✅ | 100% |
| Phase 1 - Principaux | 5 | ✅ | 100% |
| Phase 2 - Squads/Sessions | 6 | ⏳ | 0% |
| Phase 3 - Intelligence | 5 | ⏳ | 0% |
| Phase 4 - Social | 5 | ⏳ | 0% |
| Phase 5 - Paramètres | 5 | ⏳ | 0% |
| Phase 6 - B2B | 5 | ⏳ | 0% |
| **TOTAL** | **31+** | **🟡** | **20%** |

---

## 📝 LOG DES MODIFICATIONS

| Date | Phase | Action | Détails |
|------|-------|--------|---------|
| 27/01/2026 | - | Création | Document de suivi créé |

---

*Squad Planner - UI Alignment Roadmap v1.0*
