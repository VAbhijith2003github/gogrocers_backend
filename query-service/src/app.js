const express = require("express");
const cors = require("cors");
require("dotenv").config();

const queryRoutes = require("./routes/queryRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ service: "query-service", status: "ok", port: process.env.PORT || 3004 });
});

app.use("/api/queries", queryRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
