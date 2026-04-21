/**
 * Chat API endpoints.
 * Uses existing apiClient with auth interceptors.
 */

import apiClient from "./client";
import { env } from "@/config/env";
import type {
  AssistantNoticeRequest,
  AssistantNoticeResponse,
  Chat,
  ChatFilters,
  CreateChatRequest,
  Message,
  MessageFilters,
  PaginatedChatsResponse,
  PaginatedMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  UpdateChatRequest,
} from "@/types/chat.types";

const API = env.API_PATH;

export const chatsApi = {
  /**
   * Create a new chat, optionally with initial message and project.
   */
  async create(data: CreateChatRequest = {}): Promise<Chat> {
    const response = await apiClient.post<Chat>(`${API}/chats`, data);
    return response.data;
  },

  /**
   * List user's chats with optional filters and pagination.
   */
  async list(filters: ChatFilters = {}): Promise<PaginatedChatsResponse> {
    const params = new URLSearchParams();
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.cursor) params.set("cursor", filters.cursor);
    if (filters.starred !== undefined) params.set("starred", String(filters.starred));
    if (filters.project_id) params.set("project_id", filters.project_id);
    if (filters.no_project) params.set("no_project", "true");

    const query = params.toString();
    const response = await apiClient.get<PaginatedChatsResponse>(
      `${API}/chats${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  /**
   * Get a single chat by ID.
   */
  async get(chatId: string): Promise<Chat> {
    const response = await apiClient.get<Chat>(`${API}/chats/${chatId}`);
    return response.data;
  },

  /**
   * Update chat (title, starred, project assignment).
   */
  async update(chatId: string, data: UpdateChatRequest): Promise<Chat> {
    const response = await apiClient.patch<Chat>(`${API}/chats/${chatId}`, data);
    return response.data;
  },

  /**
   * Soft delete a chat.
   */
  async delete(chatId: string): Promise<void> {
    await apiClient.delete(`${API}/chats/${chatId}`);
  },

  /**
   * Send a message and receive assistant response.
   */
  async sendMessage(chatId: string, data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await apiClient.post<SendMessageResponse>(
      `${API}/chats/${chatId}/messages`,
      data
    );
    return response.data;
  },

  /**
   * Post an assistant-authored notice (no synthetic user message).
   */
  async postAssistantNotice(
    chatId: string,
    data: AssistantNoticeRequest
  ): Promise<AssistantNoticeResponse> {
    const response = await apiClient.post<AssistantNoticeResponse>(
      `${API}/chats/${chatId}/assistant-notice`,
      data
    );
    return response.data;
  },

  /**
   * Get message history for a chat.
   */
  async getMessages(
    chatId: string,
    options: MessageFilters = {}
  ): Promise<PaginatedMessagesResponse> {
    const params = new URLSearchParams();
    if (options.limit) params.set("limit", String(options.limit));
    if (options.cursor) params.set("cursor", options.cursor);
    if (options.order) params.set("order", options.order);

    const query = params.toString();
    const response = await apiClient.get<PaginatedMessagesResponse>(
      `${API}/chats/${chatId}/messages${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  /**
   * Toggle star status on a chat.
   */
  async toggleStar(chatId: string, isStarred: boolean): Promise<Chat> {
    const response = await apiClient.patch<Chat>(`${API}/chats/${chatId}`, {
      is_starred: isStarred,
    });
    return response.data;
  },

  /**
   * Move chat to a project (or remove with project_id = "").
   */
  async moveToProject(chatId: string, projectId: string | null): Promise<Chat> {
    const response = await apiClient.patch<Chat>(`${API}/chats/${chatId}`, {
      project_id: projectId ?? "",
    });
    return response.data;
  },
};
