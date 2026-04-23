import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getUserProfile, updateUserProfile } from "../services/user.service";
import { requireAuthUser } from "../utils/requireAuthUser";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const auth = requireAuthUser(req);
  const user = await getUserProfile(auth.userId);
  res.status(200).json({ user });
});

export const patchProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const user = await updateUserProfile(auth.userId, req.body);
    res.status(200).json({ user });
  },
);
