import { cn } from "@/lib/utils";

interface CharCounterProps {
  value: string;
  maxLength: number;
  className?: string;
  threshold?: number;
}

export function CharCounter({ value, maxLength, className, threshold = 0.8 }: CharCounterProps) {
  const trimmedLength = value.trim().length;
  const isOverLimit = trimmedLength > maxLength;
  const showCounter = trimmedLength >= maxLength * threshold;

  if (!showCounter) return null;

  return (
    <span
      className={cn(
        "text-[10px] tabular-nums sm:text-xs",
        isOverLimit ? "text-destructive" : "text-muted-foreground",
        className
      )}
    >
      {trimmedLength.toLocaleString()}/{maxLength.toLocaleString()}
    </span>
  );
}
