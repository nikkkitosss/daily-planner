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
import { refreshTokenStore, tokenStore } from "../utils/token";

type AuthContextValue = {
  user: SafeUser | null;
  token: string | null;
  refreshToken: string | null;
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
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    refreshTokenStore.get(),
  );
  const [initializing, setInitializing] = useState(true);

  const applySession = useCallback(
    (nextUser: SafeUser, nextToken: string, nextRefreshToken: string) => {
      tokenStore.set(nextToken);
      refreshTokenStore.set(nextRefreshToken);
      setToken(nextToken);
      setRefreshToken(nextRefreshToken);
      setUser(nextUser);
    },
    [],
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    refreshTokenStore.clear();
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const refreshMe = useCallback(async () => {
    const currentToken = tokenStore.get();
    const currentRefreshToken = refreshTokenStore.get();

    if (!currentToken || !currentRefreshToken) {
      logout();
      return;
    }

    try {
      const currentUser = await authService.me();
      setUser(currentUser);
      setToken(currentToken);
      setRefreshToken(currentRefreshToken);
    } catch {
      try {
        const nextTokens = await authService.refresh(currentRefreshToken);
        tokenStore.set(nextTokens.accessToken);
        refreshTokenStore.set(nextTokens.refreshToken);
        setToken(nextTokens.accessToken);
        setRefreshToken(nextTokens.refreshToken);

        const currentUser = await authService.me();
        setUser(currentUser);
      } catch {
        logout();
      }
    }
  }, [logout]);

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      const result = await authService.login(input);
      applySession(result.user, result.accessToken, result.refreshToken);
    },
    [applySession],
  );

  const register = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const result = await authService.register(input);
      applySession(result.user, result.accessToken, result.refreshToken);
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
      refreshToken,
      initializing,
      isAuthenticated: Boolean(user && token && refreshToken),
      login,
      register,
      logout,
      refreshMe,
    }),
    [
      initializing,
      login,
      logout,
      refreshMe,
      refreshToken,
      register,
      token,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
