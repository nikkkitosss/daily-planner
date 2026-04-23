import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/auth.service";
import { SafeUser } from "../types/api";
import { tokenStore } from "../utils/token";

type AuthContextValue = {
  user: SafeUser | null;
  token: string | null;
  initializing: boolean;
  isAuthenticated: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [token, setToken] = useState<string | null>(() => tokenStore.get());
  const [initializing, setInitializing] = useState(true);

  const applySession = useCallback((nextUser: SafeUser, nextToken: string) => {
    tokenStore.set(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setToken(null);
    setUser(null);
  }, []);

  const refreshMe = useCallback(async () => {
    const currentToken = tokenStore.get();

    if (!currentToken) {
      logout();
      return;
    }

    try {
      const currentUser = await authService.me();
      setUser(currentUser);
      setToken(currentToken);
    } catch {
      logout();
    }
  }, [logout]);

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      const result = await authService.login(input);
      applySession(result.user, result.accessToken);
    },
    [applySession],
  );

  const register = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const result = await authService.register(input);
      applySession(result.user, result.accessToken);
    },
    [applySession],
  );

  useEffect(() => {
    const init = async () => {
      await refreshMe();
      setInitializing(false);
    };

    void init();
  }, [refreshMe]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      refreshMe,
    }),
    [initializing, login, logout, refreshMe, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
