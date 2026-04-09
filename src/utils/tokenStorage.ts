const ACCESS_TOKEN_KEY = "ouroboros_access_token";
const REFRESH_TOKEN_KEY = "ouroboros_refresh_token";
const TOKEN_EXPIRY_KEY = "ouroboros_token_expiry";
const PROFILE_SKIP_KEY = "ouroboros_profile_skipped";

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export function setTokens(
  accessToken: string,
  refreshToken: string,
  expiresInSeconds: number
): void {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
}

export function getTokens(): StoredTokens | null {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const expiresAtStr = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!accessToken || !refreshToken || !expiresAtStr) {
    return null;
  }

  const expiresAt = parseInt(expiresAtStr, 10);
  if (!Number.isFinite(expiresAt)) {
    clearTokens();
    return null;
  }

  return { accessToken, refreshToken, expiresAt };
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function isTokenExpired(bufferSeconds: number = 60): boolean {
  const expiresAtStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiresAtStr) return true;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (!Number.isFinite(expiresAt)) return true;
  return Date.now() >= expiresAt - bufferSeconds * 1000;
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  clearProfileSkip();
}

export function hasStoredTokens(): boolean {
  return !!(
    localStorage.getItem(ACCESS_TOKEN_KEY) &&
    localStorage.getItem(REFRESH_TOKEN_KEY) &&
    localStorage.getItem(TOKEN_EXPIRY_KEY)
  );
}

export function setProfileSkipped(): void {
  localStorage.setItem(PROFILE_SKIP_KEY, "1");
}

export function hasProfileSkip(): boolean {
  return localStorage.getItem(PROFILE_SKIP_KEY) === "1";
}

export function clearProfileSkip(): void {
  localStorage.removeItem(PROFILE_SKIP_KEY);
}
