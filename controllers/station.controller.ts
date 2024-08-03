import { CatchAsyncError } from "../middleware/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import Station from "../database/models/station";
import { Op } from "sequelize";
import { deleteHandler, getSingleHandler } from "./handlerFactory";

interface IStationBody {
  name: string;
  address: string;
  province: string;
}

const createStation = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, address, province } = req.body as IStationBody;

      if (!name || !address || !province) {
        return next(new ErrorHandler("Unable to create station!", 400));
      }

      const station = await Station.create({ name, address, province });

      return res.status(201).json({
        success: true,
        station,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IStationQuery {
  name?: string;
}

const getAllStations = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name }: IStationQuery = req.query;
    try {
      let stations;
      if (name) {
        stations = await Station.findAll({
          where: {
            name: { [Op.like]: `%${name}%` },
          },
        });
      } else {
        stations = await Station.findAll({
          order: [["createdAt", "DESC"]],
        });
      }

      res.status(200).json({
        success: true,
        stations,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

const updateStation = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, address, province } = req.body as IStationBody;
    try {
      const station = await Station.findOne({
        where: {
          id,
        },
      });

      if (!station) {
        return next(new ErrorHandler("Station does not exist!", 400));
      }

      if (!name && !address && !province) {
        return next(new ErrorHandler("Please provide station info!", 400));
      }

      if (name) station.name = name;

      if (address) station.address = address;

      if (province) station.province = province;

      await station.save();

      res.status(200).json({
        success: true,
        station,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

const getSingleStation = getSingleHandler(Station);
const deleteStation = deleteHandler(Station);

export {
  getAllStations,
  createStation,
  getSingleStation,
  updateStation,
  deleteStation,
};
