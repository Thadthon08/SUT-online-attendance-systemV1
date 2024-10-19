const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define("Student", {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  LineID: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  St_fname: {
    type: DataTypes.STRING,
  },
  St_lname: {
    type: DataTypes.STRING,
  },
});

module.exports = Student;
