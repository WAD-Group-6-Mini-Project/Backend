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

module.exports = router;
