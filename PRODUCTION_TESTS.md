# ✅ Tests Production - Squad Planner

Liste de tests à exécuter après déploiement pour valider la production.

**Date**: 25 janvier 2026  
**Version**: v1.0.0  
**Durée estimée**: 5 minutes

---

## 🎯 Tests Backend (2 min)

### Test 1.1: Health Check ✅

**Objectif**: Vérifier que le backend répond

```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/health
```

**Résultat attendu**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-25T..."
}
```

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

### Test 1.2: API Endpoints ✅

**Objectif**: Vérifier les routes principales

```bash
# Test route /api/squads
curl -H "Authorization: Bearer [ANON_KEY]" \
  https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/api/squads

# Test route /api/sessions
curl -H "Authorization: Bearer [ANON_KEY]" \
  https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/api/sessions
```

**Résultat attendu**: Status 200 ou 401 (si auth requise)

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

## 🔐 Tests Authentification (1 min)

### Test 2.1: Login Email/Password ✅

**Objectif**: Tester le login classique

**Steps**:
1. Ouvrir l'app
2. Cliquer **"Se connecter"**
3. Entrer email et password de test
4. Cliquer **"Connexion"**

**Résultat attendu**:
- ✅ Redirection vers Home
- ✅ Toast "Connexion réussie"
- ✅ Avatar visible dans profil

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

## 🔗 Tests Intégrations (2 min)

### Test 3.1: Discord OAuth ✅

**Objectif**: Vérifier l'intégration Discord

**Steps**:
1. Naviguer: **Profil** → **Paramètres** → **Intégrations**
2. Cliquer **"Connecter Discord"**
3. Accepter les permissions Discord
4. Vérifier le retour sur l'app

**Résultat attendu**:
- ✅ Redirection vers Discord OAuth
- ✅ Retour vers l'app après autorisation
- ✅ Status: **"Discord: Connecté ✓"**
- ✅ Avatar et username Discord affichés

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

### Test 3.2: Google OAuth ✅

**Objectif**: Vérifier l'intégration Google

**Steps**:
1. Même page: **Intégrations**
2. Cliquer **"Connecter Google Calendar"**
3. Sélectionner compte Google
4. Accepter les permissions

**Résultat attendu**:
- ✅ Popup Google OAuth
- ✅ Retour vers l'app
- ✅ Status: **"Google Calendar: Connecté ✓"**
- ✅ Email Google affiché

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

### Test 3.3: Calendar Sync ✅

**Objectif**: Vérifier la synchro Google Calendar

**Steps**:
1. Aller sur **Home**
2. Cliquer **"Proposer Session"**
3. Remplir:
   ```
   Squad: Test Squad
   Jeu: Valorant
   Date: Demain
   Heure: 20:00
   ```
4. Créer la session
5. Cliquer **"Je suis partant"** (RSVP)
6. Attendre 2-3 secondes
7. Ouvrir Google Calendar web

**Résultat attendu**:
- ✅ Toast: **"Session ajoutée à Google Calendar !"**
- ✅ Événement visible dans Google Calendar
- ✅ Titre: `"Valorant - Test Squad"`
- ✅ Heure correcte: `20:00`
- ✅ Description contient infos de session

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

## 🎮 Tests Fonctionnels Core (3 min)

### Test 4.1: Créer une Squad ✅

**Objectif**: Créer une nouvelle squad

**Steps**:
1. Home → **"Créer Squad"**
2. Remplir:
   ```
   Nom: Production Test Squad
   Jeu: League of Legends
   Description: Test squad pour validation production
   ```
3. Cliquer **"Créer"**

**Résultat attendu**:
- ✅ Toast: **"Squad créée !"**
- ✅ Redirection vers détail squad
- ✅ Squad visible dans liste "Mes Squads"
- ✅ Badge "Créateur" visible

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

### Test 4.2: Proposer une Session ✅

**Objectif**: Créer une session avec vote

**Steps**:
1. Ouvrir la squad créée
2. Cliquer **"Proposer Session"**
3. Ajouter 2-3 créneaux:
   ```
   Créneau 1: Demain 19:00
   Créneau 2: Demain 21:00
   Créneau 3: Après-demain 20:00
   ```
4. Cliquer **"Proposer"**

**Résultat attendu**:
- ✅ Toast: **"Session proposée !"**
- ✅ Session visible dans onglet "Sessions"
- ✅ Créneaux affichés avec boutons de vote
- ✅ Compteur "0/1" visible

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

### Test 4.3: RSVP Session ✅

**Objectif**: Tester le système RSVP

**Steps**:
1. Aller sur **Sessions**
2. Sélectionner la prochaine session
3. **Swiper vers la droite** (ou cliquer "Partant")
4. Observer l'animation

**Résultat attendu**:
- ✅ Animation de swipe fluide
- ✅ Confetti celebration appear
- ✅ Toast: **"Tu es partant ! 🎮"**
- ✅ Bouton devient vert avec checkmark
- ✅ Compteur incrémenté: "1/1"
- ✅ Badge "Confirmé" visible

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

### Test 4.4: Système de Fiabilité ✅

**Objectif**: Vérifier le scoring

**Steps**:
1. Aller sur **Profil**
2. Observer le score de fiabilité
3. Aller dans l'historique des sessions

**Résultat attendu**:
- ✅ Score affiché (ex: 85%)
- ✅ Badge de niveau visible
- ✅ Historique des participations
- ✅ Stats "X sessions / Y participations"

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

## 🎨 Tests UI/UX (2 min)

### Test 5.1: Animations ✅

**Objectif**: Vérifier les animations premium

**Steps**:
1. Scroll sur la **Home**
2. Observer les animations de reveal
3. Hover sur les cards
4. Observer le parallax

**Résultat attendu**:
- ✅ Stats animated counter (247, 1.8K, 89%)
- ✅ Cards fade-in avec stagger
- ✅ Hover glow effect sur cards
- ✅ Smooth 60 FPS (pas de lag)
- ✅ Parallax subtil sur header

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

### Test 5.2: Responsive Mobile ✅

**Objectif**: Vérifier le mobile-first

**Steps**:
1. Ouvrir DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Tester plusieurs tailles:
   - iPhone SE (375x667)
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)

**Résultat attendu**:
- ✅ Layout adapté à chaque taille
- ✅ Navigation bottom visible sur mobile
- ✅ Header collapsé sur mobile
- ✅ Cards stackées verticalement
- ✅ Touch targets > 44px
- ✅ Pas de scroll horizontal

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

### Test 5.3: Textes et Copywriting ✅

**Objectif**: Vérifier la qualité du contenu

**Steps**:
1. Parcourir les pages principales
2. Lire les messages de toast
3. Observer les empty states

**Résultat attendu**:
- ✅ Tout en français (pas d'anglais)
- ✅ Ton gaming-friendly et sobre
- ✅ Pas de jargon technique
- ✅ Messages clairs et actionables
- ✅ Emojis utilisés avec parcimonie

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

## 🔍 Tests Edge Cases (2 min)

### Test 6.1: Offline Mode ✅

**Objectif**: Comportement sans connexion

**Steps**:
1. Ouvrir DevTools → Network
2. Cocher "Offline"
3. Essayer de charger des données

**Résultat attendu**:
- ✅ Message d'erreur clair
- ✅ Pas de crash
- ✅ Interface reste navigable
- ✅ Toast: "Connexion perdue"

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

### Test 6.2: Données Vides ✅

**Objectif**: Empty states

**Steps**:
1. Créer un nouveau compte test
2. Naviguer vers **Squads**
3. Naviguer vers **Sessions**

**Résultat attendu**:
- ✅ Empty state "Aucune squad"
- ✅ CTA: "Créer ma première squad"
- ✅ Empty state "Aucune session"
- ✅ Illustration ou icône

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

### Test 6.3: Long Content ✅

**Objectif**: Overflow et truncation

**Steps**:
1. Créer une squad avec un nom très long:
   ```
   "Super Mega Ultra Squad de Gaming avec un nom extrêmement long qui devrait être tronqué"
   ```
2. Observer l'affichage

**Résultat attendu**:
- ✅ Texte tronqué avec ellipsis (...)
- ✅ Pas de débordement de layout
- ✅ Card garde sa taille
- ✅ Tooltip au hover (optionnel)

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

## 📊 Tests Performance (1 min)

### Test 7.1: Lighthouse Score ✅

**Objectif**: Score Lighthouse

**Steps**:
1. Ouvrir DevTools → Lighthouse
2. Mode: Mobile
3. Catégories: Performance, Accessibility, Best Practices, SEO
4. Run audit

**Résultat attendu**:
- ✅ Performance: > 80
- ✅ Accessibility: > 90
- ✅ Best Practices: > 90
- ✅ SEO: > 80

**Status**: [ ] Pass [ ] Fail  
**Score**: Performance: ___ / Accessibility: ___ / BP: ___ / SEO: ___

---

### Test 7.2: Core Web Vitals ✅

**Objectif**: Web Vitals optimisés

**Résultat attendu**:
- ✅ LCP (Largest Contentful Paint): < 2.5s
- ✅ FID (First Input Delay): < 100ms
- ✅ CLS (Cumulative Layout Shift): < 0.1

**Status**: [ ] Pass [ ] Fail  
**Metrics**: LCP: ___s / FID: ___ms / CLS: ___

---

## 🛡️ Tests Sécurité (1 min)

### Test 8.1: Variables d'Environnement ✅

**Objectif**: Pas de secrets exposés

**Steps**:
1. Ouvrir DevTools → Sources
2. Rechercher dans les fichiers JS:
   - `SERVICE_ROLE_KEY`
   - `CLIENT_SECRET`
   - `PRIVATE`

**Résultat attendu**:
- ✅ Aucun secret trouvé dans bundle frontend
- ✅ Seulement `ANON_KEY` visible (OK)
- ✅ Aucun token en clair

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

### Test 8.2: HTTPS Only ✅

**Objectif**: Connexions sécurisées

**Steps**:
1. Vérifier l'URL: doit commencer par `https://`
2. Vérifier le cadenas vert dans la barre d'adresse

