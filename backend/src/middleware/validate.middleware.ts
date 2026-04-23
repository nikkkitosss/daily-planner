import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as {
        body?: unknown;
        params?: Record<string, string>;
        query?: Request["query"];
      };

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }

      if (parsed.params !== undefined) {
        req.params = parsed.params;
      }

      if (parsed.query !== undefined) {
        const query = req.query as Record<string, unknown>;

        for (const key of Object.keys(query)) {
          delete query[key];
        }

        Object.assign(query, parsed.query);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
