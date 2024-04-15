const mongoose_user = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  console.log(`${process.env.MONGO_API_KEY_USERS}`);
  return mongoose_user
    .connect(`${process.env.MONGO_API_KEY_USERS}`)
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log("Could not connect to database.");
      console.log(err);
    });
};
module.exports = { connectDB };
