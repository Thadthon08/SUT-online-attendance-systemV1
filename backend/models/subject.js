const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Teacher = require("./teacher");

const Subject = sequelize.define("Subject", {
  sub_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sub_name: {
    type: DataTypes.STRING,
  },
  sub_pic: {
    type: DataTypes.TEXT,
  },
});

// ตั้งความสัมพันธ์
Subject.belongsTo(Teacher, { foreignKey: "tid" });
Teacher.hasMany(Subject, { foreignKey: "tid" });

module.exports = Subject;
