import { NextFunction, Request, Response } from 'express';
import { z, ZodIssue } from 'zod';

export const validate =
  (schema: z.ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue: ZodIssue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(400).json({ errors });
    }

    req.body = result.data;

    next();
  };

