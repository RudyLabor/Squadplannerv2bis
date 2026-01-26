# 🎮 Squad Planner - Écosystème de Démonstration

## Vue d'ensemble

Le système de démonstration Squad Planner génère automatiquement un écosystème complet et réaliste de données gaming pour tester et présenter l'application.

---

## 🚀 Démarrage Rapide

### 1. Générer l'Écosystème

```bash
# Via l'interface
1. Connectez-vous à Squad Planner
2. Profil → QA Tests → Test Data Setup
3. Cliquez "Générer l'écosystème complet"
4. Attendez 30-60 secondes
```

### 2. Se Connecter avec un Profil Démo

```
Email: shadow.ninja@squadplanner.demo
Password: Demo1234!
```

### 3. Explorer !

Vous avez maintenant accès à:
- 18 profils gaming avec avatars et stats
- 7 squads actives (Valorant, Overwatch, Apex, LoL)
- 40-80 sessions (passées et futures)
- Badges et achievements débloqués
- Historique d'activité complet

---

## 📊 Données Générées

| Type | Quantité | Description |
|------|----------|-------------|
| **Profils Utilisateurs** | 18 | Profils gaming réalistes avec avatars, biographies, stats |
| **Squads** | 7 | Squads actives multi-jeux avec 4-5 membres chacune |
| **Sessions** | 40-80 | Sessions passées (7-90j) et futures (1-14j) avec RSVP |
| **Badges** | 6 types | Achievements basés sur les performances |
| **Activités** | ~90 | Entrées de feed social pour chaque profil |

---

## 🎯 Squads Disponibles

### 1. Les Valorant Tryharders 💎
- **Jeu:** Valorant
- **Type:** Compétitif
- **Membres:** 5 (ShadowNinja, PhoenixRising, CyberViper, MysticSage, VoidWalker)

### 2. Overwatch Legends 🎮
- **Jeu:** Overwatch 2  
- **Type:** Chill & Teamplay
- **Membres:** 4 (IronTitan, GhostReaper, StarGuardian, StormBreaker)

### 3. Apex Predators 🔥
- **Jeu:** Apex Legends
- **Type:** Grind quotidien
- **Membres:** 4 (LunarEclipse, NovaStrike, BlazeFury, NeonRider)

### 4. LoL Ranked Squad 🎤
- **Jeu:** League of Legends
- **Type:** Ranked & Clash
- **Membres:** 4 (ThunderGod, CrystalMage, DragonSlayer, CrimsonBlade)

### 5. Chill Gaming Nights 🎉
- **Jeu:** Valorant
- **Type:** Fun entre potes
- **Membres:** 5 (ArcticFox, MysticSage, PhoenixRising, VoidWalker, CyberViper)

### 6. Weekend Warriors 👨‍👩‍👧‍👦
- **Jeu:** Valorant
- **Type:** Weekend only
- **Membres:** 4 (ShadowNinja, IronTitan, LunarEclipse, ThunderGod)

### 7. Night Owls 🌙
- **Jeu:** League of Legends
- **Type:** Sessions nocturnes
- **Membres:** 4 (VoidWalker, CyberViper, LunarEclipse, GhostReaper)

---

## 👥 Profils Recommandés

### 🏆 Top Performers (Fiabilité >90%)
```
mystic.sage@squadplanner.demo      (97% - 45 sessions)
star.guardian@squadplanner.demo    (96% - 43 sessions)
shadow.ninja@squadplanner.demo     (95% - 42 sessions)
crystal.mage@squadplanner.demo     (94% - 41 sessions)
void.walker@squadplanner.demo      (93% - 39 sessions)
```

### 🎮 Par Jeu
```
Valorant:     shadow.ninja@squadplanner.demo
Overwatch:    iron.titan@squadplanner.demo  
Apex:         lunar.eclipse@squadplanner.demo
LoL:          thunder.god@squadplanner.demo
```

### 🌟 Multi-Squads (Bon pour démos)
```
shadow.ninja@squadplanner.demo     (2 squads)
mystic.sage@squadplanner.demo      (2 squads)
phoenix.rising@squadplanner.demo   (2 squads)
void.walker@squadplanner.demo      (3 squads)
```

---

## 🏅 Système de Badges

Les profils peuvent avoir débloqué les badges suivants:

| Badge | Condition | Rareté |
|-------|-----------|--------|
| 🎯 **Fiable** | 95%+ présence | Rare |
| ⭐ **Vétéran** | 50+ sessions | Epic |
| 🌅 **Lève-tôt** | 10 sessions avant 20h | Common |
| 🌙 **Oiseau de nuit** | 10 sessions après minuit | Common |
| 🤝 **Team Player** | Aucune absence 30j | Epic |
| 📅 **Organisateur** | 20+ sessions créées | Rare |

