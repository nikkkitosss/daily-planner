import { ApiError } from "./apiError";
import type { AuthUser, RequestWithAuth } from "../types/auth";

export const requireAuthUser = (req: RequestWithAuth): AuthUser => {
  if (!req.auth?.userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return req.auth;
};
