require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const authentication = require("./routes/authentication");
const cookieParser = require("cookie-parser");

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authentication);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
