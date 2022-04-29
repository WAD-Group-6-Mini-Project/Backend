const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/users-model");
const Product = require("../models/product-model");
const auth = require("../auth/auth");
const mongoose = require("mongoose");

router.post("/user/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/user/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    throw e;
    res.status(400).send(e);
  }
});

router.post("/user/cart", async (req, res) => {
  try {
    const product = await Product.findById(req.body.product_id, {
      _id: 1,
      name: 1,
      img: 1,
      price: 1,
    });
    // const user = await User.updateOne({_id: req.body.userId}, {$push: {cart:product}});
    await User.findByIdAndUpdate(req.body.userId, { $push: { cart: product } });
    res.status(200).send("Added to card successfully");
  } catch (error) {
    res.status(404).send("Could not add to card");
    console.log(error);
  }
});

router.post("/user/confirm/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    user.cart = [];
    await user.save();
    res.send(200);
  } catch (e) {
    res.status(404).send("Purchase could not be completed!");
  }
});

router.post("/user/checkout/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { cart: req.body.cart });
    res.send(200);
  } catch (error) {
    res.status(404).send("Could not checkout!");
    console.log(error);
  }
});

router.get("/user/cart/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user.cart);
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not return cart");
  }
});

router.get("/user/wishlist/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user.wishlist);
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not return cart");
  }
});

router.delete("/user/cart", async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      mongoose.Types.ObjectId(req.body.userId),
      {
        $pull: {
          cart: { _id: mongoose.Types.ObjectId(req.body.product_id) },
        },
      },
      { safe: true, multi: false }
    );
    res.status(200).send("Deleted from cart successfully");
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not delete from cart");
  }
});

router.post("/user/wishlist", async (req, res) => {
  try {
    const product = await Product.findById(req.body.product_id, {
      _id: 1,
      name: 1,
      img: 1,
    });
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { wishlist: product },
    });
    res.status(200).send("Added to wishlist successfully");
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not add to wishlist");
  }
});

router.delete("user/wishlist", async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.userId,
      { $pull: { wishlist: { product_id: req.body.product_id } } },
      { safe: true, multi: false }
    );
    res.status(200).send("Deleted from wishlist successfully");
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not delete from wishlist");
  }
});

module.exports = router;

/*
1. Add to Cart
2. Remove from Cart (id and Name)
3. WishList



*/
