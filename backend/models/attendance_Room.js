const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Subject = require("./subject");

const AttendanceRoom = sequelize.define("AttendanceRoom", {
  ATR_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ATR_name: {
    type: DataTypes.STRING,
    unique: true,
  },
  ATR_lat: {
    type: DataTypes.FLOAT,
  },
  ATR_long: {
    type: DataTypes.FLOAT,
  },
  start_time: {
    type: DataTypes.DATE,
  },
  end_time: {
    type: DataTypes.DATE,
  },
  countdown_duration: {
    type: DataTypes.INTEGER,
  },
  qrcode_data: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expired_at: {
    type: DataTypes.DATE,
  },
});

// ตั้งความสัมพันธ์
AttendanceRoom.belongsTo(Subject, { foreignKey: "sub_id" });
Subject.hasMany(AttendanceRoom, { foreignKey: "sub_id" });

module.exports = AttendanceRoom;
