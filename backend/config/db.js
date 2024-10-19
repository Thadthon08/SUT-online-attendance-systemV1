const { Sequelize } = require("sequelize");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false, // เปิด SSL สำหรับ production
        },
      }
    : {}, // ปิด SSL สำหรับ local
  logging: false, // ปิดการแสดง log
});

module.exports = sequelize;
