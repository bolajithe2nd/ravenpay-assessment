import { Router } from "express";

const userRouter = Router();

// http://localhost:8080/user/:id/update
// The endpoint to update a user's profile
// userRouter.put(
//   "/:id/update",
//   authorizedRoles([Role.ADMIN, Role.STUDENT, Role.STAFF, Role.GUARDIAN]),
//   validateRequest.params(IdSchema),
//   validateRequest.body(PersonalInfoSchema.optional()),
//   UserController.updateProfile
// );

export default userRouter;
