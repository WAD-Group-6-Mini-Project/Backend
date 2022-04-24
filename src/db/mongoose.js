/*   File contains mongodb connection */

//import mongoose package
const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to db");
  } catch (err) {
    console.log(err);
  }
})();
