const express = require("express");
const router = new express.Router();
const Product = require("../models/product-model");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

router.get("/product", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(404).send("Cannot find products");
  }
});

router.get("/product/category", async (req, res) => {
  try {
    if(req.body.tag){
      const products = await Product.find({tag : req.body.tag});
      res.send(products);
    }
    else if(req.body.artist){
      const products = await Product.find({artistId : req.body.artist});
      res.send(products);
    }
    else if(req.body.city){
      const products = await Product.find({city : req.body.city});
      res.send(products);
    }
    else{
      res.redirect("/product");
    }
  } catch (error) {
    res.status(404).send("Could not find products category wise");
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const id = req.params.id
    const product = await Product.findById(id);
    res.send(product);
  } catch (error) {
    console.log(error);
    res.status(404).send("Cannot find product");
  }
});

router.post("/product", async (req, res) => {
  try {
    const form = formidable.IncomingForm();
    const uploadFolder = path.join(__dirname, "..", "media");
    form.uploadDir = uploadFolder;
    form.parse(req, async (err, fields, files) => {
      const file = files.myFile; // myFile is the "name" attribute of the input field accepting img
      const getImg = fs.readFileSync(
        path.join(__dirname, "..", "media", file.newFilename)
      );
      const product = new Product({
        name: req.bdoy.name,
        tag: req.body.tag,
        description: req.body.description,
        price: req.body.price,
        img: getImg,
        artistId: req.body.id,
      });
      await product.save();
      res.send("Product Saved");
    });
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
