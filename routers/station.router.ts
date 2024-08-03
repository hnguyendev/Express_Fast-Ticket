import express from "express";
import {
  createStation,
  deleteStation,
  getAllStations,
  getSingleStation,
  updateStation,
} from "../controllers/station.controller";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";

const stationRouter = express.Router();

stationRouter.get(
  "/",
  isAuthenticated,
  authorizedRoles("admin"),
  getAllStations
);
stationRouter.get("/:id", getSingleStation);
stationRouter.put(
  "/:id",
  isAuthenticated,
  authorizedRoles("admin"),
  updateStation
);
stationRouter.post(
  "/",
  isAuthenticated,
  authorizedRoles("admin"),
  createStation
);
stationRouter.delete(
  "/:id",
  isAuthenticated,
  authorizedRoles("admin"),
  deleteStation
);

export default stationRouter;
