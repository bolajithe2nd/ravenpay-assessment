export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bankAccountNumber: string | null;
  bankName: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export type UserWithoutPassword = Omit<User, "password">;
export type CreateUserDTO = Pick<
  User,
  "email" | "password" | "firstName" | "lastName"
>;
