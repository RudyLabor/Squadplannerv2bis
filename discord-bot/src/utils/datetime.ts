/**
 * Date/Time Utilities
 *
 * Parse natural language dates and times in French.
 */

const DAYS_FR: Record<string, number> = {
  dimanche: 0,
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
};

/**
 * Parse a date string in various formats
 * Supports: demain, après-demain, lundi, mardi, ..., DD/MM, DD/MM/YYYY
 */
export function parseDate(input: string): string | null {
  const normalized = input.toLowerCase().trim();
  const today = new Date();

  // "aujourd'hui"
  if (normalized === "aujourd'hui" || normalized === 'aujourdhui' || normalized === 'today') {
    return formatDate(today);
  }

  // "demain"
  if (normalized === 'demain' || normalized === 'tomorrow') {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return formatDate(tomorrow);
  }

  // "après-demain"
  if (normalized === 'après-demain' || normalized === 'apres-demain' || normalized === 'après demain') {
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);
    return formatDate(dayAfter);
  }

  // Day names (lundi, mardi, etc.)
  for (const [dayName, dayIndex] of Object.entries(DAYS_FR)) {
    if (normalized.startsWith(dayName)) {
      const currentDay = today.getDay();
      let daysToAdd = dayIndex - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7; // Next week if today or past

      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);
      return formatDate(targetDate);
    }
  }

  // DD/MM or DD/MM/YYYY format
  const dateRegex = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/;
  const match = normalized.match(dateRegex);

  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JS months are 0-indexed
    let year = match[3] ? parseInt(match[3], 10) : today.getFullYear();

    // Handle 2-digit years
    if (year < 100) {
      year += 2000;
    }

    const date = new Date(year, month, day);

    // Validate the date
    if (date.getDate() === day && date.getMonth() === month) {
      return formatDate(date);
    }
  }

  // DD-MM or DD-MM-YYYY format
  const dashRegex = /^(\d{1,2})-(\d{1,2})(?:-(\d{2,4}))?$/;
  const dashMatch = normalized.match(dashRegex);

  if (dashMatch) {
    const day = parseInt(dashMatch[1], 10);
    const month = parseInt(dashMatch[2], 10) - 1;
    let year = dashMatch[3] ? parseInt(dashMatch[3], 10) : today.getFullYear();

    if (year < 100) year += 2000;

    const date = new Date(year, month, day);

    if (date.getDate() === day && date.getMonth() === month) {
      return formatDate(date);
    }
  }

  return null;
}

/**
 * Parse a time string in various formats
 * Supports: 21h, 21h30, 21:00, 21:30, 9pm
 */
export function parseTime(input: string): string | null {
  const normalized = input.toLowerCase().trim();

  // 21h or 21h30 format
  const hMatch = normalized.match(/^(\d{1,2})h(\d{2})?$/);
  if (hMatch) {
    const hours = parseInt(hMatch[1], 10);
    const minutes = hMatch[2] ? parseInt(hMatch[2], 10) : 0;

    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return formatTime(hours, minutes);
    }
  }

  // 21:00 or 21:30 format
  const colonMatch = normalized.match(/^(\d{1,2}):(\d{2})$/);
  if (colonMatch) {
    const hours = parseInt(colonMatch[1], 10);
    const minutes = parseInt(colonMatch[2], 10);

    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return formatTime(hours, minutes);
    }
  }

  // 9pm or 9:30pm format
  const ampmMatch = normalized.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const isPM = ampmMatch[3] === 'pm';

    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return formatTime(hours, minutes);
    }
  }

  return null;
}

/**
 * Format a Date object to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format hours and minutes to HH:MM string
 */
function formatTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: string, time: string): string {
  const dateObj = new Date(`${date}T${time}`);

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  const dayName = dayNames[dateObj.getDay()];
  const day = dateObj.getDate();
  const month = monthNames[dateObj.getMonth()];
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${dayName} ${day} ${month} à ${hours}h${minutes}`;
}

/**
 * Get relative time description (e.g., "dans 2 heures")
 */
export function getRelativeTime(date: string, time: string): string {
  const targetDate = new Date(`${date}T${time}`);
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs < 0) return 'Passé';

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) {
    return `dans ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  }

  if (diffHours < 24) {
    return `dans ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  }

  return `dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
}
