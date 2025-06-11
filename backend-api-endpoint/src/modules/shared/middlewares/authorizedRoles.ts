/// <reference path="../../../../@types/express/index.d.ts" />

import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { findUser } from "@/modules/user/services/read";
import { RoleSchema } from "@/modules/user/schemas";
import {
  UnauthenticatedError,
  UnauthorizedError,
  ValidationError,
} from "../error-handlers/custom-errors";

const TokenPayloadSchema = z.object({
  id: z.string().uuid(),
  role: RoleSchema,
  exp: z.number(),
  iat: z.number(),
});

type TokenPayload = z.infer<typeof TokenPayloadSchema>;

// Helper functions
const extractToken = (req: Request): string => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new UnauthenticatedError("Access denied: No token provided");
  }
  return token;
};

const verifyAndDecodeToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const validationResult = TokenPayloadSchema.safeParse(decoded);

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid token structure",
        validationResult.error.errors
      );
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthenticatedError("Access denied: Token expired");
    }
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new UnauthenticatedError("Access denied: Invalid token");
  }
};

const validateUser = async (decoded: TokenPayload, allowedRoles: Role[]) => {
  const user = await findUser.byId(decoded.id);

  if (!user || user.id !== decoded.id) {
    throw new UnauthenticatedError("User not found or invalid");
  }

  if (!user.role || !allowedRoles.includes(user.role)) {
    throw new UnauthorizedError("User does not have required role");
  }

  return user;
};

// Main middleware
export function authorizedRoles(
  allowedRoles: Role[]
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = extractToken(req);
      const decoded = verifyAndDecodeToken(token);
      const user = await validateUser(decoded, allowedRoles);

      // Set session data
      req.session = {
        id: user.id,
        role: user.role,
      };

      next();
    } catch (error) {
      if (error instanceof UnauthenticatedError) {
        res.status(401).json({
          error: true,
          message: error.message,
        });
      } else if (error instanceof UnauthorizedError) {
        res.status(403).json({
          error: true,
          message: error.message,
        });
      } else if (error instanceof ValidationError) {
        res.status(401).json({
          error: true,
          message: "Invalid token: Validation failed",
          details: error.details,
        });
      } else {
        console.error("Unexpected authorization error:", error);
        res.status(500).json({
          error: true,
          message: "Internal server error during authorization",
        });
      }
    }
  };
}
