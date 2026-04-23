import { z } from "zod";

export const getEventsQuerySchema = z
  .object({
    query: z.object({
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

export const createEventSchema = z
  .object({
    body: z.object({
      title: z.string().trim().min(1).max(200),
      description: z.string().trim().max(2000).optional(),
      startTime: z.coerce.date(),
      endTime: z.coerce.date(),
    }),
  })
  .refine((data) => data.body.endTime > data.body.startTime, {
    message: "endTime must be after startTime",
    path: ["body", "endTime"],
  });

export const eventIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const updateEventSchema = z
  .object({
    params: z.object({
      id: z.string().min(1),
    }),
    body: z
      .object({
        title: z.string().trim().min(1).max(200).optional(),
        description: z.string().trim().max(2000).nullable().optional(),
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required",
      }),
  })
  .refine(
    (data) => {
      if (!data.body.startTime || !data.body.endTime) {
        return true;
      }

      return data.body.endTime > data.body.startTime;
    },
    {
      message: "endTime must be after startTime",
      path: ["body", "endTime"],
    },
  );
