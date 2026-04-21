import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** User display name to initials (e.g. "John Doe" → "JD"). Used for avatars. */
export function getInitials(name: string): string {
  if (!name || !name.trim()) return "";
  return name
    .trim()
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Re-export date utilities for backward compatibility
export { formatDate, formatDateTime, formatTime, formatRelativeTime } from "@/utils/dateUtils";
