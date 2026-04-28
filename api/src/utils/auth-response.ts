import { Response } from 'express';
import { ErrorResponse } from '../types/index';

export function sendAuthError(
  res: Response,
  status_code: number,
  message: string,
): void {
  const body: ErrorResponse = { error: message };
  res.status(status_code).json(body);
}
