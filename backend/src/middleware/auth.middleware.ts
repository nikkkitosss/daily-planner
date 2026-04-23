import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/apiError";
import type { RequestWithAuth } from "../types/auth";

export const authMiddleware = (
  req: RequestWithAuth,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new ApiError(401, "Unauthorized"));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);

    if (
      typeof payload.sub !== "string" ||
      payload.sub.trim().length === 0 ||
      typeof payload.email !== "string" ||
      payload.email.trim().length === 0
    ) {
      next(new ApiError(401, "Invalid or expired token"));
      return;
    }

    req.auth = {
      userId: payload.sub,
      email: payload.email,
    };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
