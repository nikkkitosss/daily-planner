import { prisma } from "../prisma/client";
import { ApiError } from "../utils/apiError";
import { toSafeUser } from "../utils/sanitize";

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return toSafeUser(user);
};

export const updateUserProfile = async (
  userId: string,
  data: { name?: string; email?: string },
) => {
  if (data.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing && existing.id !== userId) {
      throw new ApiError(409, "Email is already in use");
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return toSafeUser(user);
};
