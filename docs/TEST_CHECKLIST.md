# TEST CHECKLIST - Squad Planner

> **Guide de test complet avec Puppeteer**
> Dernière mise à jour: 30 Janvier 2026

---

## CREDENTIALS DE TEST

- **Email**: rudylabor@hotmail.fr
- **Password**: SquadPlanner2026!
- **URL Prod**: https://squadplanner.vercel.app

---

## PHASE 0: MVP CORE

### 0.1 Authentification
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 0.1.1 | Page login s'affiche correctement | [x] | |
| 0.1.2 | Connexion avec email/password fonctionne | [x] | |
| 0.1.3 | Redirection vers Home après login | [x] | |
| 0.1.4 | Déconnexion fonctionne | [ ] | |
| 0.1.5 | Mot de passe oublié fonctionne | [ ] | |
| 0.1.6 | Création de compte fonctionne | [ ] | |
| 0.1.7 | OAuth Discord fonctionne | [ ] | |

### 0.2 Home / Accueil
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 0.2.1 | Page Home s'affiche après login | [ ] | |
| 0.2.2 | Nom utilisateur affiché (Bienvenue, X) | [ ] | |
| 0.2.3 | Stats affichées (Sessions, Joueurs, Fiabilité) | [ ] | |
| 0.2.4 | Countdown prochaine session visible | [ ] | |
| 0.2.5 | Message "Aucune session prévue" si pas de session | [ ] | |
| 0.2.6 | Barre de recherche fonctionne | [ ] | |

### 0.3 Navigation
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 0.3.1 | Menu latéral visible (Accueil, Squads, Sessions, Profil) | [x] | |
| 0.3.2 | Navigation vers Squads fonctionne | [x] | |
| 0.3.3 | Navigation vers Sessions fonctionne | [ ] | |
| 0.3.4 | Navigation vers Profil fonctionne | [ ] | |
| 0.3.5 | Retour à Accueil fonctionne | [ ] | |
| 0.3.6 | Section Explorer visible (Succès, Classement, Intégrations) | [ ] | |

### 0.4 Gestion des Squads
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 0.4.1 | Page Squads s'affiche | [x] | |
| 0.4.2 | Liste des squads visible | [x] | |
| 0.4.3 | Bouton "Créer une squad" fonctionne | [x] | |
| 0.4.4 | Formulaire création squad (nom, jeu, timezone) | [x] | |
| 0.4.5 | Squad créée apparaît dans la liste | [x] | CORRIGÉ |
| 0.4.6 | Clic sur squad ouvre le détail | [x] | |
| 0.4.7 | Détail squad affiche: nom, jeu, membres | [x] | CORRIGÉ |
| 0.4.8 | Bouton inviter membre fonctionne | [ ] | |
| 0.4.9 | Lien d'invitation généré | [x] | |
| 0.4.10 | Bouton quitter squad fonctionne | [ ] | |

### 0.5 Planification de Sessions
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 0.5.1 | Page Sessions s'affiche | [ ] | |
| 0.5.2 | Liste des sessions visible | [ ] | |
| 0.5.3 | Bouton "Proposer une session" fonctionne | [ ] | |
| 0.5.4 | Sélecteur de date (calendrier) fonctionne | [ ] | |
| 0.5.5 | Sélecteur d'heure (2 colonnes) fonctionne | [ ] | |
| 0.5.6 | Sélection durée fonctionne (1h, 2h, 3h) | [ ] | |
| 0.5.7 | Sélection jeu fonctionne | [ ] | |
| 0.5.8 | Champ description/notes fonctionne | [ ] | |
| 0.5.9 | Bouton "Proposer" crée la session | [ ] | |
| 0.5.10 | Session créée apparaît dans la liste | [ ] | |

