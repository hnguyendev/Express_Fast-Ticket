"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "./connection";
export interface StationAttributes {
  id?: number;
  name: string;
  address: string;
  province: string;
}
class Station extends Model<StationAttributes> implements StationAttributes {
  id!: number;
  name!: string;
  address!: string;
  province!: string;
}
Station.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [3, 30],
          msg: "Name must be 3-30 characters",
        },
      },
    },
    address: { type: DataTypes.STRING, allowNull: false },
    province: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "Station",
  }
);
// Associations
// Station.belongsTo(TargetModel, {
//   as: 'custom_name',
//   foreignKey: {
//     name: 'foreign_key_column_name',
//     allowNull: false,
//   },
//   onDelete: "RESTRICT",
//   foreignKeyConstraint: true,
// });
export default Station;
