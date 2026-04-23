import { Brain, Lightbulb, HelpCircle, ListChecks } from "lucide-react";
import type { AgentReasoning } from "@/types/chat.types";
import { ReasoningCard, ConfidenceIndicator, ChipList } from "./shared";
import { cn } from "@/lib/utils";

interface AgentReasoningCardProps {
  data: AgentReasoning;
  defaultOpen?: boolean;
}

interface ReasoningListProps {
  icon: typeof Lightbulb;
  iconColor: string;
  label: string;
  items: string[];
}

function ReasoningList({ icon: Icon, iconColor, label, items }: ReasoningListProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3 w-3", iconColor)} />
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
          {label}
        </span>
      </div>
      <ul className="space-y-1.5 pl-0.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-xs leading-relaxed text-foreground/80"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AgentReasoningCard({ data, defaultOpen }: AgentReasoningCardProps) {
  const hasConfidence = typeof data.confidence === "number";
  const parseDecisions = data.parse_decisions ?? [];
  const clarificationReasons = data.clarification_reasons ?? [];
  const decisionFactors = data.decision_factors ?? [];

  return (
    <ReasoningCard
      title="Agent Reasoning"
      icon={Brain}
      iconColor="text-rose-500 dark:text-rose-400"
      accentColor="border-l-rose-500/40 dark:border-l-rose-400/40"
      defaultOpen={defaultOpen}
      headerRight={
        hasConfidence ? <ConfidenceIndicator value={data.confidence!} size="sm" /> : undefined
      }
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
            Approach
          </span>
          <p className="text-xs leading-relaxed text-foreground/80">{data.approach}</p>
        </div>

        {data.next_field && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
              Next Field
            </span>
            <div className="inline-flex items-center gap-2 rounded-md bg-rose-500/10 px-2.5 py-1.5 dark:bg-rose-500/15">
              <span className="text-xs font-medium text-rose-700 dark:text-rose-300">
                {data.next_field.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        )}

        <ReasoningList
          icon={ListChecks}
          iconColor="text-blue-500 dark:text-blue-400"
          label="Parse Decisions"
          items={parseDecisions}
        />

        <ReasoningList
          icon={HelpCircle}
          iconColor="text-amber-500 dark:text-amber-400"
          label="Clarification Reasons"
          items={clarificationReasons}
        />

        {decisionFactors.length > 0 && (
          <ChipList items={decisionFactors} variant="default" label="Decision Factors" />
        )}
      </div>
    </ReasoningCard>
  );
}
