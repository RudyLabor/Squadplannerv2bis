# 🚀 Comment Générer l'Écosystème de Démo

Ce guide explique comment remplir Squad Planner avec des données de démonstration réalistes.

## 📍 Accès Rapide

### Option 1: Via QA Tests (Recommandé)
1. Connectez-vous à l'application
2. Allez dans **Profil** (onglet du bas)
3. Scrollez jusqu'à la section "Developer Tools"
4. Cliquez sur **🧪 QA Tests**
5. Cliquez sur le bouton **🧪 Test Data Setup**
6. Vous êtes sur l'écran de génération !

### Option 2: Navigation directe
- URL: `#/test-setup` (si vous avez un système de routing)
- Ou utilisez la commande palette (Cmd+K) et cherchez "Test Setup"

---

## 🎮 Processus de Génération

### Étape 1: Lancer la Génération
1. Sur l'écran "🎮 Générateur de Démo", lisez les informations
2. Cliquez sur le bouton **"Générer l'écosystème complet"**
3. ⏱️ Attendez 30-60 secondes (c'est normal, on crée beaucoup de données!)

### Étape 2: Vérifier les Résultats
Après génération, vous verrez:
- ✅ Nombre de profils créés (18)
- ✅ Nombre de squads créées (7)
- ✅ Nombre de sessions créées (40-80)
- ✅ Liste des profils avec avatars
- ✅ Liste des squads

### Étape 3: Se Connecter avec un Profil Démo
1. **Déconnectez-vous** de votre compte actuel
2. Sur l'écran de login, utilisez un des emails de démo:
   - `shadow.ninja@squadplanner.demo`
   - `phoenix.rising@squadplanner.demo`
   - `mystic.sage@squadplanner.demo`
   - (ou n'importe quel autre de la liste)
3. Mot de passe pour TOUS les comptes: `Demo1234!`
4. ✅ Vous êtes connecté !

---

## 🎯 Que Contient l'Écosystème?

### 👥 18 Profils Gaming
- Profils réalistes avec avatars de qualité
- Biographies gaming authentiques
- Stats de fiabilité variées (72%-97%)
- Historique de sessions
- Badges débloqués selon les performances

### 🎮 7 Squads Actives
1. **Les Valorant Tryharders** - Compétitif Valorant
2. **Overwatch Legends** - Chill Overwatch 2
3. **Apex Predators** - Grind Apex quotidien
4. **LoL Ranked Squad** - Clash et ranked flex
5. **Chill Gaming Nights** - Sessions fun
6. **Weekend Warriors** - Jeu le weekend uniquement
7. **Night Owls** - Sessions nocturnes

### 📅 40-80 Sessions
- **Sessions passées** (7-90 jours): Status completed/cancelled
- **Sessions futures** (1-14 jours): Status confirmed/proposed
- Réponses RSVP de tous les membres
- Horaires réalistes (18h-23h principalement)

### 🏆 Badges & Achievements
- 🎯 Fiable (95%+ présence)
- ⭐ Vétéran (50+ sessions)
- 🌅 Lève-tôt (sessions avant 20h)
- 🌙 Oiseau de nuit (sessions après minuit)
- 🤝 Team Player (aucune absence 30j)
- 📅 Organisateur (20+ sessions créées)

### 📊 Données Additionnelles
- Historique d'activité pour feed social
- Notifications pour chaque profil
- Stats de présence détaillées
- Patterns de disponibilité pour IA

---

## 🔍 Profils Recommandés pour Tester

### Pour tester la fiabilité élevée:
- **mystic.sage@squadplanner.demo** (97% - 45 sessions)
- **star.guardian@squadplanner.demo** (96% - 43 sessions)
- **shadow.ninja@squadplanner.demo** (95% - 42 sessions)

### Pour tester plusieurs squads:
- **shadow.ninja@squadplanner.demo** (2 squads)
- **mystic.sage@squadplanner.demo** (2 squads)
- **phoenix.rising@squadplanner.demo** (2 squads)

### Pour tester la variété de jeux:
- **thunder.god@squadplanner.demo** (League of Legends)
- **iron.titan@squadplanner.demo** (Overwatch 2)
- **lunar.eclipse@squadplanner.demo** (Apex Legends)

---

## 🐛 Troubleshooting

### Erreur: "Email already exists"
- Normal! Les profils existent déjà
- Utilisez directement les identifiants de démo
- Ou supprimez la base de données et régénérez

### Génération qui prend >2 minutes
- Peut arriver si beaucoup de données existent déjà
- Rafraîchissez la page et réessayez
- Vérifiez les logs serveur pour plus d'infos

### Profils créés mais je ne peux pas me connecter
- Vérifiez que vous utilisez le bon mot de passe: `Demo1234!`
- Email doit être exact (copier-coller recommandé)
- Vérifiez qu'il n'y a pas d'espaces avant/après

### Squads vides après génération
- Attendez quelques secondes et rafraîchissez
- Les squads sont créées en async
- Déconnectez-vous et reconnectez-vous

---

## 💡 Astuces

### Pour une démo rapide:
1. Générez l'écosystème
2. Connectez-vous avec `shadow.ninja@squadplanner.demo`
3. Montrez les 2 squads actives
4. Montrez les sessions passées et futures
5. Montrez les stats et badges

### Pour tester les fonctionnalités sociales:
1. Ouvrez 2 onglets/fenêtres
2. Connectez-vous avec 2 profils différents de la même squad
3. Testez les interactions (RSVP, chat, etc.)

### Pour tester l'IA et suggestions:
- Utilisez "Les Valorant Tryharders" - beaucoup de sessions
- Pattern clair: Mardi 21h, Jeudi 20h
- Parfait pour tester la heatmap et suggestions

---

## 📚 Documentation Complète

Voir `DEMO_PROFILES.md` pour la liste complète de tous les profils avec détails.

---

## ⚠️ Notes Importantes

- **Environnement de démo uniquement** - Ne pas utiliser en production
- **Mot de passe simple** - Jamais pour de vrais utilisateurs
- **Données persistées** - Restent dans la DB jusqu'à suppression manuelle
- **Peut être régénéré** - Safe de relancer plusieurs fois

---

## 🎉 Profitez de l'Application Remplie !

Une fois l'écosystème généré, vous avez une application Squad Planner complètement vivante avec:
- ✅ Squads actives avec vrais membres
- ✅ Sessions passées et futures
- ✅ Stats et historique réalistes
- ✅ Badges et achievements débloqués
- ✅ Feed d'activité social
- ✅ Patterns pour IA/ML

Parfait pour:
- 🎬 Démos clients
- 🧪 Tests QA
- 📸 Screenshots marketing
- 🎓 Formation nouveaux devs
- 🎮 Tests de performance

---

Made with ❤️ by Squad Planner Team
