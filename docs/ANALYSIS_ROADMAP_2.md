# ANALYSIS ROADMAP 2 - Squad Planner

**Document source**: Roadmap 2.pdf
**Date d'analyse**: 2026-01-28
**Pages analysées**: 10 pages

---

## VISION FINALE

### Positionnement Produit

Squad Planner n'est **pas** une application de "gaming social". C'est un **outil de coordination et d'engagement réel** qui résout un problème concret : transformer une intention vague ("on joue un jour") en un engagement concret ("on joue mardi 21h et tout le monde est là").

### Problème Identifié

Les joueurs ont des amis, Discord et des jeux, mais ne jouent pas ensemble régulièrement. Les problèmes clés identifiés :
- Personne ne tranche une date
- Tout le monde dit "on verra"
- Les absences non annoncées détruisent la motivation

### Solution Proposée

Un outil qui crée du **commitment réel**. Principe fondamental : si Squad Planner ne fait pas mieux que Discord + Google Calendar pour transformer l'intention en action, **il est mort**.

### Objectif Principal

Créer une habitude de jeu durable en :
- Éliminant les frictions de coordination
- Mesurant la fiabilité sociale de chaque membre

---

## CONCEPT CORE

**Formule**: Squad Planner = Planning + Engagement + Fiabilité sociale

**Philosophie**: Pas de matching, pas de feed, pas de bullshit social. Seulement l'essentiel pour créer une habitude de jeu.

### Les 6 Piliers Fondamentaux

1. **Créer une équipe**
   - Rassembler les joueurs dans une squad dédiée avec des règles claires

2. **Proposer des créneaux**
   - Suggérer des dates et heures concrètes pour jouer ensemble

3. **Forcer un choix**
   - Obtenir un engagement clair : présent, absent, ou peut-être (pénalisé)

4. **Mesurer la fiabilité**
   - Tracker qui respecte ses engagements et qui fait défaut

5. **Rappeler automatiquement**
   - Notifications push et Discord à 24h, 1h et 10 minutes avant

6. **Créer une habitude**
   - Transformer les sessions ponctuelles en routine de jeu régulière

---

## ROADMAP DE DÉVELOPPEMENT

### PHASE 0 : Pre-MVP - Boucle Complète Fonctionnelle

**Objectif**: 1 semaine pour une boucle complète pour 1 squad

#### Écrans Essentiels

- **Accueil**: "Créer une squad" et "Rejoindre une squad"
- **Liste des squads**: Vue d'ensemble de toutes les équipes
- **Création de squad**:
  - Nom
  - Jeu principal
  - Fuseau horaire
  - Règles (durée sessions, jours préférés)
- **Invitation**:
  - Lien de partage
  - Pseudo
  - Connexion Discord optionnelle

#### Page Squad (Écran Central)

L'écran le plus important de l'application, où tout se passe :

- Liste des membres actifs
- Affichage de la prochaine session planifiée
- Bouton "Proposer un créneau"
- Bouton "Voter / RSVP"
- Historique complet des sessions passées

---

### PHASE 1 : Planning & RSVP - Le MVP Réel

#### 1. Proposition de Session
- Date
- Heure de début
- Durée
- Jeu sélectionné
- Commentaire optionnel pour contextualiser la session

#### 2. Système RSVP
- ✅ **Présent**
- ❌ **Absent**
- ⏳ **Peut-être** (option pénalisée dans le score de fiabilité)

#### 3. Clôture Automatique
- Quand X% des membres ont répondu, le créneau devient "Confirmé" automatiquement

#### 4. Rappels Automatiques
- Notifications push et Discord à **24h, 1h et 10 minutes** avant la session

**Pourquoi c'est crucial**: Cette phase transforme l'intention floue en engagement concret. Sans système de rappel et de clôture automatique, les joueurs retombent dans le "on verra" qui tue la motivation.

---

### PHASE 2 : Engagement & Réputation - L'Arme Sociale

#### Check-in de Présence

Au moment de la session, chaque joueur doit confirmer sa présence réelle :

- **"Je suis là"**: Confirmation de présence à l'heure
- **"Je suis en retard"**: Transparence sur le délai
- **"Je ne viens pas"**: Annulation de dernière minute (pénalisée)

#### Score de Fiabilité

Chaque joueur possède un score visible par tous les membres de la squad :

- Pourcentage de présence effective
- Pourcentage de no-shows (absences non annoncées)
- Régularité des participations sur le temps

#### Système de Badges

| Badge | Description |
|-------|-------------|
| **Leader Fiable** | Présence exemplaire |
| **Fantôme** | Absences fréquentes |
| **Pilier de Squad** | Régularité parfaite |

---

### PHASE 3 : Automatisation Discord - L'Arme Fatale

**Objectif**: Intégration native avec Discord pour éliminer toute friction

#### Fonctionnalités Discord

1. **Création d'Events**
   - Le bot Discord crée automatiquement des événements dans le serveur de la squad dès qu'une session est confirmée

