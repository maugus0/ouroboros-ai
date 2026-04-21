/**
 * Parse an ISO 8601 timestamp as UTC.
 *
 * The backend sends timestamps in UTC but sometimes without a timezone
 * designator (e.g. "2026-04-09T05:29:16"). This helper handles three cases:
 *  - Already has "Z" suffix → pass through
 *  - Already has an offset like "+00:00" or "-05:30" → pass through
 *  - No timezone info at all → append "Z" to interpret as UTC
 */
export function parseUTC(iso: string): Date {
  const hasTimezone = /Z$|[+-]\d{2}:\d{2}$/.test(iso);
  return new Date(hasTimezone ? iso : iso + "Z");
}

/** Format a UTC date string to local date (e.g., "April 11, 2026") */
export function formatDate(dateString: string): string {
  return parseUTC(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Format a UTC date string to local date and time (e.g., "Apr 11, 2026, 4:40 PM") */
export function formatDateTime(dateString: string): string {
  return parseUTC(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format a UTC date string to local time only (e.g., "4:40 PM") */
export function formatTime(dateString: string): string {
  return parseUTC(dateString).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format a UTC date string to relative time (e.g., "2 minutes ago", "yesterday") */
export function formatRelativeTime(dateString: string): string {
  const date = parseUTC(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;

  return formatDate(dateString);
}
