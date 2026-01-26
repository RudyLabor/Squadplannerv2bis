# 🧪 Test JWT Token - Diagnostic

## Test Rapide dans Console Browser

Copiez-collez ce code dans la console DevTools (F12) après vous être connecté :

```javascript
// Test 1: Vérifier si une session existe
const { data: sessionData, error: sessionError } = await window.supabase.auth.getSession();

console.log('=== SESSION TEST ===');
console.log('Has session:', !!sessionData?.session);
console.log('Has user:', !!sessionData?.session?.user);
console.log('User email:', sessionData?.session?.user?.email);
console.log('Has access token:', !!sessionData?.session?.access_token);
console.log('Token length:', sessionData?.session?.access_token?.length);
console.log('Token preview:', sessionData?.session?.access_token?.substring(0, 30) + '...');
console.log('Expires at:', sessionData?.session?.expires_at 
  ? new Date(sessionData.session.expires_at * 1000).toLocaleString()
  : 'N/A');
console.log('Error:', sessionError);

// Test 2: Essayer d'appeler l'API squads
const token = sessionData?.session?.access_token;

if (token) {
  console.log('\n=== API CALL TEST ===');
  
  const response = await fetch(
    'https://cwtoprbowdqcemdjrtir.supabase.co/functions/v1/make-server-e884809f/squads',
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const data = await response.json();
  
  console.log('Response status:', response.status);
  console.log('Response OK:', response.ok);
  console.log('Response data:', data);
  
  if (!response.ok) {
    console.error('❌ API ERROR:', data);
  } else {
    console.log('✅ API SUCCESS:', data.squads?.length, 'squads');
  }
}

// Test 3: Vérifier le format du token JWT
if (token) {
  console.log('\n=== TOKEN FORMAT TEST ===');
  
  const parts = token.split('.');
  console.log('Token parts count:', parts.length, '(should be 3)');
  
  if (parts.length === 3) {
    try {
      // Decode header
      const header = JSON.parse(atob(parts[0]));
      console.log('Token header:', header);
      
      // Decode payload
      const payload = JSON.parse(atob(parts[1]));
      console.log('Token payload:', {
        iss: payload.iss,
        sub: payload.sub,
        aud: payload.aud,
        role: payload.role,
        exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'N/A',
        iat: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : 'N/A'
      });
      
      // Check if expired
      const now = Date.now() / 1000;
      console.log('Is expired:', payload.exp < now);
    } catch (e) {
      console.error('❌ Failed to decode token:', e);
    }
  }
}
```

---

## Résultats Attendus

### ✅ SESSION VALIDE

```
=== SESSION TEST ===
Has session: true
Has user: true
User email: shadow.ninja@squadplanner.demo
Has access token: true
Token length: 400-500 (varie)
Token preview: eyJhbGciOiJIUzI1NiIsInR5cCI6...
Expires at: [date dans le futur]
Error: null
```

### ✅ API CALL SUCCESS

```
=== API CALL TEST ===
Response status: 200
Response OK: true
Response data: { squads: [...] }
✅ API SUCCESS: 2 squads
```

### ✅ TOKEN FORMAT VALID

```
=== TOKEN FORMAT TEST ===
Token parts count: 3 (should be 3)
Token header: { alg: 'HS256', typ: 'JWT' }
Token payload: {
  iss: 'https://cwtoprbowdqcemdjrtir.supabase.co/auth/v1',
  sub: '[user-id]',
  aud: 'authenticated',
  role: 'authenticated',
  exp: '[future date]',
  iat: '[past date]'
}
Is expired: false
```

---

## ❌ Problèmes Courants

### Problème 1: "Has session: false"

**Cause:** Pas connecté ou session expirée.

**Solution:**

```javascript
// Se reconnecter
await window.supabase.auth.signInWithPassword({
  email: 'shadow.ninja@squadplanner.demo',
  password: 'Demo1234!'
});

// Re-exécuter les tests
```

### Problème 2: "Response status: 401"

**Cause:** Token non reconnu par le backend.

**Possible reasons:**

1. **Backend pas déployé** → Voir `DEPLOY_FIX_NOW.md`
2. **Token expiré** → `Is expired: true` dans test 3
3. **Mauvaise configuration Supabase** → Vérifier project ID et keys

