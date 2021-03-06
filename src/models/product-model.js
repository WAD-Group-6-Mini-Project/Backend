const { Decimal128, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Decimal128,
    required: true,
  },
  img: {
    type: Buffer,
    required: true,
  },
  artist: {
    _id: {
      type: ObjectId,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
