import { Response } from "express";
import User from "../database/models/user";
import { redis } from "./redis";
import { RedisKey } from "ioredis";

require("dotenv").config();

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: true;
}

const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "", 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "", 10);

export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 1000 * 60),
  maxAge: accessTokenExpire * 1000 * 60,
  httpOnly: true,
  sameSite: "lax",
};
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 3600 * 1000),
  maxAge: refreshTokenExpire * 24 * 3600 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: User, statusCode: number, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  redis.set(user.id.toString() as RedisKey, JSON.stringify(user));

  if ((process.env.NODE_ENV = "production")) {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
  });
};
