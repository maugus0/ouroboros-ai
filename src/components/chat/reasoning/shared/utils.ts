/**
 * Formats a confidence value (0-1) as a percentage string.
 * Returns empty string if value is not a valid number.
 */
export function formatConfidence(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "";
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return `${pct}%`;
}
