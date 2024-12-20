const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const AttendanceRoom = require("./attendance_Room");
const Student = require("./student");

const Attendance = sequelize.define("Attendance", {
  att_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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

Attendance.belongsTo(AttendanceRoom, {
  foreignKey: "ATR_id",
  allowNull: false,
  onDelete: "CASCADE",
});
Attendance.belongsTo(Student, {
  foreignKey: "sid",
  allowNull: false,
  onDelete: "CASCADE",
});
AttendanceRoom.hasMany(Attendance, { foreignKey: "ATR_id" });
Student.hasMany(Attendance, { foreignKey: "sid" });

module.exports = Attendance;
