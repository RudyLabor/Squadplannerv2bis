# 🚀 ROADMAP SQUAD PLANNER - TRANSFORMATION ELITE

**Objectif**: Transformer Squad Planner en "l'infrastructure de coordination sociale du gaming"
**Vision**: L'équivalent de Notion, Slack ou Linear, mais pour le temps et l'engagement humain
**Standard**: Zéro bug, UI/UX top 1% mondial (Linear/Stripe/Apple)
**Dernière mise à jour**: 28 janvier 2026 - 19h15
**Statuts mis à jour**: ✅ Audit complet effectué

---

## 📊 RÉSUMÉ EXÉCUTIF - ÉTAT ACTUEL

### Score Global d'Implémentation: **62% Phase 0 | 11% Phase 1**

**Documents clés**:
- 📄 [AUDIT-IMPLEMENTATION.md](./AUDIT-IMPLEMENTATION.md) - Audit technique détaillé
- 📄 [GAP-ANALYSIS.md](./GAP-ANALYSIS.md) - Analyse des écarts vs PDF Checklist
- 📄 Ce fichier - Roadmap complète avec statuts réels

### ✅ BONNES NOUVELLES
1. 🎉 **Système RSVP implémenté à 80%** (DB + API + UI SwipeableRSVP)
2. 🎉 **Invitation par code fonctionnelle à 70%** (API complète, manque UI)
3. ✅ **Architecture DB solide** (27 tables + RLS policies)
4. ✅ **Auth email fonctionnelle** (95% - AbortError fixed)
5. ✅ **Chat squad opérationnel** (85%)
6. ✅ **Création sessions** (85%)

### 🔴 GAPS CRITIQUES (Sprint 1 prioritaire)
1. ❌ **Check-in obligatoire: 0%** - Feature signature absente
2. ❌ **Notifications auto (J-1, H-1, 10min): 0%** - Cron jobs manquants
3. ❌ **Système fiabilité: 15%** - Calcul automatique absent
4. ❌ **Badges comportementaux: 5%** - Engine attribution manquant
5. ⚠️ **RSVP real-time: 40%** - Subscriptions manquantes

### 🎯 SPRINT 1 RECOMMANDÉ (7 jours)
1. **Compléter RSVP** (2j) - Real-time + compteur visuel
2. **Implémenter Check-in** (3j) - Flow complet + "En route"
3. **Notifications auto** (2j) - Cron jobs J-1/H-1/10min

**Après Sprint 1**: Phase 0 sera à **95%** (production-ready MVP)

---

## 🎯 VISION & POSITIONNEMENT

**Source**: Checklist Complète de Développement (PDF Master)

### Le Problème Réel (et Violent)

Aujourd'hui chez les gamers, l'organisation est un **chaos quotidien** qui tue les squads avant même qu'elles ne commencent à jouer:
- ❌ Créneaux flous, horaires imprécis
- ❌ Retards fréquents, abandons en série
- ❌ Discord inadapté (excellent chat, mauvais pour coordination)
- ❌ Leaders épuisés, disbandment des squads

**Ce n'est PAS un problème de matching. C'est un problème de coordination sociale.**

### Notre Réponse

Squad Planner transforme un groupe Discord chaotique en une équipe qui joue vraiment ensemble.

**Différenciation Clé:**
- ✅ Organisation > Matching
- ✅ Engagement > Réseau social
- ✅ Fiabilité > Flexibilité
- ✅ Rituel > One-shot

---

## 🏗️ LES 5 PILIERS FONDAMENTAUX

**Principe de conception strict**:
> "Toute fonctionnalité doit renforcer au moins un de ces cinq piliers. Si elle ne le fait pas, elle n'a pas sa place dans le produit. Cette discipline garantit la cohérence et l'efficacité du système."

### Pilier 1: Planning 📅
**Transformer l'intention vague en engagement concret**
- Créneaux multiples, vote collectif
- Auto-verrouillage intelligent
- Suggestions automatiques basées sur historique réel

### Pilier 2: Engagement 🤝
**Créer un contrat moral et social**
- Confirmation obligatoire
- Check-in pré-session
- Bouton "Je suis en route"
- Rappels progressifs pour maximiser présence effective

### Pilier 3: Pression Sociale Positive 👥
**Encourager les bons comportements sans punir**
- Visibilité des engagements
- Statuts en temps réel
- Transparence totale qui crée responsabilité collective naturelle

### Pilier 4: Réputation ⭐
**Mesurer et valoriser la fiabilité**
- Scores individuels
- Badges comportementaux
- Historique traçable
- Reconnaissance des membres les plus engagés

### Pilier 5: Automatisation 🤖
**Réduire la friction à zéro**
- Suggestions intelligentes
- Rappels automatiques
- Bot Discord natif
- Prédictions comportementales
- Coordination → rituel sans effort

---

## 📊 LÉGENDE & CONVENTIONS

### Statuts
- 🔴 **À Faire** - Non commencé
- 🟡 **En cours** - Travail en cours
- 🟢 **Terminé** - Complété et validé
- ⏳ **En attente** - Audit agent en cours

### Priorités
- 🔥 **Haute** - Critique pour l'expérience utilisateur
- ⚡ **Moyenne** - Important mais pas bloquant
- 💡 **Basse** - Nice to have

### Catégories
- **Feature** - Nouvelle fonctionnalité
- **UI/UX** - Interface utilisateur / Expérience
- **Bug** - Correction de bug
- **QA** - Tests et qualité
- **Performance** - Optimisation
- **DevOps** - Infrastructure

---

## 🎯 PHASE 0: PROOF OF VALUE (MVP RÉEL)

**Source PDF**: Phase 0 - Fondations MVP
**Objectif**: Prouver que les joueurs utilisent réellement l'outil pour s'organiser. Cette phase établit les fondations essentielles du produit et valide le concept avant tout investissement majeur.