**Résultat attendu**:
- ✅ HTTPS actif
- ✅ Certificat valide
- ✅ Pas de mixed content warnings

**Status**: [ ] Pass [ ] Fail  
**Notes**: _______________________

---

## ✅ Résumé des Tests

### Backend (2/2)
- [ ] Health check
- [ ] API endpoints

### Auth (1/1)
- [ ] Login email/password

### Intégrations (3/3)
- [ ] Discord OAuth
- [ ] Google OAuth
- [ ] Calendar sync

### Fonctionnalités Core (4/4)
- [ ] Créer squad
- [ ] Proposer session
- [ ] RSVP
- [ ] Fiabilité

### UI/UX (3/3)
- [ ] Animations
- [ ] Responsive
- [ ] Copywriting

### Edge Cases (3/3)
- [ ] Offline
- [ ] Empty states
- [ ] Long content

### Performance (2/2)
- [ ] Lighthouse
- [ ] Core Web Vitals

### Sécurité (2/2)
- [ ] Secrets
- [ ] HTTPS

---

## 📊 Score Final

**Tests réussis**: ___/20  
**Taux de réussite**: ___%

### Statut

- [ ] ✅ **PRODUCTION READY** (20/20)
- [ ] ⚠️ **WARNINGS** (18-19/20) - Déployer avec surveillance
- [ ] ❌ **BLOCKER** (< 18/20) - Corriger avant déploiement

---

## 🐛 Bugs Trouvés

| # | Sévérité | Description | Status |
|---|----------|-------------|--------|
| 1 | Critical | | [ ] Fixed |
| 2 | Major | | [ ] Fixed |
| 3 | Minor | | [ ] Fixed |
| 4 | Trivial | | [ ] Fixed |

---

## 📝 Notes Finales

**Testeur**: _______________________  
**Date**: _______________________  
**Durée**: _______ minutes  
**Environnement**: _______________________

**Commentaires**:
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

**✅ Tests complétés - Squad Planner v1.0.0**
