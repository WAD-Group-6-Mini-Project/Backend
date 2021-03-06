const mongoose = require("mongoose");
const validator = require("validator");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const userSchema = new schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Invalid Password");
      }
    },
  },
  mobile: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
  cart: [
    {
      _id: {
        type: ObjectId,
      },
      name: {
        type: String,
      },
      img: {
        type: Buffer,
      },
      quantity: {
        type: Number,
      },
      price: {
        type: Number,
      },
    },
  ],
  wishlist: [
    {
      product_id: {
        type: ObjectId,
      },
      name: {
        type: String,
      },
      img: {
        type: Buffer,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to Login");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to Login");
  }
  return user;
};

//Hash plain text before passing
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
