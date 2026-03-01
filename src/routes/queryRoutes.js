const express = require("express");
const router = express.Router();
const { createQuery } = require("../services/queryService");

// POST /api/queries  — log a support/search query
router.post("/", async (req, res) => {
  const { uid, email, query } = req.body;
  if (!uid || !email || !query)
    return res.status(400).json({ error: "uid, email, and query are required" });
  try {
    await createQuery(uid, email, query);
    res.status(201).json({ message: "Query submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
