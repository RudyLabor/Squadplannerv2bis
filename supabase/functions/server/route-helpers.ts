// Utility functions for routes
import * as kv from "./kv_store.tsx";

/**
 * Trigger webhooks for a user event
 */
export async function triggerWebhooks(userId: string, eventType: string, payload: any) {
  try {
    const webhooks = await kv.getByPrefix(`webhook:${userId}:`);
    
    for (const webhook of webhooks) {
      if (webhook.events.includes(eventType) && webhook.active) {
        // Send webhook (fire and forget)
        fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Squad-Planner-Event': eventType,
          },
          body: JSON.stringify(payload),
        }).catch(error => {
          console.error(`Webhook error for ${webhook.url}:`, error);
        });
      }
    }
  } catch (error) {
    console.error('Trigger webhooks error:', error);
  }
}

/**
 * Schedule push notifications for a session
 */
export async function schedulePushNotifications(session: any) {
  // TODO: Implement push notification scheduling
  console.log(`Scheduling push notifications for session ${session.id}`);
}

/**
 * Calculate reliability badges based on stats
 */
export function calculateBadges(stats: any) {
  const badges = [];
  
  if (stats.reliabilityScore >= 95) {
    badges.push({ id: 'diamond', name: 'Diamant', icon: '💎' });
  } else if (stats.reliabilityScore >= 85) {
    badges.push({ id: 'gold', name: 'Or', icon: '🏆' });
  } else if (stats.reliabilityScore >= 75) {
    badges.push({ id: 'silver', name: 'Argent', icon: '🥈' });
  }
  
  if (stats.totalSessions >= 100) {
    badges.push({ id: 'veteran', name: 'Vétéran', icon: '⭐' });
  } else if (stats.totalSessions >= 50) {
    badges.push({ id: 'experienced', name: 'Expérimenté', icon: '🌟' });
  }
  
  if (stats.attendedSessions >= 10 && stats.attendedSessions === stats.totalSessions) {
    badges.push({ id: 'perfect', name: 'Parfait', icon: '✨' });
  }
  
  return badges;
}
