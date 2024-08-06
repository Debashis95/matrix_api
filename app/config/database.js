const mongoose = require("mongoose");

const URI = `mongodb+srv://${process.env.DB_HOST}/${process.env.DB_DATABASE}`;

let options = {
  auth: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};

module.exports = async () => {
  try {
    await mongoose.connect(URI, options);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
};
