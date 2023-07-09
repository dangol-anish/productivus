const router = require("express").Router();
const authorization = require("../middlwares/authorization");
const pool = require("../models/database");

router.get("/", authorization, (req, res) => {
  try {
    res.send(true);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
