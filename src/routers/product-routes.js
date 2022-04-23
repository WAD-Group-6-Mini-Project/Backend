const express = require("express");
const router = new express.Router();
const Product = require('../models/product-model');
const formidable = require("formidable");
const fs = require("fs");
const path = require('path');

router.post('/product', async (req, res) => {
    try {
        const form = formidable.IncomingForm();
        const uploadFolder = path.join(__dirname, "..", "media");
        form.uploadDir = uploadFolder;
        form.parse(req, async (err, fields, files) => {
            const file = files.myFile;   // myFile is the "name" attribute of the input field accepting img
            const getImg = fs.readFileSync(path.join(__dirname, "..", "media", file.newFilename));
            const product = new Product({
                name: req.bdoy.name, 
                tag: req.body.tag,
                description: req.body.description,
                price: req.body.price,
                img: getImg,
                artistId: req.body.id
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