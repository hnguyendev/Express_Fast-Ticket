import { CatchAsyncError } from "../middleware/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import User from "../database/models/user";
import { createActivationToken } from "../utils/token";
import ejs from "ejs";
import path from "path";
import { sendMail } from "../utils/sendMail";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";

interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, phoneNumber } = req.body as IRegisterRequest;
    try {
      const existingEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (existingEmail) {
        return next(new ErrorHandler("User already exist!", 400));
      }

      const user = {
        name,
        email,
        password,
        phoneNumber,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;

      const data = {
        user: { name: user.name },
        activationCode,
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });

        return res.status(201).json({
          success: true,
          message: `Please check your ${user.email} to activate account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(
          new ErrorHandler("Cannot send email. Please try again!", 500)
        );
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token, activation_code } =
      req.body as IActivationRequest;
    try {
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: User; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code!", 400));
      }

      const { name, email, password, phoneNumber } = newUser.user;

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return next(new ErrorHandler("Account already activated", 400));
      }

      const user = await User.create({
        name,
        email,
        password,
        phoneNumber,
      });

      res.status(201).json({
        success: true,
        message: "Activate account successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const existingUser = await User.scope("withPassword").findOne({
        where: {
          email,
        },
      });

      if (!existingUser) {
        return next(new ErrorHandler("User not exist!", 404));
      }

      const matchPasswords = await existingUser.validatePassword(password);

      if (!matchPasswords) {
        return next(new ErrorHandler("Invalid credentials!", 400));
      }

      sendToken(existingUser, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

const updateAcessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token;

      if (!refresh_token) {
        return next(new ErrorHandler("Could not refresh token.", 400));
      }

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as Secret
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("Could not refresh token.", 400));
      }

      const session = await redis.get(decoded.id);

      if (!session) {
        return next(new ErrorHandler("User not found.", 404));
      }

      const user = JSON.parse(session);
      const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN as Secret,
        { expiresIn: "5m" }
      );
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN as Secret,
        { expiresIn: "3d" }
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user.id.toString(), JSON.stringify(user));

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export { registerUser, activateUser, loginUser, updateAcessToken };