---

## 📅 Caractéristiques des Sessions

### Distribution Temporelle
- **Passées:** 7-90 jours dans le passé
- **Futures:** 1-14 jours dans le futur
- **Horaires:** Principalement 18h-23h
- **Patterns:** Biais vers Mardi 21h et Jeudi 20h

### Statuts
- `completed` - Session passée avec ≥3 confirmations
- `cancelled` - Session passée avec <3 confirmations  
- `confirmed` - Session future avec ≥3 confirmations
- `proposed` - Session future avec <3 confirmations

### RSVP
Chaque membre a répondu:
- **Sessions passées:** Majoritairement oui/non
- **Sessions futures:** Mix de oui/non/peut-être
- **Taux de confirmation:** ~60-80% par session

---

## 🔧 Architecture Technique

### Backend (Deno + Supabase)
```
/supabase/functions/server/
├── test-data-generator.ts    # Générateur principal
├── index.tsx                  # Route POST /demo/generate-ecosystem
└── kv_store.tsx              # Persistance clé-valeur
```

### Frontend (React)
```
/src/app/screens/
└── TestSetupScreen.tsx        # Interface de génération
```

### Données Stockées
```
KV Store:
├── user:{userId}              # Profils utilisateurs
├── squad:{squadId}            # Squads
├── session:{squadId}:{sessionId}  # Sessions
├── user-badges:{userId}       # Badges débloqués
└── user-activities:{userId}   # Historique activité
```

---

## 🎬 Cas d'Usage

### 1. Démos Clients
```
1. Générer l'écosystème
2. Se connecter avec shadow.ninja@squadplanner.demo
3. Montrer les squads actives
4. Montrer une session avec RSVP
5. Montrer le profil avec badges
```

### 2. Tests QA
```
1. Générer l'écosystème
2. Tester avec différents profils
3. Vérifier les permissions par squad
4. Tester les flows RSVP
5. Valider les stats et badges
```

### 3. Screenshots Marketing
```
1. Générer l'écosystème  
2. Utiliser des profils top (97% fiabilité)
3. Capturer écrans avec données réalistes
4. Montrer squads variées (différents jeux)
```

### 4. Tests de Performance
```
1. Générer l'écosystème
2. Mesurer temps de chargement
3. Tester avec 18 utilisateurs simultanés
4. Valider requêtes avec 40-80 sessions
```

---

## 🐛 Dépannage

### Problème: Génération échoue
**Solution:**
- Vérifier logs serveur
- Vérifier que Supabase est accessible
- Réessayer après quelques secondes

### Problème: Login impossible
**Solution:**
- Mot de passe correct: `Demo1234!`
- Email exact (copier-coller)
- Vérifier que génération est terminée

### Problème: Squads vides
**Solution:**
- Rafraîchir la page
- Déconnexion/reconnexion
- Vérifier que vous êtes membre de la squad

---

## 📚 Documentation Complète

- **`DEMO_PROFILES.md`** - Liste complète des 18 profils avec détails
- **`HOW_TO_GENERATE_DEMO.md`** - Guide pas-à-pas de génération
- **`README.md`** - Documentation générale de l'application

---

## ⚠️ Notes Importantes

### Sécurité
- ❌ **NE PAS utiliser en production**
- ❌ **Mot de passe faible volontairement**
- ❌ **Emails fictifs uniquement**

### Performance
- ⏱️ Génération: 30-60 secondes
- 💾 Espace DB: ~2-3 MB
- 🔄 Peut être régénéré sans problème

### Maintenance
- 🗑️ Données persistent jusqu'à suppression manuelle
- 🔄 Re-génération: écrase les profils existants
- 🧹 Clean DB: supprimer manuellement via Supabase

---

## 🎉 Résultat Final

Après génération, vous avez une application Squad Planner **100% fonctionnelle** et **remplie de données réalistes** :

✅ Écrans de squads vivants
✅ Sessions passées et futures
✅ Profils complets avec stats
✅ Badges débloqués
✅ Feed d'activité social
✅ Patterns pour suggestions IA
✅ Notifications générées
✅ Historique de présence

**Parfait pour démos, tests, et développement !** 🚀

---

## 📞 Support

Questions? Voir:
- `HOW_TO_GENERATE_DEMO.md` pour guide détaillé
- `DEMO_PROFILES.md` pour liste des profils
- Logs serveur pour debugging

---

Généré avec ❤️ par Squad Planner
Version: 1.0.0 | Date: Janvier 2026
