const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/users-model");
const auth = require("../auth/auth");

router.post("/user/signup", async (req, res) => {
  const user = new User(req.body);
  console.log(user);
  try {
    await user.save();
    console.log("World");
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/user/cart", async (req, res) => {
  try {
    const product = {_id: req.body.product_id, name: req.body.name};
    // const user = await User.updateOne({_id: req.body.userId}, {$push: {cart:product}});
    await User.findByIdAndUpdate(req.body.userId, {$push: {cart:product}});
    res.status(200).send("Added to card successfully");
  } catch (error) {
    res.status(404).send("Could not add to card");
    console.log(error);
  }
});

router.delete("/user/cart", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {$pull: {cart: {product_id: req.body.product_id}}}, {safe : true, multi : false});
    res.status(200).send("Deleted from cart successfully");
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not delete from cart");
  }
});

router.post("user/wishlist", async(req, res) => {
  try {
    const product = {_id: req.body.product_id, name: req.body.name};
    await User.findByIdAndUpdate(req.body.userId, {$push: {wishlist : product}});
    res.status(200).send("Added to wishlist successfully");
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not add to wishlist");
  }
});

router.delete("user/wishlist", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {$pull: {wishlist: {product_id: req.body.product_id}}}, {safe : true, multi : false});
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
