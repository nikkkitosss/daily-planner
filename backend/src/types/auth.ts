import type { Request } from "express";

export type AuthUser = {
  userId: string;
  email: string;
};

export type RequestWithAuth = Request & {
  auth?: AuthUser;
};