**Solution:**

```javascript
// Refresh la session
const { data, error } = await window.supabase.auth.refreshSession();
console.log('Session refreshed:', !!data.session);

// Re-exécuter les tests
```

### Problème 3: "Token parts count: 1 ou 2"

**Cause:** Token malformé.

**Solution:**

```javascript
// Clear auth storage
localStorage.clear();
sessionStorage.clear();

// Reload page
location.reload();

// Re-login
```

### Problème 4: "Is expired: true"

**Cause:** Token JWT expiré.

**Solution:**

```javascript
// Auto-refresh devrait se déclencher
const { data } = await window.supabase.auth.refreshSession();
console.log('New token:', data.session?.access_token?.substring(0, 30));

// Re-exécuter les tests
```

---

## 🔍 Tests Avancés

### Test Backend Logs

```javascript
// Appeler l'API et immédiatement vérifier les logs Supabase
const token = await window.supabase.auth.getSession()
  .then(({ data }) => data.session?.access_token);

console.log('Calling API with token:', token?.substring(0, 30) + '...');

fetch(
  'https://cwtoprbowdqcemdjrtir.supabase.co/functions/v1/make-server-e884809f/squads',
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
).then(r => r.json()).then(console.log);

// Maintenant aller sur Supabase → Edge Functions → Logs
// Chercher:
// ✅ "🔐 === AUTH DEBUG START ==="
// ✅ "🔑 Token extracted: { length: 400, ... }"
// ✅ "✅ User authenticated: [user-id]"
// OU
// ❌ "❌ JWT verification FAILED"
```

### Test Token avec Different Accounts

```javascript
// Test avec plusieurs comptes demo
const testAccounts = [
  { email: 'shadow.ninja@squadplanner.demo', password: 'Demo1234!' },
  { email: 'frost.mage@squadplanner.demo', password: 'Demo1234!' },
  { email: 'thunder.warrior@squadplanner.demo', password: 'Demo1234!' }
];

for (const account of testAccounts) {
  console.log(`\n=== Testing ${account.email} ===`);
  
  // Sign in
  const { data, error } = await window.supabase.auth.signInWithPassword(account);
  
  if (error) {
    console.error('❌ Login failed:', error.message);
    continue;
  }
  
  console.log('✅ Logged in:', data.user.email);
  
  // Test API
  const response = await fetch(
    'https://cwtoprbowdqcemdjrtir.supabase.co/functions/v1/make-server-e884809f/squads',
    {
      headers: {
        'Authorization': `Bearer ${data.session.access_token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const apiData = await response.json();
  
  if (response.ok) {
    console.log('✅ API works:', apiData.squads?.length, 'squads');
  } else {
    console.error('❌ API failed:', apiData);
  }
  
  // Sign out
  await window.supabase.auth.signOut();
}
```

---

## 📊 Diagnostic Rapide

| Symptôme | Cause Probable | Solution |
|----------|----------------|----------|
| `Has session: false` | Pas connecté | Se reconnecter |
| `Response status: 401` | Backend rejette le JWT | Vérifier déploiement backend |
| `Token parts count: != 3` | Token malformé | Clear storage + reload |
| `Is expired: true` | Token expiré | Refresh session |
| `Response status: 500` | Erreur serveur | Vérifier logs Supabase |
| `Error: Network error` | Supabase down ou CORS | Vérifier Supabase status |

---

## ✅ Si Tout Fonctionne

Vous devriez voir:

```
=== SESSION TEST ===
Has session: true ✅
Has user: true ✅
Has access token: true ✅
Token length: 450 ✅

=== API CALL TEST ===
Response status: 200 ✅
✅ API SUCCESS: 2 squads ✅

=== TOKEN FORMAT TEST ===
Token parts count: 3 ✅
Is expired: false ✅
```

**→ Le problème "Invalid JWT" est alors résolu ! 🎉**

---

## 💡 Astuce: Ajouter au Console Snippets

Dans Chrome DevTools:
1. Sources → Snippets → + New snippet
2. Coller le test complet
3. Nommer: "Test JWT Token"
4. Run (Ctrl+Enter) à tout moment pour diagnostiquer

---

**Utilisation:** Exécuter avant et après déploiement pour comparer
**Temps:** 30 secondes
**Requires:** Session active (connecté)
