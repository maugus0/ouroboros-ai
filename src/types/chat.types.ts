/**
 * Chat & Project types matching Ouroboros Orchestrator backend API responses.
 */

// ─── Validation Constants ───────────────────────────────────────

export const MESSAGE_MAX_LENGTH = 10000;
export const CHAT_TITLE_MAX_LENGTH = 200;
export const PROJECT_NAME_MAX_LENGTH = 100;
export const PROJECT_DESCRIPTION_MAX_LENGTH = 500;

// ─── Chat Types ─────────────────────────────────────────────────

export interface Chat {
  id: string;
  title: string | null;
  status: "active" | "archived";
  is_starred: boolean;
  project_id: string | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ─── Project Types ──────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  chat_count: number;
  created_at: string;
  updated_at: string;
}

// ─── Request Types ──────────────────────────────────────────────

export interface CreateChatRequest {
  message?: string;
  project_id?: string;
}

export interface UpdateChatRequest {
  title?: string;
  is_starred?: boolean;
  project_id?: string; // empty string "" removes from project
}

export interface SendMessageRequest {
  content: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

// ─── Response Types ─────────────────────────────────────────────

export interface PaginatedChatsResponse {
  chats: Chat[];
  /** Opaque cursor for next page (base64-encoded timestamp). Pass to `cursor` param for next page. */
  next_cursor: string | null;
  total_count: number;
}

export interface PaginatedMessagesResponse {
  messages: Message[];
  /** Opaque cursor for next page (JSON-encoded `{t: ISO timestamp, id: message UUID}`). Pass to `cursor` param for next page. */
  next_cursor: string | null;
}

export interface PaginatedProjectsResponse {
  projects: Project[];
  next_cursor: string | null;
  total_count: number;
}

export interface SendMessageResponse {
  user_message: Message;
  assistant_message: Message;
  chat: Chat;
}

// ─── Filter Types ───────────────────────────────────────────────

export interface ChatFilters {
  starred?: boolean;
  project_id?: string;
  no_project?: boolean;
  limit?: number;
  cursor?: string;
}

export interface ProjectFilters {
  limit?: number;
  cursor?: string;
}

export interface MessageFilters {
  limit?: number;
  cursor?: string;
  order?: "asc" | "desc";
}
