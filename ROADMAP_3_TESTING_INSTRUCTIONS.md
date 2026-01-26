# 🧪 ROADMAP #3 - INSTRUCTIONS DE TEST

**Date** : 25 Janvier 2026  
**Status** : ✅ **PRÊT POUR TESTS**

---

## 🎯 OBJECTIF

Ce document explique **comment tester la Roadmap #3** de bout en bout avec des données réelles.

---

## 📋 PRÉREQUIS

1. ✅ Application Squad Planner déployée
2. ✅ Backend Supabase fonctionnel
3. ✅ Compte utilisateur créé et connecté
4. ✅ Au moins 1 squad créée

---

## 🚀 ÉTAPE 1 : ACCÉDER AUX ÉCRANS DE TEST

### Option A : Via URL directe

1. Connectez-vous à l'application
2. Ouvrez la console navigateur (F12)
3. Tapez dans la console :
```javascript
window.location.hash = '#test-setup'
```
4. Appuyez sur Entrée

### Option B : Via le code (méthode dev)

Ajoutez temporairement dans `HomeScreen.tsx` après la ligne 540 :

```typescript
{/* DEV ONLY - Tests QA */}
{process.env.NODE_ENV === 'development' && (
  <div className="mt-10 p-5 bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)] rounded-2xl border-[0.5px] border-[var(--warning-200)]">
    <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-3">
      🧪 QA Tools (Dev Only)
    </h3>
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="secondary"
        onClick={() => onNavigate('test-setup')}
        className="text-xs"
      >
        Setup Test Data
      </Button>
      <Button
        variant="secondary"
        onClick={() => onNavigate('qa-tests')}
        className="text-xs"
      >
        Run QA Tests
      </Button>
    </div>
  </div>
)}
```

---

## 🧪 ÉTAPE 2 : GÉNÉRER LES DONNÉES DE TEST

### 2.1 Accéder au Test Setup

1. Naviguez vers `/test-setup`
2. Vous verrez l'écran "🧪 Test Setup"

### 2.2 Générer les données

1. Copiez le Squad ID d'une de vos squads :
   - Allez dans "Mes Squads"
   - Ouvrez une squad
   - L'URL contient le Squad ID (ex: `squad-detail?id=abc123`)
   - Copiez `abc123`

2. Retournez au Test Setup

3. Collez le Squad ID dans le champ

4. Cliquez sur "Générer les données de test"

5. Attendez la confirmation ✅

**Résultat attendu** :
```
✅ Environnement prêt !
- 10 sessions créées
- 10 notifications créées
Patterns :
- Mar 21h (5 sessions)
- Jeu 20h (3 sessions)
- Sam 18h (2 sessions)
```

---

## 🧪 ÉTAPE 3 : EXÉCUTER LES TESTS AUTOMATISÉS

### 3.1 Accéder au QA Tests Screen

1. Depuis Test Setup, cliquez sur "Tester Suggestions"
2. OU naviguez manuellement vers `/qa-tests`

### 3.2 Lancer les tests

1. Cliquez sur "Lancer tous les tests"
2. Observez les tests s'exécuter en temps réel
3. Chaque test affiche :
   - ✅ Vert = Passé
   - ❌ Rouge = Échoué
   - ⏳ Loader = En cours

**Résultat attendu** :
```
✅ Tous les tests passés (7/7)

Tests :
✅ Smart Suggestions - Affichage normal (285ms)
✅ Smart Suggestions - Empty state (150ms)
✅ Notifications - Liste affichée (220ms)
✅ Notifications - Mark as read (180ms)
✅ Heatmap - Génération matrice 7x24 (350ms)
✅ Heatmap - Valeurs normalisées (320ms)
✅ Members Stats - Batch loading (410ms)
```

---

## 🧪 ÉTAPE 4 : TESTS MANUELS DES ÉCRANS

### Test 4.1 : Smart Suggestions

**Navigation** : `Home` → `Intelligence IA` → `Suggestions`

