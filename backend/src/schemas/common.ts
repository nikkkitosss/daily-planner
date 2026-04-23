import { z } from "zod";

export const emptyRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const taskAndTagIdParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1),
    taskId: z.string().min(1),
  }),
});
