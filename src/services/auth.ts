import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { AuthResponse, LoginRequest, SignUpRequest, User } from "@/types/auth.types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data);
  },

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.SIGNUP, data);
  },

  async getMe(token: string): Promise<User> {
    return apiClient.get<User>(ENDPOINTS.AUTH.ME, { token });
  },

  async logout(token: string): Promise<void> {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT, undefined, { token });
  },
};
