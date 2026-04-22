import { describe, expect, it, vi } from "vitest";

import apiClient from "./client";
import { workflowsApi } from "./workflowsApi";
import { env } from "@/config/env";

vi.mock("./client", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("workflowsApi.uploadProfileDocument", () => {
  it("sends a multipart upload to the orchestrator endpoint", async () => {
    const file = new File(["resume content"], "resume.pdf", { type: "application/pdf" });
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        message: "Profile created",
        data: { profile_id: "profile-123" },
      },
    });

    const result = await workflowsApi.uploadProfileDocument({
      file,
      documentType: "cv",
      runGapAnalysis: false,
    });

    expect(apiClient.post).toHaveBeenCalledTimes(1);

    const [url, body, config] = vi.mocked(apiClient.post).mock.calls[0];
    expect(url).toBe(`${env.API_PATH}/workflows/profile-upload`);
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get("file")).toBe(file);
    expect((body as FormData).get("intent")).toBe("profile_completion");
    expect((body as FormData).get("document_type")).toBe("cv");
    expect((body as FormData).get("run_gap_analysis")).toBe("false");
    expect(config).toBeUndefined();
    expect(result).toEqual({
      message: "Profile created",
      data: { profile_id: "profile-123" },
    });
  });
});
