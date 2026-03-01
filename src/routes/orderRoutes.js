const express = require("express");
const router = express.Router();
const {
  addUserOrder,
  getOrder,
  markOrderAsComplete,
} = require("../services/orderService");

// POST /api/orders/:uid  — place new order (also resets cart)
router.post("/:uid", async (req, res) => {
  const { order } = req.body;
  if (!order) return res.status(400).json({ error: "order is required" });
  try {
    await addUserOrder(req.params.uid, order);
    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:uid
router.get("/:uid", async (req, res) => {
  try {
    const orders = await getOrder(req.params.uid);
    if (!orders) return res.status(404).json({ error: "No orders found" });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:uid/complete  — move order from onorder → completed
router.put("/:uid/complete", async (req, res) => {
  const { order } = req.body;
  if (!order) return res.status(400).json({ error: "order is required" });
  try {
    await markOrderAsComplete(req.params.uid, order);
    res.json({ message: "Order marked as complete" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
