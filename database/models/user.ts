"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "./connection";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatar?: string;
  role?: string;
}
class User extends Model<UserAttributes> implements UserAttributes {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  phoneNumber!: string;
  avatar!: string;
  role!: string;
  validatePassword!: (password: string) => Promise<boolean>;
  signAccessToken!: () => string;
  signRefreshToken!: () => string;
}
User.init(
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
        notEmpty: { msg: "The username can't be an empty." },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "Please provide a valid email." },
        notEmpty: { msg: "The email can't be an empty." },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The password can't be an empty." },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The phone number can't be an empty." },
      },
    },
    avatar: {
      type: DataTypes.STRING,
    },
    role: { type: DataTypes.STRING, defaultValue: "user" },
  },
  {
    sequelize,
    modelName: "User",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
  }
);

User.beforeCreate(async (user) => {
  const existingUser = await User.findOne({
    where: {
      email: user.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exist");
  }
});

User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.signAccessToken = function () {
  return jwt.sign({ id: this.id }, process.env.ACCESS_TOKEN as Secret, {
    expiresIn: "5m",
  });
};
User.prototype.signRefreshToken = function () {
  return jwt.sign({ id: this.id }, process.env.REFRESH_TOKEN as Secret, {
    expiresIn: "3d",
  });
};

// Associations
// User.belongsTo(TargetModel, {
//   as: 'custom_name',
//   foreignKey: {
//     name: 'foreign_key_column_name',
//     allowNull: false,
//   },
//   onDelete: "RESTRICT",
//   foreignKeyConstraint: true,
// });
export default User;
