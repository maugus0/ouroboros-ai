import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  isTokenExpired,
} from "@/utils/tokenStorage";
import type { TokenResponse } from "@/types/auth";
import { env } from "@/config/env";

const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: env.API_TIMEOUT,
});

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (value: string | InternalAxiosRequestConfig) => void;
  reject: (error: Error) => void;
}> = [];

function processRefreshQueue(error: Error | null, token: string | null) {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  refreshQueue = [];
}

const PUBLIC_ENDPOINTS = [
  "/auth/signup",
  "/auth/login",
  "/auth/verify-otp",
  "/auth/resend-otp",
  "/auth/refresh",
  "/auth/mfa/verify",
  "/auth/forgot-password",
  "/health",
];

function isPublicEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  const path = url.replace(env.API_BASE_URL, "");
  return PUBLIC_ENDPOINTS.some((ep) => path.startsWith(ep));
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post<TokenResponse>(`${env.API_BASE_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  });
  const { access_token, refresh_token: newRefresh, expires_in } = response.data;
  setTokens(access_token, newRefresh, expires_in);
  return access_token;
}

function handleAuthFailure(): void {
  clearTokens();
  window.location.href = "/login";
}

// Request interceptor: attach Bearer token, proactive refresh
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    }

    if (isPublicEndpoint(config.url)) return config;

    let accessToken = getAccessToken();

    if (accessToken && isTokenExpired(60)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          accessToken = await refreshAccessToken();
          processRefreshQueue(null, accessToken);
        } catch (refreshError) {
          processRefreshQueue(refreshError as Error, null);
          handleAuthFailure();
          return Promise.reject(new Error("Token refresh failed"));
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise<InternalAxiosRequestConfig>((resolve, reject) => {
          refreshQueue.push({
            resolve: (token) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(config);
            },
            reject,
          });
        });
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 with retry (with race condition guard)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processRefreshQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processRefreshQueue(refreshError as Error, null);
        handleAuthFailure();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

interface PydanticValidationError {
  type: string;
  loc: (string | number)[];
  msg: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

type ApiErrorDetail = string | PydanticValidationError[];

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: ApiErrorDetail } | undefined;
    const detail = data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail) && detail.length > 0) {
      const firstError = detail[0];
      if (firstError && typeof firstError === "object" && "msg" in firstError) {
        return (firstError as PydanticValidationError).msg;
      }
    }

    return error.message || "An error occurred";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