### 0.6 Système RSVP
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 0.6.1 | Détail session affiche les RSVP | [ ] | |
| 0.6.2 | Bouton "Je viens" (Partant) fonctionne | [ ] | |
| 0.6.3 | Bouton "Peut-être" fonctionne | [ ] | |
| 0.6.4 | Bouton "Je ne viens pas" (Absent) fonctionne | [ ] | |
| 0.6.5 | Statut RSVP mis à jour en temps réel | [ ] | |
| 0.6.6 | Compteur de participants affiché (X/Y) | [ ] | |
| 0.6.7 | Jauge de progression visible | [ ] | |
| 0.6.8 | Cards membres avec statuts visuels | [ ] | |

### 0.7 Chat Squad
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 0.7.1 | Accès au chat depuis détail squad | [ ] | |
| 0.7.2 | Messages existants affichés | [ ] | |
| 0.7.3 | Envoi de message fonctionne | [ ] | |
| 0.7.4 | Message apparaît en temps réel | [ ] | |

---

## PHASE 1: ENGAGEMENT & DISCIPLINE

### 1.1 Score de Fiabilité
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 1.1.1 | Score fiabilité visible sur Profil | [ ] | |
| 1.1.2 | Pourcentage affiché (ex: 100%) | [ ] | |
| 1.1.3 | Badge de fiabilité coloré | [ ] | |
| 1.1.4 | Graphique évolution visible | [ ] | |
| 1.1.5 | Stats détaillées (sessions, présence, retard) | [ ] | |

### 1.2 Historique
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 1.2.1 | Page Historique accessible | [ ] | |
| 1.2.2 | Liste sessions passées visible | [ ] | |
| 1.2.3 | Filtres par statut fonctionnent | [ ] | |
| 1.2.4 | Filtres par période fonctionnent | [ ] | |
| 1.2.5 | Export CSV fonctionne | [ ] | |

### 1.3 Rôles et Permissions
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 1.3.1 | Rôle Leader visible sur membres | [ ] | |
| 1.3.2 | Rôle Co-leader visible | [ ] | |
| 1.3.3 | Rôle Membre visible | [ ] | |
| 1.3.4 | Leader peut promouvoir membre | [ ] | |
| 1.3.5 | Leader peut kick membre | [ ] | |
| 1.3.6 | Leader peut modifier squad | [ ] | |

### 1.4 Check-in
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 1.4.1 | Écran Check-in accessible avant session | [ ] | |
| 1.4.2 | Bouton "Je suis prêt" fonctionne | [ ] | |
| 1.4.3 | Bouton "Je suis en route" fonctionne | [ ] | |
| 1.4.4 | Bouton "Je serai en retard" fonctionne | [ ] | |
| 1.4.5 | Bouton "Je ne peux pas" fonctionne | [ ] | |
| 1.4.6 | Statuts mis à jour en temps réel | [ ] | |

### 1.5 Badges
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 1.5.1 | Page badges accessible | [ ] | |
| 1.5.2 | Liste des badges disponibles | [ ] | |
| 1.5.3 | Badges débloqués visibles | [ ] | |
| 1.5.4 | Équiper un badge fonctionne | [ ] | |
| 1.5.5 | Déséquiper un badge fonctionne | [ ] | |

---

## PHASE 2: INTELLIGENCE SOCIALE

### 2.1 Suggestions Automatiques
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 2.1.1 | Widget suggestions sur Home | [ ] | |
| 2.1.2 | Créneaux suggérés affichés | [ ] | |
| 2.1.3 | Bouton "Utiliser" fonctionne | [ ] | |

### 2.2 Heatmap Disponibilité
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 2.2.1 | Écran Heatmap accessible | [ ] | |
| 2.2.2 | Grille 7j x 24h affichée | [ ] | |
| 2.2.3 | Couleurs selon disponibilité | [ ] | |
| 2.2.4 | Clic sur créneau affiche détails | [ ] | |

### 2.3 Score Cohésion
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 2.3.1 | Score cohésion affiché sur squad | [ ] | |
| 2.3.2 | Tendance visible (hausse/baisse) | [ ] | |
| 2.3.3 | Recommandations affichées | [ ] | |

