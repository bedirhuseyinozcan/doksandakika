import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';
import { AppError } from './errorHandler';

export const requireAdminAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const apiKeyHeader = req.headers['x-api-key'] as string | undefined;
  const authHeader = req.headers.authorization;

  let providedKey = apiKeyHeader?.trim();
  if (!providedKey && authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      providedKey = authHeader.slice('Bearer '.length).trim();
    } else {
      providedKey = authHeader.trim();
    }
  }

  if (!providedKey || providedKey !== ENV.ADMIN_API_KEY) {
    return next(new AppError('Yetkisiz erişim: Geçersiz Kora Admin API Anahtarı.', 401));
  }

  next();
};
