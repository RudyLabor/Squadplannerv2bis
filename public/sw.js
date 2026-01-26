// Squad Planner Service Worker - Web Push Notifications

// Service Worker version - increment to force update
const SW_VERSION = 'v1.0.0';
const CACHE_NAME = `squad-planner-${SW_VERSION}`;

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...', SW_VERSION);
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...', SW_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);

  let notification = {
    title: 'Squad Planner',
    body: 'Nouvelle notification',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'default',
    requireInteraction: false,
    data: {},
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      notification = {
        ...notification,
        ...payload,
      };
    } catch (e) {
      console.error('[SW] Error parsing push data:', e);
      notification.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon,
      badge: notification.badge,
      tag: notification.tag,
      requireInteraction: notification.requireInteraction,
      data: notification.data,
      vibrate: [200, 100, 200],
      actions: notification.actions || [],
    })
  );
});

// Notification click event - handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Try to focus existing window
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
