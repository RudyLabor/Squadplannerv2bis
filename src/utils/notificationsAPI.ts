import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e884809f`;

export interface NotificationSettings {
  sessionReminder: boolean;
  squadInvite: boolean;
  newMessage: boolean;
  achievementUnlocked: boolean;
  friendRequest: boolean;
  sessionStarting: boolean;
  weeklyRecap: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

export const notificationsAPI = {
  // Get user notification settings
  async getNotificationSettings(accessToken: string): Promise<NotificationSettings> {
    const response = await fetch(`${API_URL}/user/notification-settings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get notification settings');
    }

    const data = await response.json();
    return data.settings;
  },

  // Save user notification settings
  async saveNotificationSettings(
    accessToken: string,
    settings: NotificationSettings
  ): Promise<{ settings: NotificationSettings; message: string }> {
    const response = await fetch(`${API_URL}/user/notification-settings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ settings }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save notification settings');
    }

    return await response.json();
  },
};
