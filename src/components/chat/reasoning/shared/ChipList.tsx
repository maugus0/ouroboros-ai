import { cn } from "@/lib/utils";

type ChipVariant = "default" | "primary" | "muted" | "warning";

interface ChipListProps {
  items: string[];
  variant?: ChipVariant;
  label?: string;
  className?: string;
  maxVisible?: number;
}

const variantStyles: Record<ChipVariant, string> = {
  default:
    "bg-secondary/80 text-secondary-foreground border-border/50 dark:bg-secondary/50 dark:border-border/30",
  primary:
    "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30",
  muted:
    "bg-muted/60 text-muted-foreground border-muted-foreground/20 dark:bg-muted/40 dark:border-muted-foreground/10",
  warning:
    "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
};

export function ChipList({
  items,
  variant = "default",
  label,
  className,
  maxVisible,
}: ChipListProps) {
  if (items.length === 0) return null;

  const visibleItems = maxVisible ? items.slice(0, maxVisible) : items;
  const hiddenCount = maxVisible ? Math.max(0, items.length - maxVisible) : 0;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-1.5">
        {visibleItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
              variantStyles[variant]
            )}
          >
            {item.replace(/_/g, " ")}
          </span>
        ))}
        {hiddenCount > 0 && (
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
              variantStyles.muted
            )}
          >
            +{hiddenCount} more
          </span>
        )}
      </div>
    </div>
  );
}
