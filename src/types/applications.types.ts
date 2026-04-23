export type ApplicationStatus = "not_started" | "in_progress" | "applied" | "accepted" | "rejected";
export type ApplicationEntityType = "program" | "scholarship";

export interface TrackedApplication {
  id: string;
  user_id: string;
  entity_type: ApplicationEntityType;
  entity_id: string;
  title: string;
  provider?: string | null;
  status: ApplicationStatus;
  match_score?: number | null;
  deadline?: string | null;
  source_data: Record<string, unknown>;
  checklist_output?: Record<string, unknown> | null;
  deadline_output?: Record<string, unknown> | null;
  sop_output?: Record<string, unknown> | null;
  cover_letter_output?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface StartApplicationRequest {
  entity_type: ApplicationEntityType;
  entity_id: string;
  title: string;
  provider?: string | null;
  match_score?: number | null;
  deadline?: string | null;
  source_data: Record<string, unknown>;
}

export interface ApplicationActionResponse {
  application: TrackedApplication;
  output: Record<string, unknown>;
}
