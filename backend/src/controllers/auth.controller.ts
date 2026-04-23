import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getMe, loginUser, registerUser } from "../services/auth.service";
import { requireAuthUser } from "../utils/requireAuthUser";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(200).json(result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const auth = requireAuthUser(req);
  const user = await getMe(auth.userId);
  res.status(200).json({ user });
});
