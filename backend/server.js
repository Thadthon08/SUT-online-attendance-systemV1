const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const sequelize = require("./config/db");

const app = express();
app.use(bodyParser.json());

// ใช้งานเส้นทางของ user
app.use("/api", userRoutes);

// เริ่มต้นเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the db:", error);
  }
});
