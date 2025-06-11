import { Role } from "@prisma/client";

declare module "express" {
  export interface Request {
    session?: {
      id: string;
      role: Role;
    };
  }
}
