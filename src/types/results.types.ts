export interface DiscoverRequest {
  query?: string;
  target_field?: string;
  target_degree?: string;
  countries?: string[];
  max_tuition_usd?: number;
  limit?: number;
  include_attribution?: boolean;
  sync_application_deadlines?: boolean;
  force_refresh?: boolean;
}

export interface MatchSummary {
  id?: string;
  match_score?: number | string;
  confidence_level?: string;
  created_at?: string;
}

export interface DashboardProgram {
  id?: string;
  program_name?: string;
  institution_name?: string;
  institution_country?: string;
  deadline?: string;
  match?: MatchSummary;
  [key: string]: unknown;
}

export interface DashboardScholarship {
  id?: string;
  name?: string;
  provider?: string;
  deadline?: string;
  funding_amount?: number;
  currency?: string;
  match?: MatchSummary;
  [key: string]: unknown;
}

export interface DashboardMatchItem {
  entity_type?: string;
  entity_id?: string;
  match_result?: {
    id?: string;
    match_score?: number | string;
    confidence_level?: string;
    entity_type?: string;
    entity_id?: string;
  };
  [key: string]: unknown;
}

export interface DashboardView {
  workflow_id: string;
  status: "success" | "partial" | "failed" | "in_progress";
  version: number;
  generated_at?: string;
  profile?: Record<string, unknown>;
  programs: {
    items: DashboardProgram[];
    total: number;
  };
  scholarships: {
    items: DashboardScholarship[];
    total: number;
  };
  matches: {
    items: DashboardMatchItem[];
    total: number;
  };
  application?: Record<string, unknown> | null;
  agents?: Record<string, unknown>;
  errors?: Array<{ service?: string; message?: string }>;
}

export interface DiscoverResponse {
  workflow_id: string;
  status: string;
  version: number;
  dashboard: DashboardView;
}

export interface DashboardHistoryItem {
  workflow_id: string;
  status: string;
  version: number;
  created_at?: string;
}

export interface DashboardResponse {
  has_results: boolean;
  latest_workflow_id: string | null;
  dashboard: DashboardView | null;
  history: DashboardHistoryItem[];
}

export interface WorkflowResultResponse {
  workflow_id: string;
  user_id: string;
  status: string;
  version: number;
  is_latest: boolean;
  dashboard: DashboardView;
  raw_outputs: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  versions?: Array<Record<string, unknown>>;
}
