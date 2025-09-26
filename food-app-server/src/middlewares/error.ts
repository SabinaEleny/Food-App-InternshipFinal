import { NextFunction, Request, Response } from 'express';

export type AppError = Error & { status?: number };

export function error(req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ error: `Not Found - ${req.originalUrl}` });
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}
