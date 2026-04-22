import apiClient from "./client";
import { env } from "@/config/env";

const API = env.API_PATH;

export interface ClarificationQueueItem {
  field?: string;
  question?: string;
}

export interface ParsedProfileData {
  clarification_queue?: ClarificationQueueItem[];
  extraction_summary?: {
    high_confidence_fields?: string[];
    needs_confirmation_fields?: string[];
    clarification_queue_count?: number;
  };
  [key: string]: unknown;
}

export interface UploadProfileDocumentRequest {
  file: File;
  intent?: string;
  documentType?: "cv" | "transcript" | "unknown";
  runGapAnalysis?: boolean;
}

export interface UploadProfileDocumentResponse {
  message?: string;
  data?: {
    profile_id?: string;
    profile_data?: ParsedProfileData;
    gap_analysis?: unknown;
    total_processing_time_ms?: number;
    [key: string]: unknown;
  };
}

export const workflowsApi = {
  async uploadProfileDocument({
    file,
    intent = "profile_completion",
    documentType = "cv",
    runGapAnalysis = true,
  }: UploadProfileDocumentRequest): Promise<UploadProfileDocumentResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("intent", intent);
    formData.append("document_type", documentType);
    formData.append("run_gap_analysis", String(runGapAnalysis));

    const response = await apiClient.post<UploadProfileDocumentResponse>(
      `${API}/workflows/profile-upload`,
      formData
    );

    return response.data;
  },
};