2. **Ping Automatique**
   - Notifications ciblées aux membres concernés avec rappels programmés à intervalles stratégiques

3. **Affichage RSVP**
   - Le statut de chaque membre (présent, absent, peut-être) est visible directement dans Discord

4. **Lancement Vocal**
   - Au moment T, le bot lance automatiquement un canal vocal dédié pour la session

#### Synchronisation Calendrier

Export automatique vers :
- Google Calendar
- Apple Calendar
- Outlook

**Objectif**: Les sessions apparaissent dans l'agenda personnel de chaque joueur. Plus d'excuse pour oublier.

---

### PHASE 4 : Intelligence Prédictive

#### Suggestions de Créneaux Optimaux

L'algorithme analyse l'historique réel de présence et propose automatiquement les créneaux qui ont le plus de chances de réunir tout le monde.

**Base**: Patterns de disponibilité observés, pas sur des déclarations d'intention.

#### Détection des Membres Toxiques

- Identification automatique des no-shows chroniques qui minent la motivation du groupe
- Alertes discrètes aux organisateurs pour prendre des décisions éclairées sur la composition de la squad

#### Recommandation d'Horaires Efficaces

- Machine learning sur les données de présence
- Identifier "les horaires qui marchent vraiment" pour chaque squad spécifique
- Fini les propositions au hasard

---

### PHASE 5 : Monétisation - Premium Squad

#### Modèle Freemium

La version gratuite couvre tous les besoins essentiels. Le premium débloque des fonctionnalités avancées pour les squads sérieuses qui veulent optimiser leur coordination.

#### Fonctionnalités Premium

| Fonctionnalité | Description |
|----------------|-------------|
| **Stats Avancées** | Analyses détaillées des patterns de jeu, graphiques de présence, tendances de fiabilité par membre, comparaisons inter-squads |
| **Historique Long Terme** | Conservation illimitée de l'historique des sessions (vs 30 jours en gratuit). Parfait pour les squads qui jouent ensemble depuis des années |
| **Export Calendrier Avancé** | Synchronisation bidirectionnelle avec tous les calendriers, création automatique de récurrences, gestion des conflits |
| **Bot Discord Premium** | Commandes avancées, personnalisation des messages, intégration avec d'autres bots, statistiques en temps réel dans Discord |
| **Système de Rôles** | Coach, manager, capitaine, recrue : hiérarchie personnalisable avec permissions granulaires pour les squads organisées |

---

## CONCEPTION UX : ÉCRAN PAR ÉCRAN

### Principe de Design Général

**Chaque écran a un objectif unique et clair**. Pas de navigation complexe, pas de fonctionnalités cachées. L'utilisateur doit comprendre instantanément ce qu'il peut faire et pourquoi.

### 1. Home (Écran d'Accueil)

#### CTA Principal
"Planifier une session" - L'action la plus importante, toujours accessible

#### CTA Secondaire
"Voir ma prochaine session" - Accès rapide à l'engagement imminent

#### Philosophie
Pas de feed inutile, pas de distraction. L'utilisateur vient pour une raison précise : organiser ou rejoindre une session.

---

### 2. Squad View (L'Écran Clé)

#### Header
- Nom de la squad
- Jeu principal
- Prochaine session si elle existe

#### Bloc "Prochaine session"
- Date/Heure
- Participants confirmés
- Boutons "Je confirme" et "Je ne viens pas" - décision binaire et claire

#### Bloc "Proposer une session"
- Mini calendrier
- Sélecteur d'heure
- Durée
- Validation en un clic

#### Bloc Membres
- Avatar
- Pseudo
- Score de fiabilité visible
- Date de dernière présence

#### Historique
- Liste chronologique des sessions passées avec présence réelle enregistrée

---

## VISION PYRAMIDALE DU DÉVELOPPEMENT

```
┌─────────────────────────────────────┐
│   Phase 5 : Monétisation            │
├─────────────────────────────────────┤
│   Phase 4 : Intelligence            │
├─────────────────────────────────────┤
│   Phase 3 : Discord                 │
├─────────────────────────────────────┤
│   Phase 2 : Réputation              │
├─────────────────────────────────────┤
│   Phase 1 : Planning & RSVP         │
└─────────────────────────────────────┘
```

---

## TEST ULTIME DE VALIDATION

### Critère de Réussite

> **"Si Squad Planner ne fait pas mieux que Discord + Google Calendar pour créer du commitment réel, il est mort."**

### Principes Directeurs

Chaque fonctionnalité, chaque écran, chaque notification doit servir cet objectif unique : **faire en sorte que les joueurs se retrouvent effectivement, régulièrement, et avec plaisir**.

**Ce qu'on refuse**:
- Pas de bullshit social
- Pas de gamification artificielle

**Ce qu'on livre**:
- Coordination efficace
- Fiabilité mesurable

---

## POINTS CLÉS STRATÉGIQUES

