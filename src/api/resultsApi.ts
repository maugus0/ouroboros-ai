import apiClient from "./client";
import { env } from "@/config/env";
import type {
  DashboardResponse,
  DiscoverRequest,
  DiscoverResponse,
  WorkflowResultResponse,
} from "@/types/results.types";

const API = env.API_PATH;

export const resultsApi = {
  async discover(payload: DiscoverRequest = {}): Promise<DiscoverResponse> {
    const response = await apiClient.post<DiscoverResponse>(`${API}/discover`, payload);
    return response.data;
  },

  async getDashboard(
    options: { includeHistory?: boolean; historyLimit?: number } = {}
  ): Promise<DashboardResponse> {
    const params = new URLSearchParams();
    if (options.includeHistory !== undefined) {
      params.set("include_history", String(options.includeHistory));
    }
    if (options.historyLimit) {
      params.set("history_limit", String(options.historyLimit));
    }
    const query = params.toString();
    const response = await apiClient.get<DashboardResponse>(
      `${API}/dashboard${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  async getResult(workflowId: string, includeVersions = false): Promise<WorkflowResultResponse> {
    const query = includeVersions ? "?include_versions=true" : "";
    const response = await apiClient.get<WorkflowResultResponse>(
      `${API}/results/${workflowId}${query}`
    );
    return response.data;
  },
};