**KPI de succès Phase 0**:
- ✅ Des squads qui planifient **au moins 2 sessions par semaine**
- ✅ Taux de présence **supérieur à 80%**
- ✅ Cette métrique simple valide que l'outil résout un vrai problème et devient un rituel

### 🔐 Authentification & Accès

| Statut | Catégorie | Tâche | Priorité | Source PDF | Fichiers concernés |
|--------|-----------|-------|----------|------------|-------------------|
| 🟢 | Feature | Authentification par email | 🔥 | Phase 0 | src/app/services/auth.ts (✅ 95%) |
| 🔴 | Feature | OAuth Discord intégré | 🔥 | Phase 0 | Config existe, pas de UI flow |
| 🟢 | Feature | Gestion des profils utilisateurs | 🔥 | Phase 0 | src/app/contexts/AuthContext.tsx (✅ 75%) |
| 🟢 | Bug | Connexion sécurisée (Fix AbortError) | 🔥 | - | src/lib/supabase.ts (✅ FIXED) |
| 🟡 | QA | Test end-to-end signup → login → home | 🔥 | - | Email confirmation requis |

### 👥 Gestion des Squads

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | Création squad (nom, jeu, **fuseau horaire**) | 🔥 | Phase 0 | squadsAPI.create() ✅ (90%) |
| 🟡 | Feature | **Système invitation par lien unique** | 🔥 | Phase 0 | API existe (70%), manque UI/deep link |
| 🟢 | UI/UX | Page Squad centrale avec vue d'ensemble | 🔥 | Phase 0 | SquadDetailScreen.tsx ✅ (80%) |
| 🟢 | Feature | Liste des membres avec statuts | 🔥 | Phase 0 | squad_members API ✅ (80%) |
| 🟡 | Feature | Affichage prochaine session | 🔥 | Phase 0 | Existe, manque countdown timer |

### 📅 Planification de Sessions

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | Création session: date, heure, jeu, **durée** | 🔥 | Phase 0 | ProposeSessionScreen.tsx ✅ (85%) |
| 🟡 | UI/UX | Interface calendrier intuitive | 🔥 | Phase 0 | Calendrier basic existe (60%) |
| 🔴 | UI/UX | **Sélecteur heure optimisé (2 colonnes)** | 🔥 | Phase 0 | Design spécifique PDF à implémenter |
| 🟢 | Feature | Commentaires et détails additionnels | ⚡ | Phase 0 | Description/notes ✅ |

### ✅ Système RSVP (CŒUR DE L'APPLICATION)

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | **Réponse "Je viens"** | 🔥 | Phase 0 | sessionsAPI.rsvp('yes') ✅ |
| 🟢 | Feature | **Réponse "Je ne viens pas"** | 🔥 | Phase 0 | sessionsAPI.rsvp('no') ✅ |
| 🟢 | Feature | **Statut "Peut-être" (pondération faible)** | 🔥 | Phase 0 | sessionsAPI.rsvp('maybe') ✅ |
| 🟢 | Feature | **Visibilité en temps réel des confirmations** | 🔥 | Phase 0 | ✅ SessionRSVPCard avec real-time |
| 🟢 | DB | Table session_rsvps avec statuts | 🔥 | - | ✅ Créée avec RLS policies |
| 🟢 | API | createRSVP, updateRSVP, getRSVPsBySession | 🔥 | - | sessionsAPI.rsvp() ✅ (upsert) |
| 🟢 | UI | Cards membres avec statuts visuels | 🔥 | - | SessionRSVPCard.tsx ✅ |
| 🟢 | UI | Jauge de complétion visuelle | 🔥 | Phase 0 | ✅ Progress bar + compteur "5/8" |
| 🟢 | UI | Modal détails session | 🔥 | Phase 0 | ✅ SessionDetailModal.tsx |

**✅ SYSTÈME RSVP COMPLET**: 100% implémenté (DB + API + UI + Real-time + Compteur visuel)

### 🔔 Notifications Automatiques

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | Notification nouvelle session | 🔥 | Phase 0 | ✅ Table notifications + envoi |
| 🟢 | Feature | **Rappel J-1 (24h avant)** | 🔥 | Phase 0 | ✅ Edge function send-reminders |
| 🟢 | Feature | **Rappel H-1 (1h avant)** | 🔥 | Phase 0 | ✅ Edge function send-reminders |
| 🟢 | Feature | **Rappel 10 minutes avant** | 🔥 | Phase 0 | ✅ Edge function send-reminders |
| 🟢 | DevOps | Système de scheduling (Vercel Cron) | 🔥 | - | ✅ vercel.json + api/send-reminders.ts |
| 🟢 | DevOps | Edge function Supabase | 🔥 | - | ✅ supabase/functions/send-reminders |

### 💬 Communication

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | Chat de squad minimal | 🔥 | Phase 0 | SquadChatScreen.tsx ✅ (85%) |
| 🟡 | Feature | Notifications push | 🔥 | Phase 0 | Hooks créés, intégration partielle (60%) |
| 🟢 | Feature | Système de commentaires | ⚡ | Phase 0 | Messages sur sessions ✅ |

---

## 📈 PHASE 1: ENGAGEMENT & DISCIPLINE

**Source PDF**: Phase 1 - Engagement & Discipline
**Objectif**: Transformer l'outil en système indispensable en introduisant la responsabilité sociale et la mesure de fiabilité. Créer une pression douce qui encourage le respect des engagements.

**KPI de succès Phase 1**:
- ✅ Les joueurs ouvrent l'application **systématiquement avant chaque session**
- ✅ L'outil devient le **point de passage obligé**
- ✅ Taux de no-show **réduit de 60%** par rapport à la coordination Discord classique

