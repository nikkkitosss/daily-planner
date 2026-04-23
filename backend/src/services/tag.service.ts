import { prisma } from "../prisma/client";
import { ApiError } from "../utils/apiError";

export const createTag = async (userId: string, data: { name: string }) => {
  const existing = await prisma.tag.findFirst({
    where: {
      userId,
      name: data.name,
    },
  });

  if (existing) {
    throw new ApiError(409, "Tag already exists");
  }

  return prisma.tag.create({
    data: {
      name: data.name,
      userId,
    },
  });
};

export const getTags = async (userId: string) => {
  return prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
};

export const getTagById = async (userId: string, tagId: string) => {
  const tag = await prisma.tag.findFirst({
    where: {
      id: tagId,
      userId,
    },
  });

  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }

  return tag;
};

export const updateTag = async (
  userId: string,
  tagId: string,
  data: { name: string },
) => {
  await getTagById(userId, tagId);

  const existing = await prisma.tag.findFirst({
    where: {
      userId,
      name: data.name,
      NOT: { id: tagId },
    },
  });

  if (existing) {
    throw new ApiError(409, "Tag already exists");
  }

  return prisma.tag.update({
    where: { id: tagId },
    data,
  });
};

const ensureTaskBelongsToUser = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }
};

export const attachTagToTask = async (
  userId: string,
  tagId: string,
  taskId: string,
) => {
  await getTagById(userId, tagId);
  await ensureTaskBelongsToUser(userId, taskId);

  const existing = await prisma.taskTag.findUnique({
    where: {
      taskId_tagId: {
        taskId,
        tagId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.taskTag.create({
    data: {
      taskId,
      tagId,
    },
  });
};

export const detachTagFromTask = async (
  userId: string,
  tagId: string,
  taskId: string,
) => {
  await getTagById(userId, tagId);
  await ensureTaskBelongsToUser(userId, taskId);

  const existing = await prisma.taskTag.findUnique({
    where: {
      taskId_tagId: {
        taskId,
        tagId,
      },
    },
  });

  if (!existing) {
    throw new ApiError(404, "Tag is not attached to this task");
  }

  await prisma.taskTag.delete({
    where: {
      taskId_tagId: {
        taskId,
        tagId,
      },
    },
  });
};

export const deleteTag = async (userId: string, tagId: string) => {
  await getTagById(userId, tagId);

  await prisma.tag.delete({
    where: { id: tagId },
  });
};
