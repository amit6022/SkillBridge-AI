const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to Database");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // fail fast — running with no DB is worse than crashing clearly
  }
}

module.exports = connectToDB;
