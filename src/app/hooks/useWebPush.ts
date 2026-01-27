import { useState, useEffect } from 'react';
import { projectId } from '@/utils/supabase/info';

export function useWebPush(accessToken: string | null) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if Web Push is supported
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  // Check if user is already subscribed
  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        setSubscription(existingSubscription);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  // Subscribe to push notifications
  const subscribe = async (): Promise<boolean> => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    setLoading(true);

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Get VAPID public key from server
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e884809f/push/vapid-public-key`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get VAPID public key');
      }

      const { publicKey } = await response.json();

      // Subscribe to push
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });

      // Save subscription to server
      const saveResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e884809f/push/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            subscription: pushSubscription.toJSON(),
          }),
        }
      );

      if (!saveResponse.ok) {
        throw new Error('Failed to save subscription');
      }

      setSubscription(pushSubscription);
      setIsSubscribed(true);
      
      return true;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Unsubscribe from push notifications
  const unsubscribe = async (): Promise<boolean> => {
    if (!accessToken || !subscription) {
      return false;
    }

    setLoading(true);

    try {
      // Unsubscribe from push manager
      await subscription.unsubscribe();

      // Delete subscription from server
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e884809f/push/unsubscribe`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      setSubscription(null);
      setIsSubscribed(false);
      
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Request permission and subscribe
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        return await subscribe();
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  return {
    isSupported,
    isSubscribed,
    loading,
    subscribe,
    unsubscribe,
    requestPermission,
  };
}

// Utility function to convert base64 string to Uint8Array
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