### ⭐ Système de Fiabilité Joueur

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | **Score calculé automatiquement** | 🔥 | Phase 1 | ✅ calculate_user_reliability() + trigger auto |
| 🟢 | Feature | **Pourcentage de présence réelle** | 🔥 | Phase 1 | ✅ Colonnes + calcul automatique |
| 🟢 | Feature | **Taux de retard** | 🔥 | Phase 1 | ✅ Column sessions_late + tracking |
| 🟢 | Feature | **Taux de no-show** | 🔥 | Phase 1 | ✅ Column sessions_no_show + tracking |
| 🟢 | Feature | **Régularité sur dernières sessions** | ⚡ | Phase 1 | ✅ Détaillé dans get_user_detailed_stats() |
| 🟢 | UI/UX | Affichage score sur profil | 🔥 | Phase 1 | ✅ ReliabilityBadge.tsx + tiers (6 niveaux) |
| 🟢 | UI/UX | Graphique évolution fiabilité | ⚡ | Phase 1 | ✅ ReliabilityCard component avec trend |
| 🟢 | DB | Migration reliability_system | 🔥 | - | ✅ 20260129_reliability_system.sql |
| 🟢 | Utils | Utility TypeScript | 🔥 | - | ✅ reliability-calculator.ts (15 fonctions) |

### 📚 Historique Complet

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | **Traçabilité totale sessions passées** | 🔥 | Phase 1 | ✅ HistoryScreen.tsx (query check-ins) |
| 🟢 | Feature | **Présence effective par session** | 🔥 | Phase 1 | ✅ Check-ins tracking complet |
| 🟢 | Feature | **Durée de jeu** | ⚡ | Phase 1 | ✅ Column duration + affichage |
| 🟢 | Feature | **Performance d'engagement** (individuelle & collective) | ⚡ | Phase 1 | ✅ Stats cards (total/attended/late/missed) |
| 🟢 | UI/UX | Page historique avec filtres | ⚡ | Phase 1 | ✅ Filtres: all/attended/missed/late |
| 🟢 | UI/UX | Time range filters | ⚡ | Phase 1 | ✅ week/month/quarter/year/all |
| 🟢 | Feature | Export CSV | ⚡ | Phase 1 | ✅ Bouton export historique |
| 🟢 | UI | ReliabilityBadge sur History | 🔥 | Phase 1 | ✅ Affichage score période |

### 👑 Rôles et Permissions

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | **Hiérarchie claire: Leader, Co-leader, Membre** | 🔥 | Phase 1 | ✅ Type enum squad_role + hiérarchie complète |
| 🟢 | Feature | **Droits de création différenciés** | 🔥 | Phase 1 | ✅ 11 permissions avec requires_role |
| 🟢 | Feature | **Droits de modération** | ⚡ | Phase 1 | ✅ kick_squad_member() function |
| 🟢 | Feature | **Droits de gestion** | ⚡ | Phase 1 | ✅ Permissions edit_squad, delete_squad, manage_roles |
| 🟢 | UI/UX | Badge "Leader" visible | 🔥 | Phase 1 | ✅ View squad_members_with_roles |
| 🟢 | DB | Type enum + permissions table | 🔥 | - | ✅ squad_role + squad_permissions |
| 🟢 | Logic | Fonctions vérification permissions | 🔥 | - | ✅ is_squad_leader, is_squad_admin, user_has_permission |
| 🟢 | Logic | Actions hiérarchiques | 🔥 | - | ✅ promote_squad_member(), kick_squad_member() |
| 🟢 | DB | RLS policies avancées | 🔥 | - | ✅ Policies par rôle (sessions, squads) |
| 🟢 | DB | Migration roles_permissions | 🔥 | - | ✅ 20260129_roles_permissions.sql |

### ✋ Check-in Obligatoire (FEATURE SIGNATURE ✨)

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | **Confirmation obligatoire 1h avant session** | 🔥 | Phase 1 | ✅ CheckInScreen avec countdown |
| 🟢 | Feature | **Bouton "Je suis en route"** | 🔥 | Phase 1 | ✅ Statut 'on_my_way' implémenté |
| 🟢 | Feature | **Transparence totale composition** | 🔥 | Phase 1 | ✅ Real-time check-ins + progress bar |
| 🟢 | UI/UX | Interface check-in élégante | 🔥 | Phase 1 | ✅ CheckInScreen.tsx (4 boutons statuts) |
| 🟢 | Logic | Finalisation auto composition | 🔥 | Phase 1 | ✅ Tracking statuts temps réel |
| 🟢 | DB | Table session_check_ins | 🔥 | - | ✅ 20260129_create_check_ins.sql |
| 🟢 | Feature | Notifications squad sur check-in | 🔥 | - | ✅ Trigger auto notify_check_in_status_change() |

### 🎖️ Badges Comportementaux

**Visibilité publique des scores pour créer une responsabilité sociale positive**

| Statut | Catégorie | Tâche | Priorité | Source PDF | Badge |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | **Leader Fiable** 👑 | 🔥 | Phase 1 | ✅ check_badge_leader_fiable() (95%+, 20+ sessions) |
| 🟢 | Feature | **Pilier de Squad** ⭐ | ⚡ | Phase 1 | ✅ check_badge_pilier_squad() (fondateur 3+ mois) |
| 🟢 | Feature | **Fantôme** 👻 | ⚡ | Phase 1 | ✅ check_badge_fantome() (30%+ no-show) - négatif |
| 🟢 | Feature | **Ponctuel** ⏰ | ⚡ | Phase 1 | ✅ check_badge_ponctuel() (0 retard, 15+ sessions) |
| 🟢 | Feature | **Régulier** 🔥 | ⚡ | Phase 1 | ✅ check_badge_regulier() (8+ semaines consécutives) |
| 🟢 | DB | Tables badges + user_badges | 🔥 | - | ✅ Schemas créés avec seed |
| 🟢 | Logic | Algorithme attribution badges | 🔥 | - | ✅ award_badges_to_user() + fonctions check |
| 🟢 | Logic | Trigger auto après stats update | 🔥 | - | ✅ auto_check_badges_after_reliability_update() |
| 🟢 | Feature | Notifications unlock automatiques | 🔥 | - | ✅ Notification 'badge_unlocked' auto |
| 🟢 | DB | Migration badges_system | 🔥 | - | ✅ 20260129_badges_system.sql |
| 🟢 | UI | ReliabilityBadge component | 🔥 | - | ✅ ReliabilityBadge.tsx (existant) |

