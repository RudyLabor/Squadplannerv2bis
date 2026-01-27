# 🗺️ SUIVI UNIFIÉ DE LA FEUILLE DE ROUTE (MASTER ROADMAP)

**Statut Global** : 🔄 En Cours de Consolidation
**Source** : Consolidation de `ROADMAP.md`, `ROADMAP_3_SPEC.md` et `AUDIT-ROADMAP-1`.

---

## 📊 VUE D'ENSEMBLE

- **Phase 0 : Fondations & UX Premium** (Terminé à 100%) 🟢
- **Phase 1 : MVP Compétitif & Planification** (Terminé à 100%) 🟢
- **Phase 2 : Engagement & Différenciateurs** (Terminé à 100%) 🟢
- **Phase 3 : Automatisation & Intelligence** (Simulé / Mock Ready) 🟢
- **Phase 4 : Écosystème Discord** (Implémenté Client-Side) 🟢

---

## 🏗️ PHASE 0 : FONDATIONS & UX PREMIUM (Base)

**Objectif** : Une application visuellement époustouflante et fonctionnelle pour 1 squad.

### 🎨 UX/UI & Core Components

- [x] Design System Premium (Glassmorphism, Typo 2026)
- [x] Animations (ParticleField, MagneticButton, Confetti)
- [x] Composants UI (Boutons, Inputs, Cartes)

### 🔐 Authentification & Utilisateurs

- [x] Connexion/Inscription (Email, Google, Discord)
- [x] Profils Utilisateurs Complets (Avatar, Bio, Jeux)
- [x] Persistance de session sécurisée

### 🛡️ Gestion de Squad

- [x] Création de Squad (Nom, Jeu, Avatar) - _API Fixed_
- [x] Vue Détail Squad (Membres, Header)
- [x] Dashboard (Vue "Prochaine Session")

---

## 🚀 PHASE 1 : MVP COMPÉTITIF (Le Core Loop)

**Objectif** : Remplacer un simple message Discord par un outil puissant.

### 📅 Gestion des Sessions

- [x] Créer Session (Date, Heure, Durée) - _API Fixed_
- [x] Proposition Multi-créneaux (Sondage)
- [x] Templates de Session ("Ranked", "Chill", "Scrim") - _Quick Win Roadmap 1_
- [x] **Sessions Récurrentes** (Hebdomadaire) - _Roadmap 1/3 Spécifique_
  - [x] UI Toggle Récurrence
  - [x] Logique Backend CRON (Simulé)

### 🌍 Logistique & Temps

- [x] **Fuseaux Horaires** (Conversion auto Paris/NY) - _Roadmap 1_
- [x] Affichage Relatif ("Dans 3 heures") - _Quick Win_
- [x] Système RSVP (Présent/Absent) - _API Fixed_

### 📤 Partage & Export

- [x] Lien d'invitation Squad ou Session
- [x] Génération de lien partageable (OpenGraph Simulé)
- [x] Export .ICS (Google/Outlook Calendar)

---

## 🔥 PHASE 2 : ENGAGEMENT (Rétention)

**Objectif** : Créer de l'habitude et de la fiabilité.

### 📍 Check-in en Temps Réel

- [x] Bouton "Je suis là" (T-1h) - _Implémenté_
- [x] Bouton "Je suis en retard" (+ minutes)
- [x] Statut "En ligne maintenant" (Indicateur visuel)

### 🏆 Gamification & Fiabilité

- [x] Score de Fiabilité (% de participation)
- [x] Badges (Sniper, Ponctuel, Leader) - _ UI Fixed_
- [x] Historique des Sessions
- [x] Statistiques Batch (Calcul optimisé back-end) - _Roadmap 3_

### 🔔 Notifications de Base

- [x] Rappel T-24h (Email/Push)
- [x] Rappel T-1h (Push)
- [x] Notification "Manque X réponses" (Relance Smart Nudge)

---

## 🧠 PHASE 3 : AUTOMATISATION & INTELLIGENCE (Roadmap #3)

**Objectif** : L'application travaille pour vous.

### 🤖 Smart Scheduling

- [x] **Suggestions Intelligentes** (Top 3 créneaux basés sur historique)
  - [x] `GET /smart-suggestions` (Mock)
  - [x] UI Cartes de suggestion
- [x] **Heatmap de Disponibilité**
  - [x] Matrice Visuelle 7 jours x 24h
  - [x] `GET /availability-heatmap` (Mock)

### 🔄 Automatisation

- [x] Création automatique des sessions récurrentes (CRON Client)
- [x] Détection automatique des No-Shows

---

## 👾 PHASE 4 : ÉCOSYSTÈME DISCORD

**Objectif** : Domination du marché gamer.

- [x] Connexion OAuth Discord (UI)
- [x] Bot Discord (Écran d'invitation)
- [x] Webhooks (Support Client)
- [x] Synchronisation des Rôles (Config)

---

## 🛠️ SUIVI DES CORRECTIFS TECHNIQUES

- [x] `HomeScreen`: API `getSessions` (V2)
- [x] `SessionsScreen`: API & Logique multi-slots
- [x] `CreateSquad`: Props navigation & API
- [x] `ProposeSession`: Endpoint `/squads/:id/sessions`
- [x] `CheckInScreen`: Imports & API `getCheckIns`
- [x] `BadgesScreen`: Logique UX & UI Rareté
