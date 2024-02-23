const express = require("express");
const mainRouter = require("./ROUTES/index");
const app = express();
const dotenv = require("dotenv");
const { mongoConnection } = require("./DATABASE/db");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT;
mongoConnection();
app.use(cors());
app.use(express.json());
app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
  console.log("Server is running at", PORT);
});
