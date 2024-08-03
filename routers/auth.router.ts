import express from "express";
import {
  activateUser,
  loginUser,
  registerUser,
  updateAcessToken,
} from "../controllers/auth.controller";
import { updateUser } from "../controllers/user.controller";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/activate", activateUser);
authRouter.post("/login", loginUser);
authRouter.get("/refresh", updateAcessToken);
authRouter.put("/", updateUser);

export default authRouter;
