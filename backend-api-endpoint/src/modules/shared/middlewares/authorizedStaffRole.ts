import { Request, Response, NextFunction } from "express";
import { StaffRole, Role } from "@prisma/client";
import { findUser } from "@/modules/user/services/read";
import { UnauthorizedError } from "../error-handlers/custom-errors";

export function authorizedStaffRoles(allowedRoles: StaffRole[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const sessionId = req.session?.id;

      if (!sessionId) {
        throw new UnauthorizedError("No session found");
      }

      const user = await findUser.byId(sessionId);

      // Allow admin to bypass
      if (user?.role === Role.ADMIN) {
        return next();
      }

      // Check staff role for non-admin users
      if (
        !user?.staff?.staffRole ||
        !allowedRoles.includes(user.staff.staffRole)
      ) {
        throw new UnauthorizedError("Staff member does not have required role");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
