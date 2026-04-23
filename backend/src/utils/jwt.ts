import jwt from "jsonwebtoken";
import { ApiError } from "./apiError";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, "JWT_SECRET is not configured");
  }

  return secret;
};

export const signAccessToken = (userId: string, email: string): string => {
  const secret = getJwtSecret();
  const expiresIn = (process.env.JWT_EXPIRES_IN ||
    "1d") as jwt.SignOptions["expiresIn"];

  return jwt.sign({ sub: userId, email }, secret, { expiresIn });
};

export type JwtPayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as JwtPayload;
};
