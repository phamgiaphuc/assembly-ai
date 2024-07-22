import { NextFunction, Request, Response } from 'express';
import { logger } from '@/configs/logger.config';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, url, ip } = req;
  logger.info(`${method} ${url} ${ip}`);
  next();
};
