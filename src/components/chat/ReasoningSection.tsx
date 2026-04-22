import { useMemo, useState } from "react";
import type { MessageMetadata } from "@/types/chat.types";

interface ReasoningSectionProps {
  metadata: MessageMetadata | null;
}

interface TreeSection {
  key: string;
  label: string;
  lines: string[];
}

function formatConfidence(value?: number): string | null {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return `${pct}%`;
}

export function ReasoningSection({ metadata }: ReasoningSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sections = useMemo<TreeSection[]>(() => {
    if (!metadata) {
      return [];
    }

    const treeSections: TreeSection[] = [];

    if (metadata.orchestrator_thoughts) {
      const confidence = formatConfidence(metadata.orchestrator_thoughts.intent_confidence);
      const lines = [
        `intent: ${metadata.orchestrator_thoughts.intent}`,
        ...(confidence ? [`confidence: ${confidence}`] : []),
        `reason: ${metadata.orchestrator_thoughts.reasoning}`,
      ];
      treeSections.push({
        key: "orchestrator_thoughts",
        label: "orchestrator_thoughts",
        lines,
      });
    }

    if (metadata.gate_decision) {
      const missing = metadata.gate_decision.missing_fields ?? [];
      const lines = [
        `allowed: ${metadata.gate_decision.allowed}`,
        `status: ${metadata.gate_decision.status}`,
        `reason: ${metadata.gate_decision.reason}`,
        ...(missing.length > 0 ? [`missing_fields: ${missing.join(", ")}`] : []),
      ];
      treeSections.push({
        key: "gate_decision",
        label: "gate_decision",
        lines,
      });
    }

    if (metadata.routing_decision) {
      const confidence = formatConfidence(metadata.routing_decision.confidence);
      const alternatives = metadata.routing_decision.alternative_agents ?? [];
      const lines = [
        `selected_agent: ${metadata.routing_decision.selected_agent}`,
        `reason: ${metadata.routing_decision.routing_reason}`,
        ...(confidence ? [`confidence: ${confidence}`] : []),
        ...(alternatives.length > 0 ? [`alternative_agents: ${alternatives.join(", ")}`] : []),
      ];
      treeSections.push({
        key: "routing_decision",
        label: "routing_decision",
        lines,
      });
    }

    if (metadata.agent_reasoning) {
      const confidence = formatConfidence(metadata.agent_reasoning.confidence);
      const factors = metadata.agent_reasoning.decision_factors ?? [];
      const parseDecisions = metadata.agent_reasoning.parse_decisions ?? [];
      const clarificationReasons = metadata.agent_reasoning.clarification_reasons ?? [];
      const lines = [
        `approach: ${metadata.agent_reasoning.approach}`,
        ...(metadata.agent_reasoning.next_field
          ? [`next_field: ${metadata.agent_reasoning.next_field}`]
          : []),
        ...(confidence ? [`confidence: ${confidence}`] : []),
        ...(parseDecisions.length > 0
          ? ["parse_decisions:", ...parseDecisions.map((item) => `- ${item}`)]
          : []),
        ...(clarificationReasons.length > 0
          ? ["clarification_reasons:", ...clarificationReasons.map((item) => `- ${item}`)]
          : []),
        ...(factors.length > 0 ? ["decision_factors:", ...factors.map((item) => `- ${item}`)] : []),
      ];
      treeSections.push({
        key: "agent_reasoning",
        label: "agent_reasoning",
        lines,
      });
    }

    return treeSections;
  }, [metadata]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="mb-2 mt-1 rounded-sm border border-border/40 bg-background/40 px-2.5 py-2">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="text-[11px] font-medium text-muted-foreground/90 hover:text-foreground"
      >
        {isExpanded ? "▼ Hide reasoning" : "▶ Show reasoning"}
      </button>

      {isExpanded && (
        <div className="mt-1.5 space-y-1.5 font-mono text-[11px] leading-5 text-muted-foreground/90">
          <div className="text-muted-foreground/70">reasoning</div>
          {sections.map((section, sectionIndex) => (
            <div key={section.key}>
              <div className="leading-5">
                {sectionIndex === sections.length - 1 ? "└─" : "├─"} {section.label}
              </div>
              <div className="ml-4 space-y-0.5">
                {section.lines.map((line, lineIndex) => (
                  <div
                    key={`${section.key}-${lineIndex}`}
                    className={`leading-5 ${line.startsWith("-") ? "ml-4 text-muted-foreground/80" : ""}`}
                  >
                    {line.startsWith("-") ? `     ${line}` : `   • ${line}`}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
