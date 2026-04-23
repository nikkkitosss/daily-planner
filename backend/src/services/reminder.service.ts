import { prisma } from "../prisma/client";
import { ApiError } from "../utils/apiError";

export const createReminder = async (
  userId: string,
  data: {
    message: string;
    remindAt: Date;
    isSent?: boolean;
  },
) => {
  if (data.isSent && data.remindAt > new Date()) {
    throw new ApiError(400, "Cannot mark reminder as sent before remindAt");
  }

  return prisma.reminder.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getReminders = async (
  userId: string,
  filters?: {
    isSent?: boolean;
    from?: Date;
    to?: Date;
  },
) => {
  return prisma.reminder.findMany({
    where: {
      userId,
      isSent: filters?.isSent,
      remindAt:
        filters?.from || filters?.to
          ? {
              gte: filters?.from,
              lte: filters?.to,
            }
          : undefined,
    },
    orderBy: { remindAt: "asc" },
  });
};

export const getReminderById = async (userId: string, reminderId: string) => {
  const reminder = await prisma.reminder.findFirst({
    where: {
      id: reminderId,
      userId,
    },
  });

  if (!reminder) {
    throw new ApiError(404, "Reminder not found");
  }

  return reminder;
};

export const updateReminder = async (
  userId: string,
  reminderId: string,
  data: {
    message?: string;
    remindAt?: Date;
    isSent?: boolean;
  },
) => {
  const reminder = await getReminderById(userId, reminderId);

  const nextRemindAt = data.remindAt ?? reminder.remindAt;
  const nextIsSent = data.isSent ?? reminder.isSent;

  if (nextIsSent && nextRemindAt > new Date()) {
    throw new ApiError(400, "Cannot mark reminder as sent before remindAt");
  }

  return prisma.reminder.update({
    where: { id: reminderId },
    data,
  });
};

export const deleteReminder = async (userId: string, reminderId: string) => {
  await getReminderById(userId, reminderId);

  await prisma.reminder.delete({ where: { id: reminderId } });
};
