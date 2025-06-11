import { asyncHandler } from "@/modules/shared/error-handlers";
import { UnauthenticatedError } from "@/modules/shared/error-handlers/custom-errors";
import { UserModel } from "@/modules/user/models";
import { CreateUserDTO } from "@/types/user";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

class AuthController {
  // Log in for all users
  public static logIn = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthenticatedError("Invalid username or password");
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        domain:
          process.env.NODE_ENV === "production"
            ? process.env.PRODUCTION_DOMAIN
            : "localhost",
      });

      // Create a new user object without the password
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        message: "Login successful.",
        data: userWithoutPassword,
      });
    }
  );

  public static signUp = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { firstName, lastName, email, password } = req.body;
      console.log("Got to the controller");

      const userData: CreateUserDTO = {
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, 10),
      };

      const newUser = await UserModel.create(userData);

      res.status(201).json({
        message: "Signup successful.",
        data: newUser,
      });
    }
  );

  // Log out for all users
  public static logOut = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
        path: "/",
      });

      res.status(200).json({ message: "Logout successful." });
    }
  );
}

export default AuthController;
