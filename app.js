const express = require("express");
const cors = require("cors");
const userRouter = require("./src/routers/user-routes");
require("./src/db/mongoose");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(userRouter);

module.exports = app;
