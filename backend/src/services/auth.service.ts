import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client";
import { ApiError } from "../utils/apiError";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { toSafeUser } from "../utils/sanitize";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new ApiError(409, "Email is already registered");
  }

  const password = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password,
    },
  });

  const accessToken = signAccessToken(user.id, user.email);
  const refreshToken = signRefreshToken(user.id, user.email);

  return {
    user: toSafeUser(user),
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(data.password, user.password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = signAccessToken(user.id, user.email);
  const refreshToken = signRefreshToken(user.id, user.email);

  return {
    user: toSafeUser(user),
    accessToken,
    refreshToken,
  };
};

export const refreshSession = async (refreshToken: string) => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const nextAccessToken = signAccessToken(user.id, user.email);
  const nextRefreshToken = signRefreshToken(user.id, user.email);

  return {
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
  };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return toSafeUser(user);
};
