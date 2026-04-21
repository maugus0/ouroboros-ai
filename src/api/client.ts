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
  timeout: 30_000,
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function processFailedQueue(error: Error | null, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
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
      delete config.headers["Content-Type"];
    }

    if (isPublicEndpoint(config.url)) return config;

    let accessToken = getAccessToken();

    if (accessToken && isTokenExpired(60)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          accessToken = await refreshAccessToken();
          onTokenRefreshed(accessToken);
        } catch {
          handleAuthFailure();
          return Promise.reject(new Error("Token refresh failed"));
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise<InternalAxiosRequestConfig>((resolve) => {
          subscribeTokenRefresh((token: string) => {
            config.headers.Authorization = `Bearer ${token}`;
            resolve(config);
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
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject: (err: Error) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processFailedQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processFailedQueue(refreshError as Error, null);
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

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: string } | undefined;
    return data?.detail || error.message || "An error occurred";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
