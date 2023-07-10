// Load environment variables from .env file
require("dotenv").config();

// Import required packages
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import file routes
const authentication = require("./routes/authentication");
const dashboard = require("./routes/dashboard");

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Set up routes
app.use("/auth", authentication);
app.use("/dashboard", dashboard);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
