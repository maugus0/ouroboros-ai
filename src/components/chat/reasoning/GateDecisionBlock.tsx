import type { GateDecision } from "@/types/chat.types";
import { ThinkingBlock } from "./shared/ThinkingBlock";

interface GateDecisionBlockProps {
  data: GateDecision;
}

export function GateDecisionBlock({ data }: GateDecisionBlockProps) {
  const missingFields = data.missing_fields ?? [];
  const statusIcon = data.allowed ? "✓" : "✗";
  const summary = `${statusIcon} ${data.status.replace(/_/g, " ")}`;

  return (
    <ThinkingBlock
      label="Gate decision"
      summary={summary}
      accentColor={
        data.allowed
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-amber-600 dark:text-amber-400"
      }
    >
      <div className="space-y-2">
        <div>
          <span className="font-medium text-foreground/70">Status:</span>{" "}
          <span
            className={
              data.allowed
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }
          >
            {data.allowed ? "Allowed" : "Blocked"} — {data.status.replace(/_/g, " ")}
          </span>
        </div>
        <div>
          <span className="font-medium text-foreground/70">Reason:</span> <span>{data.reason}</span>
        </div>
        {missingFields.length > 0 && (
          <div>
            <span className="font-medium text-foreground/70">Missing fields:</span>{" "}
            <span className="text-amber-600 dark:text-amber-400">
              {missingFields.map((f) => f.replace(/_/g, " ")).join(", ")}
            </span>
          </div>
        )}
      </div>
    </ThinkingBlock>
  );
}
