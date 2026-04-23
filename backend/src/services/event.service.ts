import { prisma } from "../prisma/client";
import { ApiError } from "../utils/apiError";

export const createEvent = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
  },
) => {
  return prisma.event.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getEvents = async (
  userId: string,
  filters?: {
    from?: Date;
    to?: Date;
  },
) => {
  return prisma.event.findMany({
    where: {
      userId,
      startTime:
        filters?.from || filters?.to
          ? {
              gte: filters?.from,
              lte: filters?.to,
            }
          : undefined,
    },
    orderBy: { startTime: "asc" },
  });
};

export const getEventById = async (userId: string, eventId: string) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      userId,
    },
  });

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return event;
};

export const deleteEvent = async (userId: string, eventId: string) => {
  await getEventById(userId, eventId);
  await prisma.event.delete({ where: { id: eventId } });
};

export const updateEvent = async (
  userId: string,
  eventId: string,
  data: {
    title?: string;
    description?: string | null;
    startTime?: Date;
    endTime?: Date;
  },
) => {
  const current = await getEventById(userId, eventId);

  const nextStartTime = data.startTime ?? current.startTime;
  const nextEndTime = data.endTime ?? current.endTime;

  if (nextEndTime <= nextStartTime) {
    throw new ApiError(400, "endTime must be after startTime");
  }

  return prisma.event.update({
    where: { id: eventId },
    data,
  });
};