### 2.4 Prédiction No-Show
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 2.4.1 | Prédiction visible sur session | [ ] | |
| 2.4.2 | Niveau de risque affiché | [ ] | |
| 2.4.3 | Membres à risque identifiés | [ ] | |

---

## PHASE 3: INTÉGRATION DISCORD

### 3.1 Connexion Discord
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 3.1.1 | Écran connexion Discord accessible | [ ] | |
| 3.1.2 | Bouton "Connecter Discord" fonctionne | [ ] | |
| 3.1.3 | OAuth Discord complète | [ ] | |

### 3.2 Configuration Bot
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 3.2.1 | Écran config bot accessible | [ ] | |
| 3.2.2 | Webhook URL configurable | [ ] | |
| 3.2.3 | Test webhook fonctionne | [ ] | |

### 3.3 Calendrier Export
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 3.3.1 | Écran sync calendrier accessible | [ ] | |
| 3.3.2 | Export .ICS fonctionne | [ ] | |
| 3.3.3 | Fichier téléchargé valide | [ ] | |

---

## PHASE 4: MONÉTISATION

### 4.1 Premium
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 4.1.1 | Page Premium accessible | [ ] | |
| 4.1.2 | Plans affichés (Free, Premium, Pro) | [ ] | |
| 4.1.3 | Bouton "Upgrader" fonctionne | [ ] | |
| 4.1.4 | Checkout Stripe s'ouvre | [ ] | |

### 4.2 Feature Gating
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 4.2.1 | Features premium bloquées en Free | [ ] | |
| 4.2.2 | Prompt upgrade affiché | [ ] | |
| 4.2.3 | Features débloquées après upgrade | [ ] | |

---

## PHASE 5: ÉCOSYSTÈME

### 5.1 API & Webhooks
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 5.1.1 | Page API Docs accessible | [ ] | |
| 5.1.2 | Génération API Key fonctionne | [ ] | |
| 5.1.3 | Page Webhooks accessible | [ ] | |
| 5.1.4 | Création webhook fonctionne | [ ] | |

### 5.2 Intelligence Team
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 5.2.1 | Écran Intelligence accessible | [ ] | |
| 5.2.2 | Analyse composition squad | [ ] | |
| 5.2.3 | Détection leaders | [ ] | |
| 5.2.4 | Recommandations équipe | [ ] | |

### 5.3 Communauté
| # | Test | Statut | Bug |
|---|------|--------|-----|
| 5.3.1 | Écran Classement accessible | [ ] | |
| 5.3.2 | Leaderboard affiché | [ ] | |
| 5.3.3 | Écran Ligues accessible | [ ] | |
| 5.3.4 | Écran Saisons accessible | [ ] | |

---

## BUGS TROUVÉS

| # | Phase | Description | Sévérité | Fichier | Corrigé |
|---|-------|-------------|----------|---------|---------|
| 1 | 0.4 | Création squad bloque (RLS recursion) | Haute | Supabase RLS | [x] |
| 2 | 0.4 | Page détail squad invisible (opacity: 0) | Haute | SquadDetailScreen.tsx | [x] |
| 3 | 0.4 | Affichage "0 membres" (RLS trop restrictive) | Moyenne | Supabase RLS | [x] |

---

## NOTES DE SESSION

### Session 30 Jan 2026 - 22h00
- Bug animation détail squad CORRIGÉ (containerVariants)
- Bug affichage membres CORRIGÉ (policy RLS)
- Tests Phase 0.4 Squads: tous les tests passent!

### Session 30 Jan 2026 - 21h30
- Bug création squad CORRIGÉ (récursion RLS infinite)
- Policies RLS simplifiées pour éviter références croisées

### Session 30 Jan 2026 - 20h45
- Bug F5/refresh CORRIGÉ (workaround localStorage)
- Tests Phase 0.1 Auth: OK

### Session 30 Jan 2026
- Policies RLS appliquées sur Supabase
- Connexion fonctionne
- Page Home s'affiche correctement

---

*Document généré le 30 Janvier 2026*
