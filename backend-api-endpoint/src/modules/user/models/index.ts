import db from "@/lib/db";
import { CreateUserDTO, UserWithoutPassword } from "@/types/user";
import { generateAccountNumber } from "@/utils/generate-account-number";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bankAccountNumber: string;
  bankName: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  static async create(userData: CreateUserDTO): Promise<UserWithoutPassword> {
    try {
      console.log("Got to the user model");
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const bankAccountNumber = await generateAccountNumber();

      const [user] = await db("users")
        .insert({
          ...userData,
          password: hashedPassword,
          bankAccountNumber,
          bankName: "Raven Bank",
        })
        .returning([
          "id",
          "email",
          "firstName",
          "lastName",
          "bankAccountNumber",
          "bankName",
          "balance",
          "created_at",
          "updated_at",
        ]);

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  static async findById(id: string): Promise<UserWithoutPassword | null> {
    try {
      const user = await db("users")
        .select([
          "id",
          "email",
          "firstName",
          "lastName",
          "bankAccountNumber",
          "bankName",
          "balance",
          "created_at",
          "updated_at",
        ])
        .where({ id })
        .first();

      return user || null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw new Error("Failed to get user by ID");
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await db("users").where({ email }).first();
      return user || null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw new Error("Failed to get user by email");
    }
  }

  static async findByAccountNumber(
    accountNumber: string
  ): Promise<User | null> {
    try {
      const user = db("users")
        .where({ bankAccountNumber: accountNumber })
        .first();
      return user || null;
    } catch (error) {
      console.error("Error getting user through their account number", error);
      throw new Error("Error getting user through their account number");
    }
  }

  static async updateBalance(id: string, amount: number): Promise<void> {
    await db("users").where({ id }).increment("balance", amount);
  }
}
