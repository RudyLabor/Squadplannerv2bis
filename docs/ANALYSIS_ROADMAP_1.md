# Analyse Complète - Roadmap 1 Squad Planner

**Document source**: Roadmap 1.pdf
**Date d'analyse**: 2026-01-28
**Statut**: Analyse exhaustive de la roadmap produit

---

## Table des matières

1. [Vue d'ensemble du produit](#vue-densemble-du-produit)
2. [Problématique identifiée](#problématique-identifiée)
3. [Positionnement produit](#positionnement-produit)
4. [Core Loop](#core-loop)
5. [Phases de développement](#phases-de-développement)
6. [Stratégie de monétisation](#stratégie-de-monétisation)
7. [Analyse concurrentielle](#analyse-concurrentielle)
8. [KPIs et métriques](#kpis-et-métriques)
9. [Insights stratégiques](#insights-stratégiques)

---

## Vue d'ensemble du produit

### Définition
**Squad Planner** = Le Notion + Doodle + Discord pour joueurs organisés

### Mission
Transformer un groupe Discord chaotique en une équipe qui joue vraiment ensemble.

### Proposition de valeur unique
- **PAS** un réseau social
- **PAS** un LFG (Looking For Group)
- **UN SYSTÈME** d'organisation et de commitment

---

## Problématique identifiée

### Le problème réel (et violent)

**Constat**: L'organisation chez les gamers est un chaos quotidien qui tue les squads avant même qu'elles ne commencent à jouer.

### Points de douleur majeurs

#### 1. Créneaux flous
- Horaires imprécis
- Retards fréquents
- Abandons en série

#### 2. Discord inadapté
- Excellent pour le chat
- Mauvais pour l'engagement
- Déficient en coordination

#### 3. Leaders épuisés
- Capitaines surchargés
- Relances constantes
- Disbandment des squads

### Insight clé
> "Ce n'est PAS un problème de matching. C'est un problème de coordination sociale. Squad Planner attaque exactement ça."

---

## Positionnement produit

### Pilliers stratégiques

#### Organisation sociale
Coordination fluide entre membres

#### Pression douce
Engagement par la transparence

#### Rituel d'équipe
Habitudes qui créent la cohésion

---

## Core Loop

### Cycle produit en 4 étapes

**Description**: Un cycle simple et puissant qui transforme l'intention de jouer en sessions réelles.

#### Étape 1: Création
Création d'une squad et planification d'une session

#### Étape 2: Réponse
Confirmation de disponibilité par les membres

#### Étape 3: Confirmation
Le système confirme, rappelle et finalise la session

#### Étape 4: Exécution
Session exécutée. Suivi de l'historique et de la fiabilité

---

## Phases de développement

### Phase 1: Proof of Value (MVP réel)

**Objectif**: Prouver que les joueurs utilisent l'outil pour s'organiser

#### Fonctionnalités essentielles

##### Authentification
- Auth email
- Discord OAuth

##### Gestion de squad
- Création de squad
- Invitation par lien
- Page Squad avec liste membres et prochaine session

##### Gestion de sessions
- Création de session: Date, Heure, Jeu
- RSVP: Je viens / Je ne viens pas

##### Communication
- Notifications:
  - Nouvelle session
  - Rappel J-1
  - Rappel H-1
- Chat de squad minimal

#### KPI de succès - Phase 1
**Métrique principale**: Des squads qui planifient au moins 2 sessions par semaine

**Validation**: Cette métrique simple valide que l'outil résout un vrai problème et devient un rituel dans la vie des joueurs.

---

### Phase 2: Engagement & Discipline

**Objectif**: Rendre l'outil indispensable en introduisant la responsabilité sociale

#### Fonctionnalités

##### 1. Statut de fiabilité
- Chaque joueur a un profil avec:
  - % de présence
  - % de retard
  - % de no-show
- Visible par tous (transparence sociale)

##### 2. Historique complet
- Toutes les sessions passées archivées
- Participation de chacun enregistrée

##### 3. Rôles & Leadership
- Système de Leader / Co-leader
- Structure la gouvernance de la squad

##### 4. Check-in obligatoire
- Confirmation 1h avant la session
- Bouton "Je suis en route" pour engagement final

#### KPI de succès - Phase 2
**Métrique principale**: Les joueurs ouvrent l'app avant chaque session

**Validation**: L'outil devient le point de passage obligé

---

### Phase 3: Intelligence sociale

**Objectif**: Automatiser l'organisation grâce aux données comportementales

#### Fonctionnalités

##### Suggestions automatiques
- Propositions de créneaux basées sur l'historique
- Prise en compte des fuseaux horaires
- Analyse des disponibilités passées de chaque membre

##### Heatmap des horaires
- Visualisation des meilleurs moments
- Affichage: toute la squad disponible
- Vue semaine par semaine

##### Score de cohésion
- Métrique d'équipe collective
- Mesure la régularité et la ponctualité
- Évalue l'engagement global

#### Vision stratégique - Phase 3
> "À ce stade, Squad Planner va au-delà de la simple organisation : il anticipe et optimise. L'outil devient un coach invisible qui comprend les dynamiques de l'équipe."

---

### Phase 4: Intégration Discord native

**Objectif**: Friction zéro. Les joueurs n'ont plus à quitter Discord.

#### Bot Discord officiel

##### Commandes slash intégrées
- `/session` — Créer une session
- `/rsvp` — Confirmer présence
- `/retard` — Signaler un retard

#### Expérience fluide

##### Fonctionnalités d'intégration
- Embeds automatiques dans les channels de la squad
- Rappels vocaux push quand la session approche
- Bouton "Rejoindre le vocal" directement depuis la notification

#### Vision stratégique - Phase 4
> "Le bot devient le pont entre l'organisation (Squad Planner) et la communication (Discord). Plus besoin de jongler entre applications."

---

## Stratégie de monétisation

### Modèle Freemium

#### Offre gratuite
- 1 squad
- Planning basique

#### Premium (5-10€/mois)
- Historique étendu
- Statistiques avancées
- Rappels intelligents
- Export calendrier
- Outils de coaching (lineups, rôles, drafts)

### Modèle B2B

#### Cibles
- Équipes e-sport amateur
- Coachs
- Serveurs communautaires

#### Fonctionnalités
- Gestion avancée
- Analytics approfondies

### Philosophie de monétisation
> "Le modèle freemium vise une adoption massive, tout en monétisant les utilisateurs intensifs et les organisations. La proposition de valeur est claire : plus l'organisation est sophistiquée, plus les fonctionnalités premium deviennent indispensables."

---

## Analyse concurrentielle

### Positionnement unique
Squad Planner occupe un espace unique, se positionnant à l'intersection de l'organisation sociale et de la culture gaming.

### Tableau comparatif

| Concurrent | Leur force | Leur faiblesse |
|------------|-----------|----------------|
| **Discord** | Chat en temps réel | Pas d'organisation |
| **Doodle** | Sondages de dates | Pas social |
| **Google Calendar** | Calendrier universel | Pas communautaire |
| **Guilded** | Fonctionnalités riches | Trop complexe |
| **TeamSnap** | Organisation sportive | Pas gamer |

### Positionnement stratégique vs SquadMatch
> "SquadMatch était sexy. Squad Planner est utile. Et l'utile gagne toujours sur le sexy. Le matching est un luxe. L'organisation est une douleur. Tu passes d'un produit 'cool' à un produit nécessaire."

---

## KPIs et métriques

### Récapitulatif des KPIs par phase

#### Phase 1: Proof of Value
**KPI principal**: Squads qui planifient au moins 2 sessions par semaine
**Objectif**: Validation du besoin réel
**Métrique de succès**: L'outil résout un vrai problème et devient un rituel

#### Phase 2: Engagement & Discipline
**KPI principal**: Les joueurs ouvrent l'app avant chaque session
**Objectif**: Point de passage obligé
**Métrique de succès**: L'outil devient indispensable

#### Phase 3: Intelligence sociale
**KPI implicite**: Adoption des suggestions automatiques
**Objectif**: Automatisation de l'organisation
**Métrique de succès**: Réduction de la charge mentale des leaders

#### Phase 4: Intégration Discord
**KPI implicite**: Taux d'utilisation des commandes bot
**Objectif**: Friction zéro
**Métrique de succès**: Les joueurs n'ont plus à quitter Discord

---

## Insights stratégiques

### 1. Pivot fondamental
**De**: SquadMatch (matching, sexy)
**Vers**: Squad Planner (organisation, utile)
**Raison**: L'utile gagne sur le sexy

### 2. Problème ciblé
**Pas un problème de matching** → Problème de coordination sociale

### 3. Différenciation claire
- Pas un réseau social
- Pas un LFG
- Un système d'organisation et de commitment

### 4. Stratégie de rétention
- Phase 1: Adoption (rituel hebdomadaire)
- Phase 2: Engagement (responsabilité sociale)
- Phase 3: Optimisation (coach invisible)
- Phase 4: Intégration (friction zéro)

### 5. Leviers psychologiques
- **Transparence**: Statuts de fiabilité visibles
- **Pression douce**: Engagement par la visibilité
- **Rituel**: Habitudes qui créent la cohésion
- **Automatisation**: Coach invisible

### 6. Modèle économique
- Freemium pour adoption massive
- Premium pour utilisateurs intensifs
- B2B pour structures organisées
- Proposition de valeur claire: sophistication = valeur premium

---

## Priorités de développement

### Séquence recommandée

1. **MVP (Phase 1)**: Valider le besoin
2. **Engagement (Phase 2)**: Créer l'addiction
3. **Intelligence (Phase 3)**: Automatiser
4. **Intégration (Phase 4)**: Éliminer la friction

### Validation progressive
Chaque phase possède son propre KPI de validation avant de passer à la suivante.

---

## Détails techniques identifiés

### Stack d'authentification
- Email classique
- Discord OAuth (intégration native)

### Fonctionnalités de notification
- Nouvelle session créée
- Rappel J-1 (24h avant)
- Rappel H-1 (1h avant)
- Rappels vocaux push (Phase 4)

### Intégration Discord
- Commandes slash natives
- Embeds automatiques
- Boutons interactifs
- Notifications push vers vocal

### Système de données
- Historique de sessions
- Tracking de participation
- Métriques de fiabilité (présence, retard, no-show)
- Analyse des disponibilités passées
- Fuseaux horaires

---

## Points d'attention business

### Risques identifiés
1. **Dépendance Discord**: L'intégration native peut être un risque si Discord change sa politique
2. **Monétisation tardive**: Le freemium nécessite une masse critique
3. **Complexité progressive**: Chaque phase ajoute de la complexité

### Opportunités
1. **Marché inexploité**: Aucun concurrent direct sur ce positionnement exact
2. **Effet réseau**: Les squads invitent d'autres squads
3. **B2B potentiel**: Marché e-sport amateur en croissance
4. **Export calendrier**: Intégration avec écosystème existant

---

## Conclusion

Squad Planner présente une roadmap produit claire et progressive, axée sur la résolution d'un problème réel (coordination sociale des gamers) plutôt que sur une fonctionnalité "sexy" (matching).

### Forces de cette roadmap
- Problème clairement identifié et validé
- Progression logique des phases
- KPIs simples et mesurables
- Différenciation claire vs concurrence
- Modèle économique cohérent

### Prochaines étapes recommandées
1. Développer et lancer le MVP (Phase 1)
2. Mesurer le KPI: 2 sessions/semaine minimum
3. Itérer selon les retours utilisateurs
4. Progresser vers Phase 2 seulement si KPI Phase 1 validé

---

**Document créé le**: 2026-01-28
**Source**: C:\Users\RudyL\Documents\Maquette figma\Présentation SquadPlanner\Roadmap 1.pdf
**Analysé par**: Claude Sonnet 4.5
