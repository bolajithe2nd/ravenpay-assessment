import { Application } from "express";
import authRoutes from "./modules/auth/routes";
import { errorHandler } from "./modules/shared/error-handlers";

export function setupApp(app: Application) {
  // Auth routes
  app.use("/auth", authRoutes);

  // User routes
  // app.use("/user", userRoutes);

  // Transfer routes
  // app.use("/transfer", transferRoutes);

  // Webhooks routes
  // app.use("/webhooks", webHoo);

  // Error handling middleware
  app.use(errorHandler);
}
