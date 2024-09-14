import { Response } from 'express';

import { ApiError } from './errors';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | undefined;
}

export function success<T = unknown>(res: Response, data?: T) {
  return res.status(200).json({
    code: 200,
    message: 'OK',
    data,
  });
}

export function badRequest(res: Response, code?: number, message?: string) {
  const err = ApiError.resolve(code ?? 400, message);
  return res.status(400).json({
    code: err.code,
    message: err.message,
  });
}

export function notFound(res: Response, code?: number, message?: string) {
  const err = ApiError.resolve(code ?? 404, message);
  return res.status(404).json({
    code: err.code,
    message: err.message,
  });
}

export function internalServerError(res: Response, code?: number, message?: string) {
  const err = ApiError.resolve(code ?? 500, message);
  return res.status(500).json({
    code: err.code,
    message: err.message,
  });
}
