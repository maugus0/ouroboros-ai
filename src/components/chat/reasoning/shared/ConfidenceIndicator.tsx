import { cn } from "@/lib/utils";

interface ConfidenceIndicatorProps {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

function getConfidenceColor(value: number): string {
  if (value >= 0.8) return "bg-emerald-500";
  if (value >= 0.6) return "bg-amber-500";
  return "bg-orange-500";
}

function getConfidenceTextColor(value: number): string {
  if (value >= 0.8) return "text-emerald-600 dark:text-emerald-400";
  if (value >= 0.6) return "text-amber-600 dark:text-amber-400";
  return "text-orange-600 dark:text-orange-400";
}

export function ConfidenceIndicator({
  value,
  showLabel = true,
  size = "sm",
  className,
}: ConfidenceIndicatorProps) {
  const percentage = Math.max(0, Math.min(100, Math.round(value * 100)));
  const barColor = getConfidenceColor(value);
  const textColor = getConfidenceTextColor(value);

  const barHeight = size === "sm" ? "h-1.5" : "h-2";
  const fontSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-full bg-muted/50",
          barHeight,
          size === "sm" ? "min-w-16 max-w-24" : "min-w-20 max-w-32"
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-300", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn("font-medium tabular-nums", fontSize, textColor)}>{percentage}%</span>
      )}
    </div>
  );
}
