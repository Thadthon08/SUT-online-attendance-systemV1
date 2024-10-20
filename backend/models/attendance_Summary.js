const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./student");
const Subject = require("./subject");

const AttendanceSummary = sequelize.define("AttendanceSummary", {
  summary_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  total_sessions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  attended_sessions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  attendance_rate: {
    type: DataTypes.FLOAT,
  },
});

// ตั้งความสัมพันธ์
AttendanceSummary.belongsTo(Student, {
  foreignKey: "sid",
  allowNull: false,
  onDelete: "SET NULL",
});
AttendanceSummary.belongsTo(Subject, {
  foreignKey: "sub_id",
  allowNull: false,
  onDelete: "CASCADE",
});

module.exports = AttendanceSummary;
