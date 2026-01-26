# 🔄 GUIDE DE MIGRATION - OPTIMISATION DES ÉCRANS EXISTANTS

## 📋 CHECKLIST PAR ÉCRAN

Pour chaque écran à optimiser, suivre ces étapes :

### ✅ Étape 1 : Ajouter le monitoring
```diff
+ import { usePerformanceMonitor } from '@/app/hooks/usePerformanceMonitor';

export function MyScreen() {
+  usePerformanceMonitor('MyScreen');
  
  // ... rest of code
}
```

### ✅ Étape 2 : Identifier les fetches
Chercher tous les appels réseau :
- `fetch()`
- `supabase.from().select()`
- API calls quelconques

### ✅ Étape 3 : Remplacer par useOptimizedFetch

**AVANT :**
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    setLoading(true);
    const result = await fetch('/api/squads').then(r => r.json());
    setData(result);
    setLoading(false);
  }
  fetchData();
}, []);
```

**APRÈS :**
```typescript
import { useOptimizedFetch } from '@/app/hooks/useOptimizedFetch';
import { CacheTTL } from '@/app/utils/cache';

const { data, loading, error } = useOptimizedFetch(
  () => fetch('/api/squads').then(r => r.json()),
  {
    cacheKey: 'squads-list',
    ttl: CacheTTL.MEDIUM,
    screenName: 'MyScreen',
  }
);
```

### ✅ Étape 4 : Batch des fetches multiples

**AVANT :**
```typescript
const [squads, setSquads] = useState([]);
const [sessions, setSessions] = useState([]);
const [stats, setStats] = useState({});

useEffect(() => {
  // 3 fetches séquentiels ❌
  fetchSquads().then(setSquads);
  fetchSessions().then(setSessions);
  fetchStats().then(setStats);
}, []);
```

**APRÈS :**
```typescript
import { useBatchFetch } from '@/app/hooks/useOptimizedFetch';

const { data, loading } = useBatchFetch(
  {
    squads: fetchSquads,
    sessions: fetchSessions,
    stats: fetchStats,
  },
  { screenName: 'MyScreen' }
);

// Utiliser data.squads, data.sessions, data.stats
```

### ✅ Étape 5 : Mémoïser les callbacks

**AVANT :**
```typescript
<Button onClick={() => handleClick(item.id)} />
```

**APRÈS :**
```typescript
import { useCallback } from 'react';

const handleClick = useCallback((id: number) => {
  // logic
}, [/* dependencies */]);

<Button onClick={() => handleClick(item.id)} />
```

### ✅ Étape 6 : Mémoïser les computed values

**AVANT :**
```typescript
const filteredItems = items.filter(i => i.active); // Recalculé à chaque render ❌
```

**APRÈS :**
```typescript
import { useMemo } from 'react';

const filteredItems = useMemo(
  () => items.filter(i => i.active),
  [items]
);
```

### ✅ Étape 7 : Utiliser composants mémoïsés pour listes

**AVANT :**
```typescript
{squads.map(squad => (
  <SquadCard key={squad.id} squad={squad} onClick={handleClick} />
))}
```

**APRÈS :**
```typescript
import { MemoizedSquadCard } from '@/app/components/optimized/MemoizedSquadCard';

{squads.map((squad, index) => (
  <MemoizedSquadCard
    key={squad.id}
    squad={squad}
    onClick={handleClick}
    index={index}
  />
))}
```

### ✅ Étape 8 : Virtualiser les longues listes (> 50 items)

**AVANT :**
```typescript
<div className="space-y-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

**APRÈS :**
```typescript
import { VirtualizedList } from '@/app/components/optimized/VirtualizedList';

<VirtualizedList
  items={items}
  height={600}
  itemHeight={100}
  renderItem={(item, index) => <Card key={item.id} {...item} />}
/>
```

### ✅ Étape 9 : Optimistic updates pour actions

**AVANT :**
```typescript
const handleRSVP = async () => {
  setLoading(true);
  await api.updateRSVP('confirmed');
  const newData = await api.fetchSession();
  setData(newData);
  setLoading(false);
};
```

**APRÈS :**
```typescript
import { useOptimisticUpdate } from '@/app/hooks/useOptimizedFetch';

const { data, update, isUpdating } = useOptimisticUpdate(
  initialData,
  async (newData) => api.updateRSVP(newData),
  {
    screenName: 'MyScreen',
    onSuccess: () => showToast('Confirmé !'),
  }
);

const handleRSVP = () => update({ status: 'confirmed' });
```

---

## 📊 EXEMPLE DE MIGRATION COMPLÈTE

### AVANT (Non optimisé)

```typescript
import { useState, useEffect } from 'react';

export function SquadsScreen() {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function loadSquads() {
      setLoading(true);
      const data = await fetch('/api/squads').then(r => r.json());
      setSquads(data);
      setLoading(false);
    }
    loadSquads();
  }, []);

  const filteredSquads = squads.filter(s => 
    filter === 'all' ? true : s.isActive
  );

  return (
    <div>
      {loading && <Loader />}
      {filteredSquads.map(squad => (
        <SquadCard
          key={squad.id}
          squad={squad}
          onClick={() => navigate(squad.id)}
        />
      ))}
    </div>
  );
}
```

**Problèmes** :
- ❌ Pas de monitoring
- ❌ Pas de cache
- ❌ Fetch manuel
- ❌ Filter recalculé à chaque render
- ❌ onClick crée nouvelle fonction à chaque render
- ❌ SquadCard re-render à chaque fois

