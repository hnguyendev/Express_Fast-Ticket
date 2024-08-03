import express from "express";
import { getAllUsers, getSingleUser } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getSingleUser);

export default userRouter;
