import z from "zod";

export const IdSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

export const IdsSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "At least one id is required"),
});

export const UserNameSchema = z.object({
  userName: z
    .string()
    .min(1, "Username is required")
    .max(255, "Username must be 255 characters or less"),
});

export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password cannot exceed 64 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must include: uppercase, lowercase, number, and special character"
  );

export const CreateStringSchema = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .max(255, `${fieldName} must be 255 characters or less`);

export const phoneNumberSchema = z
  .string()
  .regex(/^(\+?[1-9]\d{1,14}|0\d{10})$/, "Invalid phone number format");

export const DateSchema = z
  .string()
  .nullable()
  .transform((str) => (!str || str.trim() === "" ? undefined : str))
  .pipe(
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .optional()
  );
export const TagSchema = z
  .object({
    id: CreateStringSchema("ID"),
    text: CreateStringSchema("Text"),
  })
  .strict();
