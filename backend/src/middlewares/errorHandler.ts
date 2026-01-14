import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../config/constants";
import { Logger } from "../utils/logger";

export interface ApiError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  Logger.error("Error occurred", {
    message: err.message,
    stack: err.stack,
    path: req.path,
  });

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal server error";
  console.log(err);

  res.status(statusCode).json({
    error: message,
  });
}
