require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const { connectRedis } = require("./src/config/redis");

const PORT = process.env.PORT || 3000;

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB Connection Failed", err);
  });

connectRedis();