**Steps** :
1. Vérifier l'affichage de 3 suggestions
2. Vérifier les badges (#1 Or, #2 Argent, #3 Bronze)
3. Vérifier le score de confiance (0-100%)
4. Cliquer sur "Créer cette session"
5. Vérifier que le formulaire est pré-rempli

**Résultat attendu** :
- Top suggestion : "Mardi à 21h" avec ~95% de confiance
- 2ème : "Jeudi à 20h" avec ~85% de confiance
- 3ème : "Samedi à 18h" avec ~75% de confiance

**Screenshot** :
```
┌──────────────────────────────────┐
│ ✨ Top 3 Créneaux Recommandés    │
├──────────────────────────────────┤
│ 🥇 #1 Mardi à 21h                │
│    95% confiance • 5 sessions    │
│    [Créer cette session]         │
├──────────────────────────────────┤
│ 🥈 #2 Jeudi à 20h                │
│    85% confiance • 3 sessions    │
│    [Créer cette session]         │
├──────────────────────────────────┤
│ 🥉 #3 Samedi à 18h               │
│    75% confiance • 2 sessions    │
│    [Créer cette session]         │
└──────────────────────────────────┘
```

---

### Test 4.2 : Notifications

**Navigation** : `Profile` → `Notifications` (icône bell)

**Steps** :
1. Vérifier la liste de 10 notifications
2. Vérifier le badge "3 non lues"
3. Vérifier les icônes dynamiques
4. Cliquer sur "Marquer comme lue" sur une notification non lue
5. Vérifier que la notification devient grise
6. Vérifier que le badge passe à "2 non lues"

**Résultat attendu** :
- 10 notifications affichées
- 3 avec background coloré (non lues)
- 7 avec background gris (lues)
- Time ago correct ("Il y a 2h", "Il y a 1j")
- Icônes : ✅ 🔔 🏆 ❌ selon le type

**Screenshot** :
```
┌──────────────────────────────────┐
│ Notifications        3 non lues  │
├──────────────────────────────────┤
│ 🔔 Nouveau vote                  │
│ Alex a voté OUI                  │
│ Il y a 2h  [Marquer comme lue]   │
├──────────────────────────────────┤
│ ✅ Session confirmée              │
│ Session Valorant confirmée       │
│ Il y a 5h                        │
├──────────────────────────────────┤
│ 🏆 Nouveau badge débloqué        │
│ Badge "Fiable" débloqué          │
│ Il y a 1j                        │
└──────────────────────────────────┘
```

---

### Test 4.3 : Availability Heatmap

**Navigation** : `Home` → `Intelligence IA` → `Heatmap`

**Steps** :
1. Vérifier la grille 7 jours × 24 heures
2. Vérifier les couleurs (gris → vert)
3. Identifier les cases vertes (Mardi 21h devrait être vert foncé)
4. Cliquer sur une case verte
5. Vérifier la redirection vers création de session

**Résultat attendu** :
- Grille complète affichée
- Case Mardi 21h = Vert foncé (100%)
- Case Jeudi 20h = Vert moyen (60-80%)
- Case Samedi 18h = Vert clair (40-60%)
- Autres cases = Gris (0%)

**Screenshot** :
```
        Dim Lun Mar Mer Jeu Ven Sam
00h     ⬜  ⬜  ⬜  ⬜  ⬜  ⬜  ⬜
01h     ⬜  ⬜  ⬜  ⬜  ⬜  ⬜  ⬜
...
18h     ⬜  ⬜  ⬜  ⬜  ⬜  ⬜  🟩
19h     ⬜  ⬜  ⬜  ⬜  ⬜  ⬜  ⬜
20h     ⬜  ⬜  ⬜  ⬜  🟩  ⬜  ⬜
21h     ⬜  ⬜  🟩  ⬜  ⬜  ⬜  ⬜
22h     ⬜  ⬜  ⬜  ⬜  ⬜  ⬜  ⬜
...
```

---

### Test 4.4 : Members Stats Optimisation

**Navigation** : `Home` → `Mes Squads` → Ouvrir une squad → Section "Membres"

**Steps** :
1. Ouvrir DevTools → Network tab
2. Recharger la squad
3. Vérifier qu'il y a 1 seul appel à `/members-stats`
4. Vérifier que les scores de fiabilité sont affichés
5. Comparer avec les vraies stats en allant sur le profil d'un membre

**Résultat attendu** :
- **AVANT** : N appels API (1 par membre) = Lent
- **APRÈS** : 1 seul appel API = Rapide ⚡
- Scores de fiabilité réels affichés (pas tous à 100%)
- Network tab montre 1 requête : `GET /squads/{id}/members-stats`

**Screenshot Network Tab** :
```
✅ APRÈS OPTIMISATION :
GET /squads/abc123/members-stats    410ms    200 OK

❌ AVANT (ce qu'on ne voit plus) :
GET /users/user1/stats    350ms    200 OK
GET /users/user2/stats    320ms    200 OK
GET /users/user3/stats    380ms    200 OK
GET /users/user4/stats    340ms    200 OK
GET /users/user5/stats    360ms    200 OK
```

---

## 📊 ÉTAPE 5 : VÉRIFIER LES PERFORMANCES

### 5.1 Temps de réponse API

Ouvrez DevTools → Network → Filtrer "make-server"

**Métriques attendues** :
- Smart Suggestions : < 500ms
- Notifications : < 300ms
- Heatmap : < 800ms
- Members Stats : < 500ms

### 5.2 Rendering frontend

Ouvrez DevTools → Performance → Enregistrer une navigation

**Métriques attendues** :
- First Contentful Paint : < 1s
- Time to Interactive : < 2s
- No layout shifts

---

## ✅ CRITÈRES DE SUCCÈS

| Critère | Status |
|---------|--------|
| Test Setup crée 10 sessions | ⏳ À VÉRIFIER |
| Test Setup crée 10 notifications | ⏳ À VÉRIFIER |
| Smart Suggestions affiche top 3 | ⏳ À VÉRIFIER |
| Suggestions pré-remplissent formulaire | ⏳ À VÉRIFIER |
| Notifications affichent badge count | ⏳ À VÉRIFIER |
| Mark as read fonctionne | ⏳ À VÉRIFIER |
| Heatmap affiche grille 7x24 | ⏳ À VÉRIFIER |
| Heatmap couleurs correctes | ⏳ À VÉRIFIER |
| Members Stats 1 requête (pas N) | ⏳ À VÉRIFIER |
| Members Stats scores réels | ⏳ À VÉRIFIER |
| Tous les tests auto passent (7/7) | ⏳ À VÉRIFIER |

---

## 🐛 SIGNALER UN BUG

Si vous trouvez un bug, notez :

1. **Titre** : Description courte
2. **Sévérité** : Critique / Majeur / Mineur
3. **Steps to reproduce** : 1, 2, 3...
4. **Expected** : Ce qui devrait se passer
5. **Actual** : Ce qui se passe réellement
6. **Screenshot** : Si applicable
7. **Console errors** : Copier les erreurs console

**Template** :
```markdown
## Bug #X : [Titre]

**Sévérité** : Majeur

**Steps** :
1. Aller sur Smart Suggestions
2. Cliquer sur suggestion #1
3. Observer le formulaire

**Expected** : Formulaire pré-rempli avec Mardi 21h

**Actual** : Formulaire vide

**Screenshot** : [capture d'écran]

**Console** :
```
TypeError: Cannot read property 'day' of undefined
  at SmartSuggestionsScreen.tsx:45
```
```

---

## 📈 APRÈS LES TESTS

Une fois tous les tests effectués :

1. ✅ Compléter la checklist ci-dessus
2. ✅ Noter tous les bugs trouvés
3. ✅ Créer un rapport final
4. ✅ Corriger les bugs critiques
5. ✅ Re-tester après corrections
6. ✅ Valider pour production

---

## 🎯 DÉPLOIEMENT

Quand tout est validé :

```bash
# 1. Deploy backend
cd supabase
supabase functions deploy make-server-e884809f

# 2. Build frontend
npm run build

# 3. Deploy frontend
vercel --prod

# 4. Run smoke tests
npm run test:e2e
```

---

**🧪 HAPPY TESTING !**

**Les tests QA sont la dernière ligne de défense avant production. Prenez votre temps et testez à fond !** 🚀
