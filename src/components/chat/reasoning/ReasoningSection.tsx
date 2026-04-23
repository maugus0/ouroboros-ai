import { useMemo } from "react";
import type { MessageMetadata } from "@/types/chat.types";
import { OrchestratorThoughtsBlock } from "./OrchestratorThoughtsBlock";
import { GateDecisionBlock } from "./GateDecisionBlock";
import { RoutingDecisionBlock } from "./RoutingDecisionBlock";
import { AgentReasoningBlock } from "./AgentReasoningBlock";

interface ReasoningSectionProps {
  metadata: MessageMetadata | null;
}

export function ReasoningSection({ metadata }: ReasoningSectionProps) {
  const hasContent = useMemo(() => {
    if (!metadata) return false;
    return !!(
      metadata.orchestrator_thoughts ||
      metadata.gate_decision ||
      metadata.routing_decision ||
      metadata.agent_reasoning
    );
  }, [metadata]);

  if (!hasContent || !metadata) {
    return null;
  }

  return (
    <div className="mb-3 space-y-1.5">
      {metadata.orchestrator_thoughts && (
        <OrchestratorThoughtsBlock data={metadata.orchestrator_thoughts} />
      )}

      {metadata.gate_decision && <GateDecisionBlock data={metadata.gate_decision} />}

      {metadata.routing_decision && <RoutingDecisionBlock data={metadata.routing_decision} />}

      {metadata.agent_reasoning && <AgentReasoningBlock data={metadata.agent_reasoning} />}
    </div>
  );
}
