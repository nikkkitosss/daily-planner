import { api } from "./http";
import { SafeUser } from "../types/api";

export const userService = {
  async getProfile(): Promise<SafeUser> {
    const { data } = await api.get<{ user: SafeUser }>("/users/profile");
    return data.user;
  },

  async updateProfile(input: {
    name?: string;
    email?: string;
  }): Promise<SafeUser> {
    const { data } = await api.patch<{ user: SafeUser }>(
      "/users/profile",
      input,
    );
    return data.user;
  },
};