---

## 🧠 PHASE 2: INTELLIGENCE SOCIALE & AUTOMATISATION

**Source PDF**: Phase 2 - Intelligence Sociale & Automatisation
**Objectif**: L'intelligence artificielle prend le relais pour optimiser automatiquement l'organisation. Le système apprend des comportements passés pour suggérer les meilleures décisions et anticiper les problèmes avant qu'ils ne surviennent.

### 🤖 Suggestions Automatiques de Créneaux

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | **Analyse des historiques de disponibilité** | 🔥 | Phase 2 | ✅ Heuristiques sur 50 dernières sessions |
| 🟡 | Feature | **Prise en compte des fuseaux horaires multiples** | 🔥 | Phase 2 | Column timezone existe, logic 🟡 |
| 🟢 | Feature | **Détection des patterns hebdomadaires** | 🔥 | Phase 2 | ✅ Analyse jour de semaine + heure |
| 🟢 | Feature | **Proposition horaires haut taux présence probable** | 🔥 | Phase 2 | ✅ getSmartSuggestions() top 5 |
| 🟢 | Utils | Utility smart-suggestions.ts | 🔥 | - | ✅ 420 lignes (9 fonctions) |
| 🟡 | UI/UX | Interface suggestions élégante | 🔥 | Phase 2 | Component créé, manque intégration |

### 📊 Heatmap de Disponibilité

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | **Visualisation meilleurs horaires squad** | 🔥 | Phase 2 | ✅ Grille 7j x 16h (8h-23h) |
| 🟢 | Feature | **Identification fenêtres optimales** | 🔥 | Phase 2 | ✅ Color-coding par score |
| 🟢 | Feature | **Détection conflits récurrents** | ⚡ | Phase 2 | ✅ Analyse historique patterns |
| 🟢 | Feature | **Recommandations basées données réelles** | 🔥 | Phase 2 | ✅ Score = avgAttendance normalized |
| 🟢 | UI/UX | Component heatmap visuel | 🔥 | Phase 2 | ✅ AvailabilityHeatmap.tsx (180 lignes) |
| 🟢 | Feature | Légende + détails au clic | 🔥 | - | ✅ Selected slot avec stats complètes |

### 💗 Score de Cohésion d'Équipe

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **Indice régularité des sessions** | 🔥 | Phase 2 | Frequency metric |
| 🔴 | Feature | **Stabilité des membres** | 🔥 | Phase 2 | Churn rate |
| 🔴 | Feature | **Taux de présence moyen** | 🔥 | Phase 2 | Average attendance |
| 🔴 | Feature | **Durée de vie de la squad** | ⚡ | Phase 2 | Age calculation |
| 🔴 | Feature | **Prédiction du risque de dissolution** | ⚡ | Phase 2 | ML predictive |
| 🔴 | UI/UX | Affichage score cohésion | 🔥 | Phase 2 | Dashboard widget |

### 🔍 Détection des Patterns + Auto-Coaching

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🟢 | Feature | **Analyse heures qui "marchent vraiment"** | 🔥 | Phase 2 | ✅ analyzeBestTiming() |
| 🟢 | Feature | **Identification créneaux récurrents à succès** | 🔥 | Phase 2 | ✅ Pattern detection hebdomadaire |
| 🟢 | Feature | **Suggestion de ritualisation sessions efficaces** | ⚡ | Phase 2 | ✅ Insight "timing_optimal" |
| 🟢 | Feature | **5 Insights Squad automatiques** | 🔥 | - | ✅ Attendance/Frequency/Timing/Members/Trend |
| 🟢 | Feature | **Insights Utilisateur individuels** | 🔥 | - | ✅ generateUserInsights() |
| 🟢 | Utils | auto-coaching.ts | 🔥 | - | ✅ 300 lignes (7 fonctions) |
| 🟢 | Feature | Priority system (high/medium/low) | ⚡ | - | ✅ Tri automatique par priorité |
| 🟢 | Feature | 4 types insights (warning/tip/success/info) | ⚡ | - | ✅ Catégorisation complète |

### 🔮 Prédiction de No-Show

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **Algorithme prédictif historique individuel** | ⚡ | Phase 2 | ML model |
| 🔴 | Feature | **Analyse délais de réponse** | ⚡ | Phase 2 | RSVP speed |
| 🔴 | Feature | **Patterns comportementaux** | ⚡ | Phase 2 | Behavior analysis |
| 🔴 | Feature | **Anticipation des absences** | ⚡ | Phase 2 | Predictive alert |

### 💡 Recommandations Stratégiques

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **Suggestion changement d'horaire** | ⚡ | Phase 2 | Time optimization |
| 🔴 | Feature | **Suggestion jour fixe hebdomadaire** | ⚡ | Phase 2 | Ritual creation |
| 🔴 | Feature | **Suggestion remplacement de membre** | 💡 | Phase 2 | Performance-based |
| 🔴 | Feature | **Suggestion split/merge de squads** | 💡 | Phase 2 | Squad optimization |

---

## 🔗 PHASE 3: INTÉGRATION DISCORD NATIVE

**Source PDF**: Phase 3 - Intégration Discord Native
**Objectif**: Atteindre une friction zéro en intégrant Squad Planner directement dans l'écosystème Discord où les joueurs passent déjà leur temps. Le bot devient le pont transparent entre planification et exécution.

**Impact attendu**:
- ✅ Réduction de **90% du temps passé à organiser manuellement**
- ✅ Les joueurs n'ont plus besoin de **quitter Discord pour s'organiser**

