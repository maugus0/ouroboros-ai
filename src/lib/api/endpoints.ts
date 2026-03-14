import { env } from "@/config/env";

const BASE = env.API_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE}/auth/login`,
    SIGNUP: `${BASE}/auth/signup`,
    ME: `${BASE}/auth/me`,
    REFRESH: `${BASE}/auth/refresh`,
    LOGOUT: `${BASE}/auth/logout`,
  },
} as const;
