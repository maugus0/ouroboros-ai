import apiClient, { getErrorMessage } from "./client";
import type {
  SignupRequest,
  SignupResponse,
  VerifyOTPRequest,
  ResendOTPRequest,
  LoginRequest,
  LoginResponse,
  TokenResponse,
  MfaRequiredResponse,
  VerifyMfaRequest,
  MfaToggleRequest,
  MfaToggleResponse,
  ResendOTPResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ForgotPasswordVerifyRequest,
  ResetPasswordRequest,
  ProfileUpdateRequest,
  ProfileStatusResponse,
  MessageResponse,
  User,
  AuthSession,
} from "@/types/auth";

function isMfaRequired(data: LoginResponse): data is MfaRequiredResponse {
  return "mfa_required" in data && data.mfa_required === true;
}

export const authApi = {
  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await apiClient.post<SignupResponse>("/auth/signup", data);
    return response.data;
  },

  async verifyOTP(data: VerifyOTPRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>("/auth/verify-otp", data);
    return response.data;
  },

  async resendOTP(data: ResendOTPRequest): Promise<ResendOTPResponse> {
    const response = await apiClient.post<ResendOTPResponse>("/auth/resend-otp", data);
    return response.data;
  },

  /**
   * Login returns either a TokenResponse (200) or MfaRequiredResponse (202).
   * Axios treats 2xx as success, so both resolve here.
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  async verifyMfa(data: VerifyMfaRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>("/auth/mfa/verify", data);
    return response.data;
  },

  async toggleMfa(data: MfaToggleRequest): Promise<MfaToggleResponse> {
    const response = await apiClient.post<MfaToggleResponse>("/auth/mfa/toggle", data);
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", data);
    return response.data;
  },

  async forgotPasswordVerify(data: ForgotPasswordVerifyRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>("/auth/forgot-password/verify", data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>("/auth/reset-password", data);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  async logout(): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>("/auth/logout");
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  async updateProfile(data: ProfileUpdateRequest): Promise<User> {
    const response = await apiClient.patch<User>("/auth/profile", data);
    return response.data;
  },

  async getProfileStatus(): Promise<ProfileStatusResponse> {
    const response = await apiClient.get<ProfileStatusResponse>("/auth/profile-status");
    return response.data;
  },

  async getSessions(activeOnly: boolean = true): Promise<AuthSession[]> {
    const response = await apiClient.get<AuthSession[]>("/auth/sessions", {
      params: { active_only: activeOnly },
    });
    return response.data;
  },
};

export { getErrorMessage, isMfaRequired };