### 🤖 Bot Discord Officiel

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **Bot puissant extension native** | 🔥 | Phase 3 | Discord.js/py |
| 🔴 | Feature | **Commandes slash intuitives** | 🔥 | Phase 3 | Slash commands |
| 🔴 | Feature | **/session** - Créer une session | 🔥 | Phase 3 | Command impl |
| 🔴 | Feature | **/rsvp** - Confirmer présence | 🔥 | Phase 3 | Command impl |
| 🔴 | Feature | **/retard** - Signaler un retard | ⚡ | Phase 3 | Command impl |
| 🔴 | Feature | **/stats** - Voir statistiques | ⚡ | Phase 3 | Command impl |
| 🔴 | Feature | **Création automatique events Discord synchronisés** | 🔥 | Phase 3 | Discord Events API |
| 🔴 | Feature | **Embeds riches auto-générés dans channels** | 🔥 | Phase 3 | Rich embeds |
| 🔴 | Feature | **Rappels vocaux push dans salons vocaux** | ⚡ | Phase 3 | Voice integration |
| 🔴 | Feature | **Bouton "Rejoindre le vocal" cliquable** | 🔥 | Phase 3 | Deep link Discord |
| 🔴 | Feature | **Notifications de statut en temps réel** | 🔥 | Phase 3 | Realtime sync |
| 🔴 | Feature | **Ping automatique des retardataires** | ⚡ | Phase 3 | Auto-ping logic |
| ⏳ | UI/UX | Écran config bot Discord | ⚡ | Phase 3 | DiscordBotScreen.tsx |

### 📆 Synchronisation Calendriers Externes

**Intégration bidirectionnelle avec outils de productivité standards**

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **Google Calendar: Export auto sessions confirmées** | ⚡ | Phase 3 | .ics generation |
| 🔴 | Feature | **Apple Calendar: Synchronisation iCal native** | 💡 | Phase 3 | iCal format |
| 🔴 | Feature | **Outlook: Intégration entreprise** | 💡 | Phase 3 | Outlook API |
| 🔴 | Feature | **Webhooks: API ouverte intégrations tierces** | ⚡ | Phase 3 | Webhook system |
| ⏳ | UI/UX | Écran sync calendrier | ⚡ | Phase 3 | CalendarSyncScreen.tsx |

### 🎙️ Automatisation Vocale

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **Ouverture auto salon vocal au moment T** | 🔥 | Phase 3 | Bot voice logic |
| 🔴 | Feature | **Ping tous participants confirmés** | 🔥 | Phase 3 | Auto-ping system |
| 🔴 | Feature | **Timer de présence** | ⚡ | Phase 3 | Presence tracking |
| 🔴 | Feature | **Rappels progressifs retardataires** | ⚡ | Phase 3 | Escalation system |

---

## 💰 PHASE 4: MONÉTISATION & BUSINESS MODEL

**Source PDF**: Phase 4 - Monétisation & Business Model
**Objectif**: Une stratégie freemium équilibrée qui offre une valeur gratuite solide tout en proposant des fonctionnalités premium pour les utilisateurs les plus engagés et les organisations professionnelles.

**Modèle économique**:
> Les utilisateurs gratuits découvrent l'utilité, les power users paient pour l'optimisation, et les organisations professionnelles investissent pour la performance collective.

### 🎁 Freemium – Gratuit

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **1 squad active** (limitation) | 🔥 | Phase 4 | Feature gating |
| 🔴 | Feature | **Planning basique illimité** | 🔥 | Phase 4 | Unlimited sessions |
| 🔴 | Feature | **Historique 30 derniers jours** | 🔥 | Phase 4 | Time-based limit |
| 🔴 | Feature | **Notifications essentielles** | 🔥 | Phase 4 | Basic notifs only |
| 🔴 | Feature | **Bot Discord de base** | ⚡ | Phase 4 | Limited bot features |
| 🔴 | Feature | **Stats de fiabilité simples** | 🔥 | Phase 4 | Basic score only |

### ⭐ Premium Individuel – 5-10€/mois

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **Squads illimitées** | 🔥 | Phase 4 | Remove squad limit |
| 🔴 | Feature | **Historique complet longue durée** | 🔥 | Phase 4 | Unlimited history |
| 🔴 | Feature | **Stats avancées et analytics** | 🔥 | Phase 4 | Premium dashboards |
| 🔴 | Feature | **Rappels intelligents personnalisés** | ⚡ | Phase 4 | Smart reminders |
| 🔴 | Feature | **Export calendrier multi-plateforme** | ⚡ | Phase 4 | .ics/.cal export |
| 🔴 | Feature | **Heatmap et suggestions IA** | 🔥 | Phase 4 | AI features |
| 🔴 | Feature | **Badges exclusifs** | ⚡ | Phase 4 | Premium badges |
| 🔴 | Feature | **Support prioritaire** | 💡 | Phase 4 | Priority support |
| ⏳ | Feature | **Intégration Stripe** | 🔥 | Phase 4 | PremiumScreen.tsx exists |
| 🔴 | Feature | **Flow subscription complet** | 🔥 | Phase 4 | Checkout + webhooks |
| 🔴 | UI/UX | **Paywall élégant (non intrusif)** | 🔥 | Phase 4 | Upgrade prompts |

### 🏢 B2B / Organisations – Sur devis

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **Équipes esport amateur et semi-pro** | ⚡ | Phase 4 | Org mode |
| 🔴 | Feature | **Académies et structures de formation** | ⚡ | Phase 4 | Training features |
| 🔴 | Feature | **Coaching tools: lineups, rôles, drafts** | ⚡ | Phase 4 | Coach dashboard |
| 🔴 | Feature | **Streamers et créateurs de contenu** | 💡 | Phase 4 | Streamer mode |
| 🔴 | Feature | **Serveurs communautaires (1000+ membres)** | 💡 | Phase 4 | Community scale |
| 🔴 | Feature | **Multi-squads avec hiérarchie** | ⚡ | Phase 4 | Org structure |
| 🔴 | Feature | **Tableaux de bord managers** | ⚡ | Phase 4 | Manager view |
| 🔴 | Feature | **API privée et webhooks avancés** | ⚡ | Phase 4 | Enterprise API |
| 🔴 | Feature | **White-label possible** | 💡 | Phase 4 | Branding custom |
| ⏳ | UI/UX | Écrans B2B partiels | ⚡ | Phase 4 | Various screens exist |

