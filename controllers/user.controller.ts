import User from "../database/models/user";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { getSingleHandler } from "./handlerFactory";

const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.findAll();

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

const getSingleUser = getSingleHandler(User);

const updateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, role } = req.body;
    try {
      const existingUser = await User.findOne({
        where: { email },
      });

      if (!existingUser) {
        return next(new ErrorHandler("User not found.", 404));
      }

      existingUser.role = role;
      await existingUser.save();

      res.status(200).json({
        success: true,
        existingUser,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

const updload = multer({ dest: "./uploads/avatars" });

const uploadUserAvatar = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export { getAllUsers, getSingleUser, updateUser, uploadUserAvatar };
