import { api } from "./http";
import { AuthResponse, RefreshResponse, SafeUser } from "../types/api";

export const authService = {
  async register(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/register", input);
    return data;
  },

  async login(input: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", input);
    return data;
  },

  async me(): Promise<SafeUser> {
    const { data } = await api.get<{ user: SafeUser }>("/auth/me");
    return data.user;
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await api.post<RefreshResponse>("/auth/refresh", {
      refreshToken,
    });
    return data;
  },
};
