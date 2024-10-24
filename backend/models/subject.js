const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Subject = sequelize.define("Subject", {
  sub_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sub_code: {
    type: DataTypes.STRING,
    unique: true,
  },
  sub_name: {
    type: DataTypes.STRING,
  },
  sub_pic: {
    type: DataTypes.TEXT,
  },
});

module.exports = Subject;
