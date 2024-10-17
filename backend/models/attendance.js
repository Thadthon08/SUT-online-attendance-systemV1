const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const AttendanceRoom = require("./attendance_Room");
const Student = require("./student");

const Attendance = sequelize.define("Attendance", {
  att_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  att_lat: {
    type: DataTypes.FLOAT,
  },
  att_long: {
    type: DataTypes.FLOAT,
  },
  att_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// ตั้งความสัมพันธ์
Attendance.belongsTo(AttendanceRoom, { foreignKey: "ATR_id" });
Attendance.belongsTo(Student, { foreignKey: "sid" });
AttendanceRoom.hasMany(Attendance, { foreignKey: "ATR_id" });
Student.hasMany(Attendance, { foreignKey: "sid", unique: true });

module.exports = Attendance;
