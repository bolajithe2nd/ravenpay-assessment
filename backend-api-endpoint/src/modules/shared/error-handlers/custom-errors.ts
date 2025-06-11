export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized access") {
    super(403, message);
  }
}

export class UnauthenticatedError extends HttpError {
  constructor(message = "Authentication required") {
    super(401, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Invalid request") {
    super(400, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

export class ValidationError extends HttpError {
  constructor(message: string, details?: unknown) {
    super(400, message, details);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal server error", error?: unknown) {
    super(500, message, error);
  }
}
