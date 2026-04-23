import { describe, expect, it, vi } from "vitest";

import apiClient from "./client";
import { resultsApi } from "./resultsApi";
import { env } from "@/config/env";

vi.mock("./client", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("resultsApi", () => {
  it("calls discover endpoint", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { workflow_id: "wf-1", status: "success", version: 3, dashboard: {} },
    });

    const response = await resultsApi.discover({ target_field: "Computer Science", limit: 5 });
    expect(apiClient.post).toHaveBeenCalledWith(`${env.API_PATH}/discover`, {
      target_field: "Computer Science",
      limit: 5,
    });
    expect(response.workflow_id).toBe("wf-1");
  });

  it("calls dashboard endpoint with query params", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { has_results: false, latest_workflow_id: null, dashboard: null, history: [] },
    });

    await resultsApi.getDashboard({ includeHistory: true, historyLimit: 10 });
    expect(apiClient.get).toHaveBeenCalledWith(
      `${env.API_PATH}/dashboard?include_history=true&history_limit=10`
    );
  });
});
