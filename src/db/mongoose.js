/*   File contains mongodb connection */

//import mongoose package
const mongoose = require("mongoose");

(async () => {
  console.log("Hello");
  try {
    console.log("World");
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to db");
  } catch (err) {
    console.log(err);
  }
})();
