/**
 * Web Push Notifications Manager
 * Handles push notification subscriptions and permissions
 */

import { supabase } from '@/lib/supabase';

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const pushNotifications = {
  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  },

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Push notifications not supported');
    }

    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      await this.subscribeToPush();
    }

    return permission;
  },

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(): Promise<PushSubscription> {
    if (!this.isSupported()) {
      throw new Error('Push notifications not supported');
    }

    // Register service worker if not already registered
    let registration = await navigator.serviceWorker.getRegistration();

    if (!registration) {
      registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
    }

    // Get existing subscription or create new one
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Get VAPID public key from environment
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

      if (!vapidPublicKey) {
        console.warn('VAPID public key not configured');
        throw new Error('Push notifications not configured');
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
    }

    // Store subscription in database
    await this.storeSubscription(subscription);

    return subscription;
  },

  /**
   * Store push subscription in Supabase
   */
  async storeSubscription(subscription: PushSubscription): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const subscriptionData = subscription.toJSON();

    await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        endpoint: subscriptionData.endpoint,
        p256dh_key: subscriptionData.keys?.p256dh,
        auth_key: subscriptionData.keys?.auth,
        is_active: true,
      }, {
        onConflict: 'user_id',
      });
  },

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<void> {
    if (!this.isSupported()) return;

    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }
    }

    // Remove from database
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .eq('user_id', user.id);
    }
  },

  /**
   * Check if user is subscribed
   */
  async isSubscribed(): Promise<boolean> {
    if (!this.isSupported()) return false;

    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration) return false;

    const subscription = await registration.pushManager.getSubscription();

    return subscription !== null;
  },

  /**
   * Send a test notification (requires backend support)
   */
  async sendTestNotification(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // This would call a backend endpoint to send the notification
    // For now, just show a browser notification
    if (this.getPermissionStatus() === 'granted') {
      new Notification('Squad Planner', {
        body: 'Les notifications push sont activées !',
        icon: '/logo.png',
        badge: '/badge.png',
        tag: 'test-notification',
      });
    }
  },
};

export default pushNotifications;
