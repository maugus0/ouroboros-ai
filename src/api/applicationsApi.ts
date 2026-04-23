import apiClient from "./client";
import { env } from "@/config/env";
import type {
  ApplicationActionResponse,
  ApplicationStatus,
  StartApplicationRequest,
  TrackedApplication,
} from "@/types/applications.types";

const API = `${env.API_PATH}/applications`;

export const applicationsApi = {
  async list(): Promise<TrackedApplication[]> {
    const response = await apiClient.get<TrackedApplication[]>(API);
    return response.data;
  },

  async start(payload: StartApplicationRequest): Promise<TrackedApplication> {
    const response = await apiClient.post<TrackedApplication>(API, payload);
    return response.data;
  },

  async updateStatus(
    applicationId: string,
    status: ApplicationStatus
  ): Promise<TrackedApplication> {
    const response = await apiClient.patch<TrackedApplication>(`${API}/${applicationId}`, {
      status,
    });
    return response.data;
  },

  async createChecklist(applicationId: string): Promise<ApplicationActionResponse> {
    const response = await apiClient.post<ApplicationActionResponse>(
      `${API}/${applicationId}/checklist`
    );
    return response.data;
  },

  async syncDeadline(applicationId: string): Promise<ApplicationActionResponse> {
    const response = await apiClient.post<ApplicationActionResponse>(
      `${API}/${applicationId}/deadline-sync`
    );
    return response.data;
  },

  async generateSop(applicationId: string): Promise<ApplicationActionResponse> {
    const response = await apiClient.post<ApplicationActionResponse>(
      `${API}/${applicationId}/generate-sop`
    );
    return response.data;
  },

  async generateCoverLetter(applicationId: string): Promise<ApplicationActionResponse> {
    const response = await apiClient.post<ApplicationActionResponse>(
      `${API}/${applicationId}/generate-cover-letter`
    );
    return response.data;
  },
};
