import { z } from "zod";

const taskStatus = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
const taskPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const getTasksQuerySchema = z
  .object({
    query: z.object({
      status: taskStatus.optional(),
      priority: taskPriority.optional(),
      dueFrom: z.coerce.date().optional(),
      dueTo: z.coerce.date().optional(),
      search: z.string().trim().min(1).max(200).optional(),
    }),
  })
  .refine(
    (data) => {
      if (!data.query.dueFrom || !data.query.dueTo) {
        return true;
      }

      return data.query.dueFrom <= data.query.dueTo;
    },
    {
      message: "dueFrom must be before or equal to dueTo",
      path: ["query", "dueFrom"],
    },
  );

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000).optional(),
    status: taskStatus.optional(),
    priority: taskPriority.optional(),
    dueDate: z.coerce.date().optional(),
    tagIds: z.array(z.string().min(1)).optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      title: z.string().trim().min(1).max(200).optional(),
      description: z.string().trim().max(2000).nullable().optional(),
      status: taskStatus.optional(),
      priority: taskPriority.optional(),
      dueDate: z.coerce.date().nullable().optional(),
      tagIds: z.array(z.string().min(1)).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});

export const updateTaskStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: taskStatus,
  }),
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
