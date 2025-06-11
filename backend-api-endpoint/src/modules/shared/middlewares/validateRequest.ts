import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

interface ValidationErrorResponse {
  status: "error";
  code: string;
  message: string;
  errors: {
    field: string;
    code: string;
    message: string;
    path: string[];
  }[];
}

interface ValidateRequest {
  body: (
    schema: ZodSchema
  ) => (req: Request, res: Response, next: NextFunction) => void;
  params: (
    schema: ZodSchema
  ) => (req: Request, res: Response, next: NextFunction) => void;
  query: (
    schema: ZodSchema
  ) => (req: Request, res: Response, next: NextFunction) => void;
}

const defaultErrorHandler = (
  error: ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const response: ValidationErrorResponse = {
    status: "error",
    code: "VALIDATION_ERROR",
    message: "The request data failed validation",
    errors: error.errors.map((err: any) => ({
      field: err.path.join("."),
      code: err.code,
      message: err.message,
      path: err.path,
    })),
  };

  res.status(400).json(response);
};

const createMiddleware = (
  schema: ZodSchema,
  source: "body" | "params" | "query"
) => {
  return function (req: Request, res: Response, next: NextFunction): void {
    const dataToValidate = req[source];
    const validationResult = schema.safeParse(dataToValidate);

    if (!validationResult.success) {
      defaultErrorHandler(validationResult.error, req, res, next);
      return;
    }

    // Attach validated data to the request object
    req[source] = validationResult.data;
    next();
  };
};

export const validateRequest: ValidateRequest = {
  body: (schema: ZodSchema) => createMiddleware(schema, "body"),
  params: (schema: ZodSchema) => createMiddleware(schema, "params"),
  query: (schema: ZodSchema) => createMiddleware(schema, "query"),
};
