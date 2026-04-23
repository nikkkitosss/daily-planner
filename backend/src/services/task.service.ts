import { TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "../prisma/client";
import { ApiError } from "../utils/apiError";

const taskInclude = {
  taskTags: {
    include: {
      tag: true,
    },
  },
} as const;

const ensureTagsBelongToUser = async (
  tagIds: string[] | undefined,
  userId: string,
) => {
  if (!tagIds || tagIds.length === 0) {
    return;
  }

  const uniqueTagIds = Array.from(new Set(tagIds));

  const foundCount = await prisma.tag.count({
    where: {
      id: { in: uniqueTagIds },
      userId,
    },
  });

  if (foundCount !== uniqueTagIds.length) {
    throw new ApiError(400, "One or more tags are invalid");
  }
};

export const createTask = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date;
    tagIds?: string[];
  },
) => {
  await ensureTagsBelongToUser(data.tagIds, userId);

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      userId,
      taskTags: data.tagIds
        ? {
            create: Array.from(new Set(data.tagIds)).map((tagId) => ({
              tagId,
            })),
          }
        : undefined,
    },
    include: taskInclude,
  });
};

export const getTasksWithFilters = async (
  userId: string,
  filters: {
    status?: TaskStatus;
    priority?: TaskPriority;
    dueFrom?: Date;
    dueTo?: Date;
    search?: string;
  },
) => {
  const where = {
    userId,
    status: filters.status,
    priority: filters.priority,
    dueDate:
      filters.dueFrom || filters.dueTo
        ? {
            gte: filters.dueFrom,
            lte: filters.dueTo,
          }
        : undefined,
    OR: filters.search
      ? [
          {
            title: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
          {
            description: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
        ]
      : undefined,
  };

  return prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
    include: taskInclude,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

export const updateTask = async (
  userId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date | null;
    tagIds?: string[];
  },
) => {
  await getTaskById(userId, taskId);

  if (data.tagIds) {
    await ensureTagsBelongToUser(data.tagIds, userId);
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      taskTags: data.tagIds
        ? {
            deleteMany: {},
            create: Array.from(new Set(data.tagIds)).map((tagId) => ({
              tagId,
            })),
          }
        : undefined,
    },
    include: taskInclude,
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  await getTaskById(userId, taskId);

  await prisma.task.delete({
    where: { id: taskId },
  });
};

export const updateTaskStatus = async (
  userId: string,
  taskId: string,
  status: TaskStatus,
) => {
  await getTaskById(userId, taskId);

  return prisma.task.update({
    where: { id: taskId },
    data: { status },
    include: taskInclude,
  });
};
