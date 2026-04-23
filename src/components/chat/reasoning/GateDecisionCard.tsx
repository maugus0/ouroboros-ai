import { ShieldCheck } from "lucide-react";
import type { GateDecision } from "@/types/chat.types";
import { ReasoningCard, StatusBadge, ChipList } from "./shared";

interface GateDecisionCardProps {
  data: GateDecision;
  defaultOpen?: boolean;
}

export function GateDecisionCard({ data, defaultOpen }: GateDecisionCardProps) {
  const missingFields = data.missing_fields ?? [];
  const statusType = data.allowed ? "success" : missingFields.length > 0 ? "warning" : "error";
  const statusLabel = data.allowed ? "Allowed" : "Blocked";

  return (
    <ReasoningCard
      title="Gate Decision"
      icon={ShieldCheck}
      iconColor={
        data.allowed
          ? "text-emerald-500 dark:text-emerald-400"
          : "text-amber-500 dark:text-amber-400"
      }
      accentColor={
        data.allowed
          ? "border-l-emerald-500/40 dark:border-l-emerald-400/40"
          : "border-l-amber-500/40 dark:border-l-amber-400/40"
      }
      defaultOpen={defaultOpen}
      headerRight={<StatusBadge status={statusType} label={statusLabel} />}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
              Status
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground/80">
                {data.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
            Reason
          </span>
          <p className="text-xs leading-relaxed text-foreground/80">{data.reason}</p>
        </div>

        {missingFields.length > 0 && (
          <ChipList items={missingFields} variant="warning" label="Missing Fields" />
        )}
      </div>
    </ReasoningCard>
  );
}
