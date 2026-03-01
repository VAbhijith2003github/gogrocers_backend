const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cartRoutes = require("./routes/cartRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ service: "cart-service", status: "ok", port: process.env.PORT || 3002 });
});

app.use("/api/cart", cartRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
