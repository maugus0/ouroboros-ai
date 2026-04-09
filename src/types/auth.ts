// ============ API Request Types ============

export interface SignupRequest {
  username: string;
  phone_number: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface VerifyOTPRequest {
  phone_number: string;
  otp_code: string;
}

export interface ResendOTPRequest {
  phone_number: string;
}

export interface LoginRequest {
  phone_number?: string;
  username?: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  gender?: Gender;
  email?: string;
  about_me?: string;
  profession?: string;
  interest?: Interest;
}

// ============ API Response Types ============

export interface SignupResponse {
  user_id: string;
  username: string;
  phone_number: string;
  message: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface ProfileStatusResponse {
  profile_completed: boolean;
  phone_verified: boolean;
}

export interface MessageResponse {
  message: string;
}

export interface ResendOTPResponse {
  message: string;
  phone_number: string;
}

// Backend returns 202 when MFA is required instead of normal TokenResponse
export interface MfaRequiredResponse {
  mfa_required: true;
  user_id: string;
  phone_number: string;
  message: string;
}

export interface VerifyMfaRequest {
  user_id: string;
  otp_code: string;
}

export interface MfaToggleRequest {
  enabled: boolean;
}

export interface MfaToggleResponse {
  mfa_enabled: boolean;
  message: string;
}

export type LoginResponse = TokenResponse | MfaRequiredResponse;

export interface ForgotPasswordRequest {
  phone_number: string;
}

export interface ForgotPasswordResponse {
  user_id: string;
  phone_number: string;
  message: string;
}

export interface ForgotPasswordVerifyRequest {
  user_id: string;
  otp_code: string;
  new_password: string;
}

export interface ResetPasswordRequest {
  current_password: string;
  new_password: string;
}

export interface AuthSession {
  id: string;
  user_agent: string | null;
  ip_address: string | null;
  is_revoked: boolean;
  revoked_at: string | null;
  created_at: string;
  last_active_at: string | null;
  expires_at: string;
}

// ============ Domain Types ============

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type Interest = "jobs" | "startups" | "research" | "degree";

export interface User {
  id: string;
  username: string;
  phone_number: string;
  phone_country_code: string;
  phone_verified: boolean;
  first_name: string;
  last_name: string;
  gender: Gender | null;
  email: string | null;
  about_me: string | null;
  profession: string | null;
  interest: Interest | null;
  profile_completed: boolean;
  mfa_enabled: boolean;
  is_active: boolean;
  last_login: string | null;
  last_active: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Auth State ============

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "pending_otp"
  | "pending_mfa"
  | "pending_profile";

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null;
  error: string | null;
}

// ============ Country Codes ============

export interface CountryCode {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

export const ALLOWED_COUNTRIES: CountryCode[] = [
  { code: "SG", dialCode: "+65", name: "Singapore", flag: "\u{1F1F8}\u{1F1EC}" },
  { code: "IN", dialCode: "+91", name: "India", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "VN", dialCode: "+84", name: "Vietnam", flag: "\u{1F1FB}\u{1F1F3}" },
  { code: "ID", dialCode: "+62", name: "Indonesia", flag: "\u{1F1EE}\u{1F1E9}" },
  { code: "MY", dialCode: "+60", name: "Malaysia", flag: "\u{1F1F2}\u{1F1FE}" },
  { code: "US", dialCode: "+1", name: "United States", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "CA", dialCode: "+1", name: "Canada", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "AU", dialCode: "+61", name: "Australia", flag: "\u{1F1E6}\u{1F1FA}" },
];
