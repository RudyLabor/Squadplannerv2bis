/**
 * ICS Calendar File Generator
 *
 * Generates .ics files for exporting sessions to Google Calendar, Apple Calendar, Outlook, etc.
 * Follows the iCalendar specification (RFC 5545)
 */

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM:SS or HH:MM
  duration?: number; // in minutes
  endDate?: string;
  endTime?: string;
  organizer?: {
    name: string;
    email?: string;
  };
  attendees?: Array<{
    name: string;
    email?: string;
    status?: 'accepted' | 'declined' | 'tentative';
  }>;
  reminder?: number; // minutes before event
  url?: string;
  categories?: string[];
}

/**
 * Escape special characters in ICS text
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Format date/time for ICS (UTC format)
 */
function formatICSDateTime(date: string, time: string): string {
  // Ensure time has seconds
  const timeParts = time.split(':');
  const hours = timeParts[0].padStart(2, '0');
  const minutes = (timeParts[1] || '00').padStart(2, '0');
  const seconds = (timeParts[2] || '00').padStart(2, '0');

  // Format: YYYYMMDDTHHMMSS
  const dateParts = date.split('-');
  return `${dateParts[0]}${dateParts[1]}${dateParts[2]}T${hours}${minutes}${seconds}`;
}

/**
 * Generate a unique UID for the event
 */
function generateUID(eventId: string): string {
  return `${eventId}@squadplanner.app`;
}

/**
 * Calculate end time based on start time and duration
 */
function calculateEndDateTime(startDate: string, startTime: string, durationMinutes: number): { date: string; time: string } {
  const [year, month, day] = startDate.split('-').map(Number);
  const [hours, minutes] = startTime.split(':').map(Number);

  const startDateTime = new Date(year, month - 1, day, hours, minutes);
  startDateTime.setMinutes(startDateTime.getMinutes() + durationMinutes);

  const endDate = `${startDateTime.getFullYear()}-${String(startDateTime.getMonth() + 1).padStart(2, '0')}-${String(startDateTime.getDate()).padStart(2, '0')}`;
  const endTime = `${String(startDateTime.getHours()).padStart(2, '0')}:${String(startDateTime.getMinutes()).padStart(2, '0')}:00`;

  return { date: endDate, time: endTime };
}

/**
 * Generate a single VEVENT component
 */
function generateVEvent(event: CalendarEvent): string {
  const lines: string[] = [];

  // Calculate end time if not provided
  let endDate = event.endDate;
  let endTime = event.endTime;
  if (!endDate || !endTime) {
    const endDateTime = calculateEndDateTime(
      event.startDate,
      event.startTime,
      event.duration || 120 // Default 2 hours
    );
    endDate = endDateTime.date;
    endTime = endDateTime.time;
  }

  lines.push('BEGIN:VEVENT');
  lines.push(`UID:${generateUID(event.id)}`);
  lines.push(`DTSTAMP:${formatICSDateTime(new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[1].slice(0, 8))}Z`);
  lines.push(`DTSTART:${formatICSDateTime(event.startDate, event.startTime)}`);
  lines.push(`DTEND:${formatICSDateTime(endDate, endTime)}`);
  lines.push(`SUMMARY:${escapeICSText(event.title)}`);

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICSText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICSText(event.location)}`);
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  if (event.organizer) {
    const organizerLine = event.organizer.email
      ? `ORGANIZER;CN=${escapeICSText(event.organizer.name)}:mailto:${event.organizer.email}`
      : `ORGANIZER;CN=${escapeICSText(event.organizer.name)}:`;
    lines.push(organizerLine);
  }

  if (event.attendees && event.attendees.length > 0) {
    event.attendees.forEach(attendee => {
      const partstat = attendee.status === 'accepted' ? 'ACCEPTED'
        : attendee.status === 'declined' ? 'DECLINED'
        : attendee.status === 'tentative' ? 'TENTATIVE'
        : 'NEEDS-ACTION';

      const attendeeLine = attendee.email
        ? `ATTENDEE;CN=${escapeICSText(attendee.name)};PARTSTAT=${partstat}:mailto:${attendee.email}`
        : `ATTENDEE;CN=${escapeICSText(attendee.name)};PARTSTAT=${partstat}:`;
      lines.push(attendeeLine);
    });
  }

  if (event.categories && event.categories.length > 0) {
    lines.push(`CATEGORIES:${event.categories.map(escapeICSText).join(',')}`);
  }

  // Add reminder (alarm)
  if (event.reminder) {
    lines.push('BEGIN:VALARM');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:${escapeICSText(event.title)} commence bientôt !`);
    lines.push(`TRIGGER:-PT${event.reminder}M`);
    lines.push('END:VALARM');
  }

  lines.push('END:VEVENT');

  return lines.join('\r\n');
}

