import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { User } from "@/types/auth.types";

const MOCK_USER: User = {
  id: "1",
  email: "admin@ouroboros.ai",
  name: "Admin",
  created_at: new Date().toISOString(),
};

const MOCK_PASSWORD = "admin";
const MOCK_TOKEN = "mock-jwt-token-ouroboros";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getInitialState(): AuthState {
  const storedToken = localStorage.getItem("ouroboros_token");
  if (storedToken === MOCK_TOKEN) {
    return {
      user: MOCK_USER,
      token: storedToken,
      isAuthenticated: true,
      isLoading: false,
    };
  }
  localStorage.removeItem("ouroboros_token");
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(getInitialState);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));

    if (email === MOCK_USER.email && password === MOCK_PASSWORD) {
      localStorage.setItem("ouroboros_token", MOCK_TOKEN);
      setState({
        user: MOCK_USER,
        token: MOCK_TOKEN,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      throw { message: "Invalid email or password." };
    }
  }, []);

  const signUp = useCallback(async (email: string, _password: string, name: string) => {
    await new Promise((r) => setTimeout(r, 500));

    const newUser: User = { ...MOCK_USER, email, name };
    localStorage.setItem("ouroboros_token", MOCK_TOKEN);
    setState({
      user: newUser,
      token: MOCK_TOKEN,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ouroboros_token");
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const value = useMemo(
    () => ({ ...state, login, signUp, logout }),
    [state, login, signUp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
