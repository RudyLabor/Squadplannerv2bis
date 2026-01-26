// 🕐 SQUAD PLANNER - UTILITAIRES DE DATES & FUSEAUX HORAIRES

/**
 * Convertit une date en format "Dans X heures" / "Demain à 21h" / etc.
 */
export function getRelativeTimeString(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Passé
  if (diffMs < 0) {
    const absDiffHours = Math.abs(diffHours);
    const absDiffDays = Math.abs(diffDays);
    
    if (absDiffDays > 0) return `Il y a ${absDiffDays} jour${absDiffDays > 1 ? 's' : ''}`;
    if (absDiffHours > 0) return `Il y a ${absDiffHours}h`;
    return "À l'instant";
  }

  // Futur
  if (diffMinutes < 60) {
    if (diffMinutes < 1) return "Maintenant !";
    if (diffMinutes < 5) return "Dans quelques minutes";
    return `Dans ${diffMinutes} min`;
  }

  if (diffHours < 24) {
    return `Dans ${diffHours}h`;
  }

  // Demain
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (targetDate.toDateString() === tomorrow.toDateString()) {
    return `Demain à ${targetDate.getHours()}h${targetDate.getMinutes().toString().padStart(2, '0')}`;
  }

  // Cette semaine
  if (diffDays < 7) {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return `${days[targetDate.getDay()]} à ${targetDate.getHours()}h${targetDate.getMinutes().toString().padStart(2, '0')}`;
  }

  // Plus tard
  return targetDate.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Retourne le temps restant en format compteur (HH:MM:SS)
 */
export function getCountdownString(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) return "00:00:00";

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Détermine si une session est "bientôt" (< 2h)
 */
export function isSessionSoon(date: Date | string): boolean {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return diffHours > 0 && diffHours < 2;
}

/**
 * Détermine si une session est "aujourd'hui"
 */
export function isToday(date: Date | string): boolean {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return targetDate.toDateString() === now.toDateString();
}

/**
 * Détermine si une session est "demain"
 */
export function isTomorrow(date: Date | string): boolean {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return targetDate.toDateString() === tomorrow.toDateString();
}

/**
 * Convertit une date locale vers un autre fuseau horaire
 */
export function convertToTimezone(date: Date, timezone: string): Date {
  const dateString = date.toLocaleString('en-US', { timeZone: timezone });
  return new Date(dateString);
}

/**
 * Détecte le fuseau horaire de l'utilisateur
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Formate une date avec fuseau horaire
 */
export function formatWithTimezone(date: Date | string, timezone?: string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const tz = timezone || getUserTimezone();
  
  return targetDate.toLocaleString('fr-FR', {
    timeZone: tz,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Liste des fuseaux horaires courants
 */
export const COMMON_TIMEZONES = [
  { value: 'Europe/Paris', label: 'Paris (UTC+1)', offset: '+1' },
  { value: 'Europe/London', label: 'Londres (UTC+0)', offset: '+0' },
  { value: 'America/New_York', label: 'New York (UTC-5)', offset: '-5' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8)', offset: '-8' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)', offset: '+9' },
  { value: 'Asia/Dubai', label: 'Dubaï (UTC+4)', offset: '+4' },
  { value: 'Australia/Sydney', label: 'Sydney (UTC+11)', offset: '+11' },
];

/**
 * Génère un fichier ICS pour export calendrier
 */
export function generateICS(session: {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
}): string {
  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Squad Planner//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@squadplanner.app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(session.startDate)}
DTEND:${formatICSDate(session.endDate)}
SUMMARY:${session.title}
DESCRIPTION:${session.description || ''}
LOCATION:${session.location || 'En ligne'}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Rappel : ${session.title} dans 1 heure
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return ics;
}

/**
 * Télécharge un fichier ICS
 */
export function downloadICS(icsContent: string, filename: string = 'session.ics') {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Génère un lien partageable Discord
 */
export function generateDiscordShareLink(session: {
  id: string;
  title: string;
  date: Date;
  squad: string;
  confirmedCount: number;
  totalSlots: number;
}): string {
  const baseUrl = window.location.origin;
  const sessionUrl = `${baseUrl}/session/${session.id}`;
  
  const message = `🎮 **${session.title}**
📅 ${formatWithTimezone(session.date)}
👥 ${session.confirmedCount}/${session.totalSlots} confirmés
🔗 ${sessionUrl}

Clique pour répondre ! ⚡`;

  return encodeURIComponent(message);
}

/**
 * Copie un texte dans le presse-papier
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback pour navigateurs anciens
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}