---

## 🚀 PHASE 5: ÉCOSYSTÈME & INFRASTRUCTURE STANDARD

**Source PDF**: Phase 5 - Écosystème & Infrastructure Standard
**Objectif**: Squad Planner devient l'infrastructure de coordination sociale du gaming, comparable à Notion pour la connaissance ou Slack pour la communication. Devenir le standard incontournable.

### 🔌 API Publique & Intégrations

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **API REST complète** | 🔥 | Phase 5 | Endpoints all features |
| 🔴 | Feature | **SDK multi-langages** (JS, Python, C#, Java) | ⚡ | Phase 5 | SDK development |
| 🔴 | Feature | **Plugins officiels** (Discord, Twitch, Steam, Battle.net) | ⚡ | Phase 5 | Integration plugins |
| 🔴 | Feature | **Webhooks avancés** | ⚡ | Phase 5 | Webhook system |
| 🔴 | Feature | **OAuth Provider** "Se connecter avec Squad Planner" | 💡 | Phase 5 | OAuth server |
| 🔴 | Feature | **Marketplace plugins communautaires** | 💡 | Phase 5 | Plugin ecosystem |
| ⏳ | UI/UX | **API Docs screen** | ⚡ | Phase 5 | ApiDocsScreen.tsx exists |

### 🤖 Intelligence Artificielle Avancée

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **Prédiction de no-show** (anticipation comportementale) | ⚡ | Phase 5 | ML model |
| 🔴 | Feature | **Composition optimale** (suggestion team building) | ⚡ | Phase 5 | AI team builder |
| 🔴 | Feature | **Détection de leaders naturels** | 💡 | Phase 5 | Leadership analysis |
| 🔴 | Feature | **Recommandation de split/merge** (optimisation squads) | 💡 | Phase 5 | Squad optimizer |
| 🔴 | Feature | **Coaching automatisé** (suggestions d'amélioration) | 💡 | Phase 5 | Auto-coach |
| ⏳ | UI/UX | Écran Intelligence | ⚡ | Phase 5 | IntelligenceScreen.tsx |

### 🌐 Mode Communauté

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **Multi-squads** (gestion équipes interconnectées) | ⚡ | Phase 5 | Org structure |
| 🔴 | Feature | **Ligues internes** (compétitions auto-organisées) | ⚡ | Phase 5 | League system |
| 🔴 | Feature | **Saisons** (cycles jeu structurés avec stats) | ⚡ | Phase 5 | Season tracking |
| 🔴 | Feature | **Historique long terme** (archives complètes) | ⚡ | Phase 5 | Archive system |
| 🔴 | Feature | **Classements globaux** (leaderboards fiabilité) | ⚡ | Phase 5 | Global rankings |
| 🔴 | Feature | **Événements communautaires** (tournois et rencontres) | 💡 | Phase 5 | Community events |
| ⏳ | UI/UX | Écrans partiels | ⚡ | Phase 5 | Various screens exist |

### 🏢 Mode B2B Professionnel

| Statut | Catégorie | Tâche | Priorité | Source PDF | Notes |
|--------|-----------|-------|----------|------------|-------|
| 🔴 | Feature | **Dashboard managers** (vue multi-équipes) | ⚡ | Phase 5 | Manager view |
| 🔴 | Feature | **Équipes esport** (gestion rosters professionnels) | ⚡ | Phase 5 | Roster management |
| 🔴 | Feature | **Académies** (formation et progression trackée) | 💡 | Phase 5 | Training system |
| 🔴 | Feature | **Streamers** (organisation sessions publiques) | 💡 | Phase 5 | Public sessions |
| 🔴 | Feature | **Analytics avancées** (Business Intelligence) | ⚡ | Phase 5 | BI dashboard |
| 🔴 | Feature | **Intégrations entreprise** (SSO, SAML, Active Directory) | 💡 | Phase 5 | Enterprise auth |

---

## 🎨 UX: ARCHITECTURE DES 6 ÉCRANS CLÉS

**Source PDF**: UX - Architecture des Écrans Clés
**Principe**: "L'expérience utilisateur repose sur une navigation intuitive centrée autour de la Page Squad, qui agit comme hub central de toute l'activité. Chaque écran a un objectif unique et clair."

### 1️⃣ Home / Accueil (Point d'entrée)

**Requis PDF:**
- CTA principal: "Planifier une session"
- Affichage prochaine session avec **countdown**
- Statut squad: **complet / manque X joueurs**
- CTA secondaire: "Créer une squad"
- **PAS de feed inutile: focus sur l'action**

| Statut | Catégorie | Tâche | Priorité | Fichier |
|--------|-----------|-------|----------|---------|
| ⏳ | UI/UX | Audit écran conforme PDF | 🔥 | HomeScreen.tsx |
| 🔴 | UI/UX | Countdown prochaine session | 🔥 | Widget countdown |
| 🔴 | Feature | Statut squad dynamique | 🔥 | "4/5 joueurs confirmés" |
| 🔴 | UI/UX | CTAs clairs et visuels | 🔥 | Primary/secondary buttons |

### 2️⃣ Page Squad (ÉCRAN CENTRAL - Hub)

**Requis PDF (structure précise):**
- **Header**: Nom, jeu, membres actifs
- **Bloc "Prochaine Session"**: Date/heure, participants confirmés, boutons RSVP
- **Bloc "Proposer une Session"**: Calendrier, heure, durée, validation
- **Bloc Membres**: Avatars, **scores fiabilité**
- **Bloc Historique**: Sessions passées
- **Chat**: Communication contextuelle

| Statut | Catégorie | Tâche | Priorité | Fichier |
|--------|-----------|-------|----------|---------|
| ⏳ | UI/UX | Audit structure conforme PDF | 🔥 | SquadDetailScreen.tsx |
| 🔴 | UI/UX | Bloc "Prochaine Session" avec RSVP | 🔥 | Next session widget |
| 🔴 | UI/UX | Bloc "Proposer Session" inline | 🔥 | Quick create form |
| 🔴 | UI/UX | Scores fiabilité sur membres | 🔥 | Member cards |
| ⏳ | UI/UX | Bloc historique intégré | ⚡ | History widget |
| ⏳ | UI/UX | Chat contextuel | 🔥 | Chat integration |

### 3️⃣ Création de Session

**Requis PDF (UX spécifique):**
- Sélecteur date: **calendrier visuel**
- Sélecteur heure: **2 colonnes optimisées** (heure | minute)
- Durée estimée: **sélection rapide** (1h, 2h, 3h, custom)
- Jeu: **dropdown avec favoris**
- Commentaire: détails optionnels
- Bouton "Proposer" avec **auto-notification**

| Statut | Catégorie | Tâche | Priorité | Fichier |
|--------|-----------|-------|----------|---------|
| ⏳ | UI/UX | Audit écran | 🔥 | ProposeSessionScreen.tsx |
| 🔴 | UI/UX | **Sélecteur heure 2 colonnes** | 🔥 | **Design PDF spécifique** |
| 🔴 | UI/UX | Durée: boutons rapides | ⚡ | Quick duration select |
| 🔴 | UI/UX | Jeu: favoris en haut | ⚡ | Game dropdown |
| 🔴 | Feature | Auto-notification lors création | 🔥 | Notif trigger |

### 4️⃣ RSVP & Confirmations

**Requis PDF:**
- Cards membres avec photo
- Statuts visuels: **✅ Confirmé, ⏳ En attente, ❌ Indisponible**
- Boutons d'action rapides
- **Jauge de complétion visuelle** (3/5 confirmés)

| Statut | Catégorie | Tâche | Priorité | Notes |
|--------|-----------|-------|----------|-------|
| 🔴 | UI/UX | **Écran RSVP dédié** | 🔥 | **Manquant entièrement** |
| 🔴 | UI/UX | Cards membres avec statuts visuels | 🔥 | ✅⏳❌ icons |
| 🔴 | UI/UX | Boutons action rapides | 🔥 | Quick RSVP |
| 🔴 | UI/UX | Jauge complétion | 🔥 | Progress bar |

### 5️⃣ Profil Joueur

**Requis PDF:**
- **Score de fiabilité avec graphique**
- Historique complet des sessions
- **Badges et achievements**
- Rôle dans les squads
- **Fuseau horaire et disponibilités**
- **Stats détaillées (heures jouées, streaks)**

| Statut | Catégorie | Tâche | Priorité | Fichier |
|--------|-----------|-------|----------|---------|
| ⏳ | UI/UX | Audit écran | 🔥 | ProfileScreen.tsx |
| 🔴 | UI/UX | **Graphique fiabilité** | 🔥 | Chart visualization |
| 🔴 | UI/UX | Badges visibles | 🔥 | Badge gallery |
| 🔴 | Feature | Stats détaillées | ⚡ | Hours, streaks, etc |
| 🔴 | Feature | Fuseau horaire | ⚡ | Timezone display |

### 6️⃣ Heatmap & Analytics

**Requis PDF:**
- Visualisation des meilleurs horaires
- Patterns de disponibilité
- Suggestions de créneaux optimaux
- Score de cohésion d'équipe
- Prédictions comportementales

| Statut | Catégorie | Tâche | Priorité | Fichier |
|--------|-----------|-------|----------|---------|
| ⏳ | UI/UX | Audit écran | 🔥 | AvailabilityHeatmapScreen.tsx |
| 🔴 | Feature | Data source connectée | 🔥 | RSVP aggregation |
| 🔴 | UI/UX | Visualisation 7j x 24h | 🔥 | Heatmap grid |
| 🔴 | Feature | Suggestions AI | 🔥 | Top 3 slots |
| 🔴 | Feature | Score cohésion | ⚡ | Team health metric |

---

## 🚨 TOP 10 GAPS CRITIQUES

**Basé sur PDF Checklist + Audit en cours**

### 🔥 NIVEAU 1 - Bloquant MVP (Phase 0)

| Rang | Gap | Impact | Phase | Effort |
|------|-----|--------|-------|--------|
| 1 | **Système RSVP complet** (✅/❌/❓) | 100% | Phase 0 | 3-5j |
| 2 | **Invitation par lien unique** | 90% | Phase 0 | 1-2j |
| 3 | **Notifications auto** (J-1, H-1, 10min) | 85% | Phase 0 | 2-3j |

### 🔥 NIVEAU 2 - Bloquant Engagement (Phase 1)

| Rang | Gap | Impact | Phase | Effort |
|------|-----|--------|-------|--------|
| 4 | **Score fiabilité + algorithme** | 80% | Phase 1 | 3-4j |
| 5 | **Système rôles** (Leader/Co-leader/Membre) | 70% | Phase 1 | 2-3j |
| 6 | **Check-in 1h avant + "En route"** | 75% | Phase 1 | 2-3j |

### 🔥 NIVEAU 3 - Différenciation (Phases 2-3)

| Rang | Gap | Impact | Phase | Effort |
|------|-----|--------|-------|--------|
| 7 | **Badges comportementaux** | 65% | Phase 1 | 3-4j |
| 8 | **Heatmap avec data réelle** | 60% | Phase 2 | 4-5j |
| 9 | **Bot Discord slash commands** | 70% | Phase 3 | 5-7j |
| 10 | **Historique + tracking présence** | 60% | Phase 1 | 2-3j |

---

## 📊 MÉTRIQUES DE SUCCÈS GLOBALES

### Product-Market Fit (MVP)
- ✅ Squads planifient **≥2 sessions/semaine**
- ✅ Taux de présence **>80%** (vs chaos Discord)
- ✅ Rétention J7 **>40%**
- ✅ Utilisateurs ouvrent app **avant chaque session**

### Quality Standards (Elite)
- ✅ **0 bugs critiques** en production
- ✅ Lighthouse Performance **>90**
- ✅ Lighthouse Accessibility **>90**
- ✅ Bundle size **<200KB gzipped**
- ✅ First Contentful Paint **<1.5s**
- ✅ Time to Interactive **<3s**
- ✅ Core Web Vitals **tous verts**

### UI/UX Standards (Linear/Stripe)
- ✅ Design cohérent **100% screens**
- ✅ Animations fluides **(60fps)**
- ✅ Feedback visuel **immédiat (<100ms)**
- ✅ Pas de layout shift **(CLS <0.1)**
- ✅ Responsive parfait **mobile/tablet/desktop**
- ✅ Dark mode **natif parfait**

---

## 📈 PROGRESSION GLOBALE

**Mise à jour**: Après audit agent (en attente)

| Phase | Tâches | Complété | En Cours | À Faire | % |
|-------|--------|----------|----------|---------|---|
| Phase 0 - MVP | ~40 | ⏳ | ⏳ | ⏳ | ⏳ |
| Phase 1 - Engagement | ~35 | ⏳ | ⏳ | ⏳ | ⏳ |
| Phase 2 - Intelligence | ~25 | ⏳ | ⏳ | ⏳ | ⏳ |
| Phase 3 - Discord | ~30 | ⏳ | ⏳ | ⏳ | ⏳ |
| Phase 4 - Monétisation | ~25 | ⏳ | ⏳ | ⏳ | ⏳ |
| Phase 5 - Écosystème | ~30 | ⏳ | ⏳ | ⏳ | ⏳ |
| **TOTAL** | **~185** | **1** | **⏳** | **⏳** | **⏳** |

**⏳ En attente résultats agent audit pour statuts précis**

---

## 🎯 PLAN D'ACTION SPRINT 1-2-3

### Sprint 1: MVP Core (Semaine 1-2)

**Objectif**: Rendre l'application utilisable avec le strict minimum fonctionnel

1. ✅ **Système RSVP complet** (5j)
   - DB: session_rsvps table
   - API: CRUD operations
   - UI: Boutons ✅❌❓ + statuts
   - Realtime: Supabase subscriptions

2. ✅ **Invitation par lien unique** (2j)
   - Générer code unique
   - Page join/:code
   - Auto-add à squad

3. ✅ **Notifications auto basiques** (3j)
   - Nouvelle session: trigger immediat
   - J-1, H-1, 10min: Vercel Cron
   - Push notifications

### Sprint 2: Engagement (Semaine 3-4)

**Objectif**: Créer la responsabilité sociale

4. ✅ **Score fiabilité v1** (3j)
   - Calcul: présence / total
   - Badge couleur (vert/jaune/rouge)
   - Display sur profil

5. ✅ **Système rôles** (2j)
   - DB: role column
   - Permissions: kick/edit
   - UI: Badge "Leader"

6. ✅ **Historique + tracking** (2j)
   - Page filtrable
   - Check-in tracking
   - Stats basiques

### Sprint 3: Intelligence v1 (Semaine 5-6)

**Objectif**: Apporter de l'automatisation

7. ✅ **Heatmap disponibilité basique** (4j)
   - Agréger RSVP par heure
   - Grille 7j x 24h
   - Top 3 créneaux

8. ✅ **Suggestions créneaux simples** (2j)
   - Algorithme: top ✅ historiques
   - Display suggestions
   - Button "Utiliser"

---

## 🔄 MISE À JOUR & MAINTENANCE

Ce document est **vivant** et sera mis à jour après:
- ✅ Chaque tâche significative complétée
- ✅ Résultats d'audit agent
- ✅ Feedback utilisateur
- ✅ Découverte de bugs
- ✅ Changements de priorité

**Prochaine mise à jour majeure**: Après résultat agent audit code vs Checklist PDF

---

## 📚 RESSOURCES & RÉFÉRENCES

### Documents Source
- ✅ Roadmap 1.pdf - Vision & Positionnement
- ✅ Guide simple et complet.pdf - Fonctionnalités utilisateur
- ✅ **Squad-Planner-Checklist-Complete-de-Developpement.pdf** - **MASTER REFERENCE**
- ⏳ Roadmap 2.pdf (agent en cours)
- ⏳ Roadmap 3.pdf (agent en cours)
- ⏳ Architecture et fonctionnalités.pdf (agent en cours)
- ⏳ Étude concurrentielle.pdf (agent en cours)
- ⏳ Identité Visuelle.pdf (agent en cours)
- ⏳ Projections CA.pdf (agent en cours)

### Fichiers Projet
- [GAP-ANALYSIS.md](GAP-ANALYSIS.md) - Rapport audit complet 10 pages
- [ROADMAP_CLAUDE.md](ROADMAP_CLAUDE.md) - Ce document
- [ABORTERROR-FIX-V2.md](ABORTERROR-FIX-V2.md) - Fix auth récent
- [FULL_DB_SETUP.sql](FULL_DB_SETUP.sql) - Schema DB complet avec RLS

### Agents Actifs
- **Agent a923aaf**: Analyse 7 PDF restants (background)
- **Agent a9a7f5c**: Audit code vs Checklist PDF (background)

---

## 🤖 AGENTS & AUTOMATION

Pour maximiser la vélocité, nous utilisons:

### Agents Disponibles
- **Explore** - Recherche rapide codebase
- **Plan** - Architecture & stratégie
- **General-purpose** - Tâches multi-étapes complexes
- **Bash** - Git, npm, scripts
- **claude-code-guide** - Documentation Claude

### Scripts Automation
- `do-everything-now.cjs` - Setup DB automatique
- `test-auth-*.cjs` - Tests auth automatisés
- `configure-*.cjs` - Config automatique

**Carte blanche**: Tous agents et outils nécessaires peuvent être utilisés pour mener à bien cette roadmap.

---

**🤖 Roadmap Générée et Maintenue par Claude Sonnet 4.5**
**Standard Elite: Linear / Stripe / Apple**
**Version: 2.0 - Enrichie avec PDF Checklist Master**
