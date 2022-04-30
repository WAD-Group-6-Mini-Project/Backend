const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

const userRouter = require("./src/routers/user-routes");
const productRouter = require("./src/routers/product-routes");
require("./src/db/mongoose");

const app = express();
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(express.json());

app.use(cors());
app.use(userRouter);
app.use(productRouter);

module.exports = app;
