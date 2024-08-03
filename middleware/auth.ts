import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "./catchAsyncError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { redis } from "../utils/redis";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.cookies.access_token;
      if (!access_token) {
        return next(
          new ErrorHandler("Please login to access this resource", 400)
        );
      }

      const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN as Secret
      ) as CustomJwtPayload;

      if (!decoded) {
        return next(
          new ErrorHandler("Please login to access this resource", 400)
        );
      }

      const user = await redis.get(decoded.id);

      console.log(user);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      req.user = JSON.parse(user);

      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const authorizedRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role ${req.user?.role} is not allowed to access this resource.`,
          403
        )
      );
    }

    next();
  };
};
