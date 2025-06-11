import { validateRequest } from "@/modules/shared/middlewares/validateRequest";
import { Router } from "express";
import AuthController from "../controllers";
import { loginSchema, signUpSchema } from "../schemas";

const authRouter = Router();

// http://localhost:8080/auth/login
// The general login endpoint for all users
authRouter.post(
  "/login",
  validateRequest.body(loginSchema),
  AuthController.logIn
);

// http://localhost:8080/auth/signup
// The general signup endpoint for all users
authRouter.post(
  "/signup",
  validateRequest.body(signUpSchema),
  AuthController.signUp
);

// http://localhost:8080/auth/logout
// The general logout endpoint for all users
authRouter.post("/logout", AuthController.logOut);

export default authRouter;