/**
 * Generate a complete ICS file content
 */
export function generateICSContent(events: CalendarEvent[], calendarName: string = 'Squad Planner'): string {
  const lines: string[] = [];

  // Calendar header
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Squad Planner//Squad Planner v2.0//FR');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');
  lines.push(`X-WR-CALNAME:${escapeICSText(calendarName)}`);
  lines.push('X-WR-TIMEZONE:Europe/Paris');

  // Timezone definition
  lines.push('BEGIN:VTIMEZONE');
  lines.push('TZID:Europe/Paris');
  lines.push('BEGIN:DAYLIGHT');
  lines.push('TZOFFSETFROM:+0100');
  lines.push('TZOFFSETTO:+0200');
  lines.push('TZNAME:CEST');
  lines.push('DTSTART:19700329T020000');
  lines.push('RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU');
  lines.push('END:DAYLIGHT');
  lines.push('BEGIN:STANDARD');
  lines.push('TZOFFSETFROM:+0200');
  lines.push('TZOFFSETTO:+0100');
  lines.push('TZNAME:CET');
  lines.push('DTSTART:19701025T030000');
  lines.push('RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU');
  lines.push('END:STANDARD');
  lines.push('END:VTIMEZONE');

  // Add all events
  events.forEach(event => {
    lines.push(generateVEvent(event));
  });

  // Calendar footer
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Convert a Squad Planner session to a CalendarEvent
 */
export function sessionToCalendarEvent(session: {
  id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  scheduled_time: string;
  duration?: number | string;
  squad?: { name?: string };
  proposed_by_user?: { username?: string; display_name?: string; email?: string };
  rsvps?: Array<{
    response: string;
    user: { username?: string; display_name?: string; email?: string };
  }>;
}): CalendarEvent {
  // Parse duration
  let durationMinutes = 120; // Default 2 hours
  if (session.duration) {
    if (typeof session.duration === 'number') {
      durationMinutes = session.duration;
    } else if (typeof session.duration === 'string') {
      // Handle formats like "2 hours", "90 minutes", "2h", etc.
      const match = session.duration.match(/(\d+)\s*(h|hour|hours|min|minute|minutes)?/i);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2]?.toLowerCase() || 'h';
        if (unit.startsWith('h')) {
          durationMinutes = value * 60;
        } else {
          durationMinutes = value;
        }
      }
    }
  }

  // Build attendees list from RSVPs
  const attendees = session.rsvps?.map(rsvp => ({
    name: rsvp.user.display_name || rsvp.user.username || 'Membre',
    email: rsvp.user.email,
    status: rsvp.response === 'yes' ? 'accepted' as const
      : rsvp.response === 'no' ? 'declined' as const
      : 'tentative' as const,
  })) || [];

  return {
    id: session.id,
    title: `🎮 ${session.title}`,
    description: [
      session.description || '',
      '',
      session.squad?.name ? `Squad: ${session.squad.name}` : '',
      '',
      'Session planifiée via Squad Planner',
      'https://squadplanner.app',
    ].filter(Boolean).join('\\n'),
    startDate: session.scheduled_date,
    startTime: session.scheduled_time,
    duration: durationMinutes,
    organizer: session.proposed_by_user ? {
      name: session.proposed_by_user.display_name || session.proposed_by_user.username || 'Organisateur',
      email: session.proposed_by_user.email,
    } : undefined,
    attendees,
    reminder: 60, // 1 hour reminder
    categories: ['Gaming', 'Squad Planner'],
    url: `https://squadplanner.app/session/${session.id}`,
  };
}

/**
 * Download an ICS file
 */
export function downloadICSFile(content: string, filename: string = 'squad-planner-sessions.ics'): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Generate and download ICS file for multiple sessions
 */
export function exportSessionsToICS(
  sessions: Array<{
    id: string;
    title: string;
    description?: string;
    scheduled_date: string;
    scheduled_time: string;
    duration?: number | string;
    squad?: { name?: string };
    proposed_by_user?: { username?: string; display_name?: string; email?: string };
    rsvps?: Array<{
      response: string;
      user: { username?: string; display_name?: string; email?: string };
    }>;
  }>,
  squadName?: string
): void {
  const events = sessions.map(sessionToCalendarEvent);
  const content = generateICSContent(events, squadName ? `${squadName} - Squad Planner` : 'Squad Planner');
  const filename = squadName
    ? `${squadName.toLowerCase().replace(/\s+/g, '-')}-sessions.ics`
    : 'squad-planner-sessions.ics';
  downloadICSFile(content, filename);
}

/**
 * Generate a webcal:// URL for subscribing to sessions (requires backend support)
 */
export function generateWebcalURL(squadId: string): string {
  // This would need backend support to serve the ICS dynamically
  return `webcal://squadplanner.app/api/calendar/${squadId}/sessions.ics`;
}
