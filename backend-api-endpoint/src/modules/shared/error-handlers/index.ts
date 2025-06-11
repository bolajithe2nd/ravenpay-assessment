// src/utils/errors/error-handler.ts
import { Request, Response, NextFunction } from "express";
import {
  HttpError,
  // InternalServerError,
  NotFoundError,
  ValidationError,
} from "./custom-errors";

interface ErrorResponse {
  error: boolean;
  message: string;
  stack?: string;
  details?: unknown;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`Error: ${err.message}`, {
    name: err.name,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  const response: ErrorResponse = {
    error: true,
    message: "An internal server error occurred.",
  };

  // Add stack trace in development environment
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  // Handle known errors
  if (err instanceof HttpError) {
    response.message = err.message;

    // Add additional error details if available
    if ("details" in err) {
      response.details = (err as any).details;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    response.message = "Database operation failed";
    res.status(400).json(response);
    return;
  }

  // Handle validation errors (e.g., from express-validator)
  if (err.name === "ValidationError") {
    response.message = err.message;
    res.status(422).json(response);
    return;
  }

  // Handle all other errors
  res.status(500).json(response);
};

// Async error wrapper to avoid try-catch blocks in controllers
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export function catchError(error: unknown, context: string): never {
  console.error(`${context} error:`, error);

  if (error instanceof ValidationError || error instanceof NotFoundError) {
    throw error;
  }

  throw error instanceof Error
    ? new Error(
        `An error occurred while trying to ${context}: ${error.message}`
      )
    : new Error(`An unexpected error occurred while trying to ${context}`);
}
