const express = require("express");
const mainRouter = require("./ROUTES/index");
const app = express();
const dotenv = require("dotenv");
const { mongoConnection } = require("./DATABASE/db");
const { User, Account } = require("./DATABASE/db");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT;

// Establish MongoDB connection
mongoConnection();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", mainRouter);

// Start the server
app.listen(PORT, () => {
  console.log("Server is running at", PORT);
});
