"use strict";
import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Stations",
      [
        {
          name: "BX HCM",
          address: "123 Q1, TpHCM",
          province: "HCM",
          createdAt: "2024-07-28 16:13:07",
          updatedAt: "2024-07-28 16:13:07",
        },
        {
          name: "BX DN",
          address: "456 NLB, DN",
          province: "DN",
          createdAt: "2024-07-28 16:13:07",
          updatedAt: "2024-07-28 16:13:07",
        },
        {
          name: "BX HN",
          address: "789 HK, HN",
          province: "HN",
          createdAt: "2024-07-28 16:13:07",
          updatedAt: "2024-07-28 16:13:07",
        },
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Stations", {});
  },
};
