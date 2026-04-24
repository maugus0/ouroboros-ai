import type { MessageMetadata } from "@/types/chat.types";

export const ASSISTANT_SYNC_EVENT = "ouroboros:assistant-sync";

export interface AssistantSyncDetail {
  refreshTabs: string[];
  focusApplicationId?: string | null;
}

function normalizeRefreshTabs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}

export function getAssistantSyncDetail(
  metadata: MessageMetadata | null | undefined
): AssistantSyncDetail | null {
  if (!metadata) return null;

  const refreshTabs = normalizeRefreshTabs(metadata.refresh_tabs);
  const focusApplicationId =
    typeof metadata.focus_application_id === "string" && metadata.focus_application_id.trim()
      ? metadata.focus_application_id.trim()
      : null;

  if (refreshTabs.length === 0 && !focusApplicationId) return null;

  return {
    refreshTabs,
    focusApplicationId,
  };
}

export function dispatchAssistantSync(detail: AssistantSyncDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<AssistantSyncDetail>(ASSISTANT_SYNC_EVENT, { detail }));
}
