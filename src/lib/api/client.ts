import type { ApiError } from "@/types/api.types";

type RequestOptions = RequestInit & {
  token?: string | null;
};

class ApiClient {
  private getHeaders(token?: string | null): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: "An error occurred",
        status: response.status,
      };
      try {
        const body = await response.json();
        error.message = body.detail || body.message || error.message;
        error.detail = body.detail;
      } catch {
        /* response body not JSON */
      }
      throw error;
    }
    return response.json() as Promise<T>;
  }

  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { token, ...init } = options;
    const response = await fetch(url, {
      ...init,
      method: "GET",
      headers: this.getHeaders(token),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const { token, ...init } = options;
    const response = await fetch(url, {
      ...init,
      method: "POST",
      headers: this.getHeaders(token),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const { token, ...init } = options;
    const response = await fetch(url, {
      ...init,
      method: "PUT",
      headers: this.getHeaders(token),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { token, ...init } = options;
    const response = await fetch(url, {
      ...init,
      method: "DELETE",
      headers: this.getHeaders(token),
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
