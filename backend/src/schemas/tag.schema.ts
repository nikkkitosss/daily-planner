import { z } from "zod";

export const createTagSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(50),
  }),
});

export const tagIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const updateTagSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z.string().trim().min(1).max(50),
  }),
});

export const tagTaskParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1),
    taskId: z.string().min(1),
  }),
});
