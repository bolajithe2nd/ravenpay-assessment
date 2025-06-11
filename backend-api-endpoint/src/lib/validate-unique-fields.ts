import { ConflictError } from "@/modules/shared/error-handlers/custom-errors";
import { findUser } from "@/modules/user/services/read";

export async function validateUniqueFields(
  email?: string,
  phoneNumber?: string
): Promise<void> {
  const [existingByEmail, existingByPhone] = await Promise.all([
    email ? findUser.byEmail(email) : null,
    phoneNumber ? findUser.byPhoneNumber(phoneNumber) : null,
  ]);

  if (existingByEmail) {
    throw new ConflictError("A user with this email already exists");
  }
  if (existingByPhone) {
    throw new ConflictError("A user with this phone number already exists");
  }
}
