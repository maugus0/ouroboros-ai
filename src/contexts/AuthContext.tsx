import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  User,
  AuthStatus,
  SignupRequest,
  LoginRequest,
  ProfileUpdateRequest,
} from "@/types/auth";
import { authApi, getErrorMessage, isMfaRequired } from "@/api/authApi";
import {
  setTokens,
  clearTokens,
  hasStoredTokens,
  getAccessToken,
  setProfileSkipped,
  hasProfileSkip,
  clearProfileSkip,
} from "@/utils/tokenStorage";

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingPhone: string | null;
  pendingMfaUserId: string | null;
  pendingMfaPhone: string | null;

  signup: (data: SignupRequest) => Promise<void>;
  verifyOTP: (otpCode: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  verifyMfa: (otpCode: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateRequest) => Promise<void>;
  skipProfileCompletion: () => void;
  resetAuthFlow: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [pendingMfaUserId, setPendingMfaUserId] = useState<string | null>(null);
  const [pendingMfaPhone, setPendingMfaPhone] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated" || status === "pending_profile";
  const isLoading = status === "loading" || status === "idle";

  useEffect(() => {
    async function checkAuth() {
      if (!hasStoredTokens()) {
        setStatus("unauthenticated");
        return;
      }

      setStatus("loading");

      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);

        if (userData.profile_completed) {
          clearProfileSkip();
          setStatus("authenticated");
        } else if (hasProfileSkip()) {
          setStatus("authenticated");
        } else {
          setStatus("pending_profile");
        }
      } catch {
        clearTokens();
        setStatus("unauthenticated");
        setUser(null);
      }
    }

    checkAuth();
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    setStatus("loading");
    setError(null);

    try {
      await authApi.signup(data);
      setPendingPhone(data.phone_number);
      setStatus("pending_otp");
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus("unauthenticated");
      throw err;
    }
  }, []);

  const verifyOTP = useCallback(
    async (otpCode: string) => {
      if (!pendingPhone) {
        setError("No phone number pending verification");
        return;
      }

      setStatus("loading");
      setError(null);

      try {
        const response = await authApi.verifyOTP({
          phone_number: pendingPhone,
          otp_code: otpCode,
        });

        setTokens(response.access_token, response.refresh_token, response.expires_in);
        setUser(response.user);
        setPendingPhone(null);

        if (!response.user.profile_completed) {
          setStatus("pending_profile");
          navigate("/profile/complete");
        } else {
          setStatus("authenticated");
          navigate("/dashboard");
        }
      } catch (err) {
        setError(getErrorMessage(err));
        setStatus("pending_otp");
        throw err;
      }
    },
    [pendingPhone, navigate]
  );

  const resendOTP = useCallback(async () => {
    if (!pendingPhone) {
      setError("No phone number pending verification");
      return;
    }

    setError(null);

    try {
      await authApi.resendOTP({ phone_number: pendingPhone });
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [pendingPhone]);

  /** Completes the token flow after credentials are validated (shared by login + MFA verify). */
  const completeLogin = useCallback(
    (response: { access_token: string; refresh_token: string; expires_in: number; user: User }) => {
      setTokens(response.access_token, response.refresh_token, response.expires_in);
      setUser(response.user);
      setPendingMfaUserId(null);
      setPendingMfaPhone(null);

      if (!response.user.profile_completed) {
        setStatus("pending_profile");
        navigate("/profile/complete");
      } else {
        setStatus("authenticated");
        navigate("/dashboard");
      }
    },
    [navigate]
  );

  const login = useCallback(
    async (data: LoginRequest) => {
      setStatus("loading");
      setError(null);

      try {
        const response = await authApi.login(data);

        if (isMfaRequired(response)) {
          setPendingMfaUserId(response.user_id);
          setPendingMfaPhone(response.phone_number);
          setStatus("pending_mfa");
          return;
        }

        completeLogin(response);
      } catch (err) {
        const msg = getErrorMessage(err);

        if (msg.toLowerCase().includes("phone not verified") && data.phone_number) {
          setPendingPhone(data.phone_number);
          setStatus("pending_otp");
          try {
            await authApi.resendOTP({ phone_number: data.phone_number });
          } catch {
            // OTP may already have been sent
          }
          return;
        }

        setError(msg);
        setStatus("unauthenticated");
        throw err;
      }
    },
    [completeLogin]
  );

  const verifyMfa = useCallback(
    async (otpCode: string) => {
      if (!pendingMfaUserId) {
        setError("No MFA challenge pending");
        return;
      }

      setStatus("loading");
      setError(null);

      try {
        const response = await authApi.verifyMfa({
          user_id: pendingMfaUserId,
          otp_code: otpCode,
        });

        completeLogin(response);
      } catch (err) {
        setError(getErrorMessage(err));
        setStatus("pending_mfa");
        throw err;
      }
    },
    [pendingMfaUserId, completeLogin]
  );

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) {
        await authApi.logout();
      }
    } catch {
      // Ignore -- we're logging out anyway
    } finally {
      clearTokens();
      setUser(null);
      setStatus("unauthenticated");
      setPendingPhone(null);
      setPendingMfaUserId(null);
      setPendingMfaPhone(null);
      navigate("/login");
    }
  }, [navigate]);

  const updateProfile = useCallback(
    async (data: ProfileUpdateRequest) => {
      setError(null);

      try {
        const updatedUser = await authApi.updateProfile(data);
        setUser(updatedUser);

        if (updatedUser.profile_completed && status === "pending_profile") {
          setStatus("authenticated");
          navigate("/dashboard");
        }
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      }
    },
    [status, navigate]
  );

  const skipProfileCompletion = useCallback(() => {
    setProfileSkipped();
    setStatus("authenticated");
    navigate("/dashboard");
  }, [navigate]);

  const resetAuthFlow = useCallback(() => {
    setError(null);
    setPendingPhone(null);
    setPendingMfaUserId(null);
    setPendingMfaPhone(null);
    setStatus("unauthenticated");
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      if (userData.profile_completed) {
        clearProfileSkip();
        setStatus("authenticated");
      } else if (hasProfileSkip()) {
        setStatus("authenticated");
      } else {
        setStatus("pending_profile");
      }
    } catch {
      // Silently fail; interceptors handle token expiration
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      status,
      isAuthenticated,
      isLoading,
      error,
      pendingPhone,
      pendingMfaUserId,
      pendingMfaPhone,
      signup,
      verifyOTP,
      resendOTP,
      login,
      verifyMfa,
      logout,
      updateProfile,
      skipProfileCompletion,
      resetAuthFlow,
      clearError,
      refreshUser,
    }),
    [
      user,
      status,
      isAuthenticated,
      isLoading,
      error,
      pendingPhone,
      pendingMfaUserId,
      pendingMfaPhone,
      signup,
      verifyOTP,
      resendOTP,
      login,
      verifyMfa,
      logout,
      updateProfile,
      skipProfileCompletion,
      resetAuthFlow,
      clearError,
      refreshUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
