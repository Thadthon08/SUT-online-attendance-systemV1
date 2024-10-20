const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TeacherSubject = sequelize.define(
  "TeacherSubject",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_id: {
      type: DataTypes.UUID,
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
