require("dotenv").config();
import express from "express";
import { ErrorMiddleWare } from "./middleware/error";
import cookieParser from "cookie-parser";
import cors from "cors";
import stationRouter from "./routers/station.router";
import userRouter from "./routers/user.router";
import authRouter from "./routers/auth.router";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use("/api/v1/stations", stationRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "XDD",
  });
});

app.all("*", (req, res, next) => {
  const err = new Error(`route ${req.originalUrl} not found`);
  res.status(404);
  next(err);
});

app.use(ErrorMiddleWare);