### Différenciation Marché
- **Positionnement clair**: Outil de coordination, PAS réseau social gaming
- **Problème réel**: Transformer l'intention vague en engagement concret
- **Concurrent direct**: Discord + Google Calendar (benchmark à battre)

### Architecture Fonctionnelle
- **Phase 0-1**: Boucle complète fonctionnelle (MVP)
- **Phase 2**: Engagement social via réputation
- **Phase 3**: Intégration Discord (point de friction éliminé)
- **Phase 4**: Intelligence prédictive (optimisation)
- **Phase 5**: Monétisation freemium

### Mécaniques d'Engagement
- **Rappels automatiques**: 24h, 1h, 10 min avant session
- **Check-in obligatoire**: Confirmation présence réelle
- **Score de fiabilité**: Transparence totale sur la fiabilité des membres
- **Badges**: Reconnaissance sociale positive/négative
- **Clôture automatique**: Validation quand X% ont répondu

### UX/UI Principes
- **Un écran = un objectif**
- **Pas de navigation complexe**
- **CTA clairs et binaires**
- **Transparence totale des informations**
- **Zéro distraction**

### Modèle de Revenus
- **Freemium**: Base gratuite complète
- **Premium**: Fonctionnalités avancées pour squads sérieuses
- **Valeur ajoutée**: Stats, historique illimité, export calendrier avancé, bot Discord premium, système de rôles

---

## MÉTRIQUES CLÉS IMPLICITES

Bien que non explicitement détaillées dans le PDF, les métriques suivantes sont implicites dans la roadmap :

### KPIs de Succès Probables

1. **Taux de conversion intention → session réalisée**
   - Métrique centrale du produit

2. **Taux de présence effective**
   - Pourcentage de joueurs qui se présentent après avoir confirmé

3. **Taux de no-show**
   - Absences non annoncées (à minimiser)

4. **Fréquence des sessions**
   - Sessions ponctuelles → routine régulière

5. **Score de fiabilité moyen par squad**
   - Indicateur de santé de la communauté

6. **Taux d'engagement aux rappels**
   - Efficacité des notifications 24h/1h/10min

7. **Taux de conversion freemium → premium**
   - Pour la phase 5 monétisation

---

## INSIGHTS STRATÉGIQUES

### Forces du Concept

1. **Problème clair et universel**
   - Chaque joueur a vécu le "on verra" qui ne se concrétise jamais

2. **Solution mesurable**
   - Success metric claire : les gens jouent ensemble ou pas

3. **Moat défendable**
   - La donnée historique de fiabilité devient un actif unique
   - Plus la squad utilise l'app, plus les recommandations sont précises

4. **Expansion naturelle**
   - Phase 0-1 : MVP fonctionnel
   - Phase 2-3 : Élimination frictions
   - Phase 4 : Intelligence
   - Phase 5 : Monétisation

### Risques Identifiables

1. **Dépendance Discord**
   - L'intégration Phase 3 est critique
   - Si Discord change son API, impact majeur

2. **Masse critique**
   - Nécessite que toute la squad adopte l'outil
   - Un membre qui refuse = friction pour tous

3. **Concurrence alternatives**
   - Discord pourrait intégrer ces fonctionnalités nativement
   - Google Calendar + plugins pourraient combler le gap

### Opportunités

1. **Expansion B2B**
   - Équipes esport professionnelles
   - Clans compétitifs
   - Organisations gaming

2. **Expansion verticale**
   - Au-delà du gaming : sports amateurs, groupes hobby, etc.

3. **Data monetization (éthique)**
   - Insights sur patterns de jeu
   - Recommandations de jeux basées sur disponibilités réelles

---

## PRIORISATION TECHNIQUE SUGGÉRÉE

### Must-Have (Phase 0-1)
- Création squad
- Proposition de session
- RSVP simple
- Rappels notifications
- Historique basique

### Should-Have (Phase 2-3)
- Check-in présence
- Score de fiabilité
- Badges
- Intégration Discord
- Export calendrier

### Nice-to-Have (Phase 4-5)
- ML suggestions horaires
- Détection membres toxiques
- Stats avancées
- Bot Discord premium
- Système de rôles complexe

---

## CONCLUSION

Le document "Roadmap 2" présente une vision extrêmement focalisée et cohérente pour Squad Planner. La force du concept réside dans :

1. **Clarté du problème résolu**
2. **Simplicité de la solution proposée**
3. **Progression logique des phases**
4. **Refus explicite du "feature bloat"**
5. **Test ultime clair** (battre Discord + Google Calendar)

L'approche "no bullshit" et la focalisation sur le commitment réel différencient clairement le produit des réseaux sociaux gaming traditionnels.

La roadmap est ambitieuse mais structurée de manière à permettre une validation rapide (Phase 0-1 en 1 semaine) avant d'investir dans des fonctionnalités plus complexes.

---

**Fichier généré le**: 2026-01-28
**Source**: C:\Users\RudyL\Documents\Maquette figma\Présentation SquadPlanner\Roadmap 2.pdf
**Pages**: 10
**Version**: Analyse complète
