const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = new express.Router();
const Product = require("../models/product-model");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(404).send("Cannot find products");
  }
});

router.get("/user/products/:id", async (req, res) => {
  try {
    const products = await Product.find({ "artist._id": req.body.artist });
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not return cart");
  }
});

router.get("/product/tags", async (req, res) => {
  try {
    const result = await Product.find().distinct("tag");
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.post("/product/category", async (req, res) => {
  try {
    if (req.body.tag) {
      const products = await Product.find({ tag: req.body.tag });
      res.send(products);
    } else if (req.body.artist) {
      const products = await Product.find({ "artist._id": req.body.artist });
      res.send(products);
    } else if (req.body.city) {
      const products = await Product.find({ city: req.body.city });
      res.send(products);
    } else {
      res.redirect("/product");
    }
  } catch (error) {
    res.status(404).send("Could not find products category wise");
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.send(product);
  } catch (error) {
    console.log(error);
    res.status(404).send("Cannot find product");
  }
});

router.post("/product", upload.single("productImg"), async (req, res) => {
  const productData = JSON.parse(JSON.stringify(req.body));
  productData.artist = JSON.parse(productData.artist);
  const file = req.file;
  try {
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      throw error;
    }
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    productData.img = buffer;
    const product = new Product(productData);
    product.save();

    res.status(200).send("Product Uploaded Successfully");
  } catch (error) {
    console.log(error);
    res.status(404);
  }
});

module.exports = router;

/*
1. Get all Products
2. Get Product by Id (parameter)
3. Product (tags, Artists)

*/
