import {
  CreateStringSchema,
  PasswordSchema,
} from "@/modules/shared/schemas/common";
import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: CreateStringSchema("Password"),
  })
  .strict();

export const signUpSchema = z
  .object({
    firstName: CreateStringSchema("First Name"),
    lastName: CreateStringSchema("Last Name"),
    email: z.string().email("Invalid email format"),
    password: PasswordSchema,
  })
  .strict();
