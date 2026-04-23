/**
 * Environment Configuration — ouroboros-ai
 */

const getApiBaseUrl = (): string => {
  try {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl) return envUrl;
    if (import.meta.env.DEV) {
      console.warn("⚠️ VITE_API_BASE_URL is not set. Falling back to http://localhost:8000");
    }
    return "http://localhost:8000";
  } catch {
    return "http://localhost:8000";
  }
};

export const env = {
  API_BASE_URL: getApiBaseUrl(),
  API_VERSION: import.meta.env.VITE_API_VERSION || "v1",
  /** App version from build (e.g. v1.0.0); set by CI when deploying from a tag. */
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "",

  get API_URL(): string {
    return `${this.API_BASE_URL}/api/${this.API_VERSION}`;
  },

  /** API path prefix (e.g., "/api/v1") for use in API modules */
  get API_PATH(): string {
    return `/api/${this.API_VERSION}`;
  },

  TOKEN_REFRESH_INTERVAL: 10 * 60 * 1000,
  TOKEN_REFRESH_THRESHOLD: 2 * 60 * 1000,

  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 60_000,

  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

export type EnvConfig = typeof env;

if (import.meta.env.DEV) {
  console.log("🔧 OuroborosAI API:", {
    API_BASE_URL: env.API_BASE_URL,
    API_URL: env.API_URL,
    source: import.meta.env.VITE_API_BASE_URL ? "env var" : "fallback",
  });
}
