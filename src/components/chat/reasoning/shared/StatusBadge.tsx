import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "success" | "error" | "warning" | "info";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  { icon: typeof Check; bg: string; text: string; border: string }
> = {
  success: {
    icon: Check,
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20 dark:border-emerald-500/30",
  },
  error: {
    icon: X,
    bg: "bg-red-500/10 dark:bg-red-500/20",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-500/20 dark:border-red-500/30",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20 dark:border-amber-500/30",
  },
  info: {
    icon: AlertCircle,
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/20 dark:border-blue-500/30",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
  );
}
