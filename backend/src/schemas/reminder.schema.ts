import { z } from "zod";

export const getRemindersQuerySchema = z
  .object({
    query: z.object({
      isSent: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
      from: z.coerce.date().optional(),
      to: z.coerce.date().optional(),
    }),
  })
  .refine(
    (data) => {
      if (!data.query.from || !data.query.to) {
        return true;
      }

      return data.query.from <= data.query.to;
    },
    {
      message: "from must be before or equal to to",
      path: ["query", "from"],
    },
  );

export const createReminderSchema = z.object({
  body: z.object({
    message: z.string().trim().min(1).max(500),
    remindAt: z.coerce.date(),
    isSent: z.boolean().optional(),
  }),
});

export const updateReminderSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      message: z.string().trim().min(1).max(500).optional(),
      remindAt: z.coerce.date().optional(),
      isSent: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});

export const reminderIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
