/**
 * Projects API endpoints.
 * Uses existing apiClient with auth interceptors.
 */

import apiClient from "./client";
import { env } from "@/config/env";
import type {
  CreateProjectRequest,
  PaginatedProjectsResponse,
  Project,
  ProjectFilters,
  UpdateProjectRequest,
} from "@/types/chat.types";

const API = env.API_PATH;

export const projectsApi = {
  /**
   * Create a new project.
   */
  async create(data: CreateProjectRequest): Promise<Project> {
    const response = await apiClient.post<Project>(`${API}/projects`, data);
    return response.data;
  },

  /**
   * List user's projects with pagination.
   */
  async list(options: ProjectFilters = {}): Promise<PaginatedProjectsResponse> {
    const params = new URLSearchParams();
    if (options.limit) params.set("limit", String(options.limit));
    if (options.cursor) params.set("cursor", options.cursor);

    const query = params.toString();
    const response = await apiClient.get<PaginatedProjectsResponse>(
      `${API}/projects${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  /**
   * Get a single project by ID.
   */
  async get(projectId: string): Promise<Project> {
    const response = await apiClient.get<Project>(`${API}/projects/${projectId}`);
    return response.data;
  },

  /**
   * Update project metadata.
   */
  async update(projectId: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await apiClient.patch<Project>(`${API}/projects/${projectId}`, data);
    return response.data;
  },

  /**
   * Soft delete a project.
   */
  async delete(projectId: string): Promise<void> {
    await apiClient.delete(`${API}/projects/${projectId}`);
  },
};
