const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
var cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(cors());

// ใช้งานเส้นทางของ user
app.use("/api/auth", require("./routes/auth"));
app.use("/line", require("./routes/line"));

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
