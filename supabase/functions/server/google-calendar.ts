// Google Calendar API Integration
import { OAUTH_CONFIG } from './oauth-config.ts';

export interface CalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{ email: string }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{ method: string; minutes: number }>;
  };
}

/**
 * Create a Google Calendar event
 */
export async function createCalendarEvent(
  accessToken: string,
  event: CalendarEvent
): Promise<any> {
  try {
    const response = await fetch(
      `${OAUTH_CONFIG.google.calendarUrl}/calendars/primary/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to create calendar event:', error);
      throw new Error(`Failed to create calendar event: ${error}`);
    }

    const data = await response.json();
    console.log('✅ Calendar event created:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Error creating calendar event:', error);
    throw error;
  }
}

/**
 * Update a Google Calendar event
 */
export async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  event: CalendarEvent
): Promise<any> {
  try {
    const response = await fetch(
      `${OAUTH_CONFIG.google.calendarUrl}/calendars/primary/events/${eventId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to update calendar event:', error);
      throw new Error(`Failed to update calendar event: ${error}`);
    }

    const data = await response.json();
    console.log('✅ Calendar event updated:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Error updating calendar event:', error);
    throw error;
  }
}

/**
 * Delete a Google Calendar event
 */
export async function deleteCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  try {
    const response = await fetch(
      `${OAUTH_CONFIG.google.calendarUrl}/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok && response.status !== 410) { // 410 = already deleted
      const error = await response.text();
      console.error('❌ Failed to delete calendar event:', error);
      throw new Error(`Failed to delete calendar event: ${error}`);
    }

    console.log('✅ Calendar event deleted:', eventId);
  } catch (error) {
    console.error('❌ Error deleting calendar event:', error);
    throw error;
  }
}

/**
 * List upcoming calendar events
 */
export async function listCalendarEvents(
  accessToken: string,
  maxResults: number = 10
): Promise<any[]> {
  try {
    const now = new Date().toISOString();
    const params = new URLSearchParams({
      timeMin: now,
      maxResults: maxResults.toString(),
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    const response = await fetch(
      `${OAUTH_CONFIG.google.calendarUrl}/calendars/primary/events?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to list calendar events:', error);
      throw new Error(`Failed to list calendar events: ${error}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('❌ Error listing calendar events:', error);
    throw error;
  }
}

/**
 * Check if user has free time slots
 */
export async function getFreeBusy(
  accessToken: string,
  timeMin: string,
  timeMax: string
): Promise<any> {
  try {
    const response = await fetch(
      `${OAUTH_CONFIG.google.calendarUrl}/freeBusy`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeMin,
          timeMax,
          items: [{ id: 'primary' }],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to get free/busy:', error);
      throw new Error(`Failed to get free/busy: ${error}`);
    }

    const data = await response.json();
    return data.calendars?.primary || {};
  } catch (error) {
    console.error('❌ Error getting free/busy:', error);
    throw error;
  }
}
