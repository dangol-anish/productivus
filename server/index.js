require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// file routes
const authentication = require("./routes/authentication");
const dashboard = require("./routes/dashboard");

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/auth", authentication);
app.use("/dashboard", dashboard);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
