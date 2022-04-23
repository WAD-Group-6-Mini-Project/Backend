const express = require("express");
const userRouter = require("./src/routers/user-routes");
require("./src/db/mongoose");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(userRouter);

module.exports = app;