---

### APRÈS (Optimisé)

```typescript
import { useState, useCallback, useMemo } from 'react';
import { usePerformanceMonitor } from '@/app/hooks/usePerformanceMonitor';
import { useOptimizedFetch } from '@/app/hooks/useOptimizedFetch';
import { CacheTTL } from '@/app/utils/cache';
import { MemoizedSquadCard } from '@/app/components/optimized/MemoizedSquadCard';

export function SquadsScreen({ onNavigate }) {
  // ✅ 1. Performance monitoring
  usePerformanceMonitor('SquadsScreen');

  // ✅ 2. Optimized fetch avec cache
  const { data: squads, loading } = useOptimizedFetch(
    () => fetch('/api/squads').then(r => r.json()),
    {
      cacheKey: 'squads-list',
      ttl: CacheTTL.MEDIUM,
      screenName: 'SquadsScreen',
    }
  );

  const [filter, setFilter] = useState('all');

  // ✅ 3. Memoized callback
  const handleSquadClick = useCallback((squadId: number) => {
    onNavigate('squad-detail', { id: squadId });
  }, [onNavigate]);

  // ✅ 4. Memoized computed value
  const filteredSquads = useMemo(
    () => (squads || []).filter(s => filter === 'all' ? true : s.isActive),
    [squads, filter]
  );

  if (loading) return <Loader />;

  return (
    <div>
      {/* ✅ 5. Composants mémoïsés */}
      {filteredSquads.map((squad, index) => (
        <MemoizedSquadCard
          key={squad.id}
          squad={squad}
          onClick={handleSquadClick}
          index={index}
        />
      ))}
    </div>
  );
}
```

**Gains** :
- ✅ Performance monitoring actif
- ✅ Cache avec TTL (pas de refetch inutile)
- ✅ Stale-while-revalidate (UX fluide)
- ✅ Filter mémoïsé (pas de recalcul inutile)
- ✅ Callback stable (pas de re-création)
- ✅ Composants mémoïsés (re-renders optimaux)

---

## 🎯 ORDRE DE PRIORITÉ DES ÉCRANS

### P0 - Critiques (à faire en premier)
1. **HomeScreen** ✅ FAIT
2. **SquadDetailScreen** ✅ FAIT
3. **ProfileScreen** ✅ FAIT
4. **SquadsScreen** ✅ FAIT

### P1 - Importants
5. SessionsScreen
6. ProposeSessionScreen
7. SquadChatScreen
8. VoteSessionScreen

### P2 - Nice to have
9. Tous les autres écrans

---

## 📈 MESURER LES GAINS

### Avant migration
1. Activer monitoring (5 clics logo)
2. Naviguer sur l'écran
3. Noter les métriques :
   - Render time : ___ ms
   - Re-renders : ___
   - Network calls : ___
   - Avg network : ___ ms

### Après migration
1. Naviguer sur l'écran optimisé
2. Comparer les métriques
3. Objectif :
   - Render time : -30% minimum
   - Re-renders : -50% minimum
   - Network calls : -60% minimum

---

## ⚠️ PIÈGES À ÉVITER

### 1. Cache key dupliqué
```typescript
// ❌ MAUVAIS : même key pour données différentes
useOptimizedFetch(fetchSquads, { cacheKey: 'data' })
useOptimizedFetch(fetchSessions, { cacheKey: 'data' })

// ✅ BON : keys uniques
useOptimizedFetch(fetchSquads, { cacheKey: 'squads-list' })
useOptimizedFetch(fetchSessions, { cacheKey: 'sessions-list' })
```

### 2. Dependencies manquantes
```typescript
// ❌ MAUVAIS
const filtered = useMemo(() => items.filter(i => i.id === selectedId), [items]);
// selectedId change mais pas de re-calcul !

// ✅ BON
const filtered = useMemo(() => items.filter(i => i.id === selectedId), [items, selectedId]);
```

### 3. Callback qui crée closure
```typescript
// ❌ MAUVAIS
const handleClick = useCallback(() => {
  console.log(data); // data capturé, callback jamais mis à jour
}, []); // deps vide !

// ✅ BON
const handleClick = useCallback(() => {
  console.log(data);
}, [data]); // data dans deps
```

### 4. Mémoïser trop tôt
```typescript
// ❌ INUTILE : valeur primitive, pas besoin de memo
const text = useMemo(() => "Hello", []);

// ❌ INUTILE : calcul trivial
const doubled = useMemo(() => count * 2, [count]);

// ✅ BON : calcul lourd
const filtered = useMemo(() => 
  largeArray.filter(complexCondition).map(heavyTransform),
  [largeArray]
);
```

---

## 🏁 CHECKLIST FINALE PAR ÉCRAN

- [ ] `usePerformanceMonitor` ajouté
- [ ] Fetches remplacés par `useOptimizedFetch`
- [ ] Fetches multiples batchés avec `useBatchFetch`
- [ ] Callbacks wrappés dans `useCallback`
- [ ] Computed values dans `useMemo`
- [ ] Composants de liste mémoïsés
- [ ] Listes longues virtualisées
- [ ] Actions avec `useOptimisticUpdate`
- [ ] Testé avec monitoring actif
- [ ] Métriques 🟢 vertes

---

**Bon courage ! 💪**
