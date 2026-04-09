/**
 * Parse an ISO 8601 timestamp as UTC.
 *
 * The backend sends timestamps in UTC but sometimes without a timezone
 * designator (e.g. "2026-04-09T05:29:16"). This helper handles three cases:
 *  - Already has "Z" suffix → pass through
 *  - Already has an offset like "+00:00" or "+05:30" → pass through
 *  - No timezone info at all → append "Z" to interpret as UTC
 */
export function parseUTC(iso: string): Date {
  const hasTimezone = /Z$|[+-]\d{2}:\d{2}$/.test(iso);
  return new Date(hasTimezone ? iso : iso + "Z");
}
