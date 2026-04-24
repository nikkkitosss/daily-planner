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

  return jwt.sign({ sub: userId, email, tokenType: "access" }, secret, {
    expiresIn,
  });
};

export const signRefreshToken = (userId: string, email: string): string => {
  const secret = getJwtSecret();
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ||
    "7d") as jwt.SignOptions["expiresIn"];

  return jwt.sign({ sub: userId, email, tokenType: "refresh" }, secret, {
    expiresIn,
  });
};

export type JwtPayload = {
  sub: string;
  email: string;
  tokenType?: "access" | "refresh";
  iat?: number;
  exp?: number;
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const secret = getJwtSecret();
  const payload = jwt.verify(token, secret) as JwtPayload;

  if (payload.tokenType !== "access") {
    throw new ApiError(401, "Invalid token type");
  }

  return payload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const secret = getJwtSecret();
  const payload = jwt.verify(token, secret) as JwtPayload;

  if (payload.tokenType !== "refresh") {
    throw new ApiError(401, "Invalid token type");
  }

  return payload;
};
