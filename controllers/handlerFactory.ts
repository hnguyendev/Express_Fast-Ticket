import { CatchAsyncError } from "../middleware/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { Op } from "sequelize";

// export const createHandler = (Model: any) =>
//   CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { name, address, province } = req.body;

//       if (!name || !address || !province) {
//         return next(new ErrorHandler("Unable to create!", 400));
//       }

//       const data = await Model.create({ name, address, province });

//       return res.status(201).json({
//         success: true,
//         data,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   });

const getAllHandler = (Model: any) =>
  CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.query;
    try {
      let data;
      if (name) {
        data = await Model.findAll({
          where: {
            name: { [Op.like]: `%${name}%` },
          },
        });
      } else {
        data = await Model.findAll({
          order: [["createdAt", "DESC"]],
        });
      }

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

const getSingleHandler = (Model: any) =>
  CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await Model.findOne({
        where: {
          id,
        },
      });

      if (!data) {
        return next(new ErrorHandler(`Data does not exist!`, 404));
      }

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

//  const updateHandler = (Model: any) =>
//   CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const { name, address, province } = req.body;
//     try {
//       const data = await Model.findOne({
//         where: {
//           id,
//         },
//       });

//       if (!data) {
//         return next(new ErrorHandler("Data does not exist!", 404));
//       }

//       if (!name && !address && !province) {
//         return next(new ErrorHandler("Please provide data info!", 400));
//       }

//       if (name) data.name = name;
//       if (address) data.address = address;
//       if (province) data.province = province;

//       await data.save();

//       res.status(200).json({
//         success: true,
//         data,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   });

const deleteHandler = (Model: any) =>
  CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await Model.destroy({
        where: {
          id,
        },
      });

      res.status(204).json({
        success: true,
        message: "Data deleted successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

export { getAllHandler, getSingleHandler, deleteHandler };
