import { Sequelize } from "sequelize";
require("dotenv").config();

let sequelizeConnection: Sequelize = new Sequelize(
  process.env.DB_DATABASE || "",
  process.env.DB_USERNAME || "",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "",
    dialect: "mysql",
    port: 3306,
    timezone: "+07:00",
  }
);

export default sequelizeConnection;
