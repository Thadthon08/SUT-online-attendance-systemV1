const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TeacherSubject = sequelize.define(
  "TeacherSubject",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["tid", "sub_id"],
      },
    ],
  }
);

module.exports = TeacherSubject;
