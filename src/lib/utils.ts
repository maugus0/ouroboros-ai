import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** User display name to initials (e.g. "John Doe" → "JD"). Used for avatars. */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Parse a UTC timestamp from the backend.
 * Backend returns ISO strings without 'Z' suffix (e.g., "2026-04-11T08:40:15").
 * This ensures they're parsed as UTC, not local time.
 */
export function parseUTCDate(dateString: string): Date {
  if (!dateString.endsWith("Z") && !dateString.includes("+")) {
    return new Date(dateString + "Z");
  }
  return new Date(dateString);
}

/** Format a UTC date string to local date (e.g., "April 11, 2026") */
export function formatDate(dateString: string): string {
  return parseUTCDate(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Format a UTC date string to local date and time (e.g., "Apr 11, 2026, 4:40 PM") */
export function formatDateTime(dateString: string): string {
  return parseUTCDate(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format a UTC date string to local time only (e.g., "4:40 PM") */
export function formatTime(dateString: string): string {
  return parseUTCDate(dateString).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format a UTC date string to relative time (e.g., "2 minutes ago", "yesterday") */
export function formatRelativeTime(dateString: string): string {
  const date = parseUTCDate(dateString);
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
