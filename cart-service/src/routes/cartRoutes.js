const express = require("express");
const router = express.Router();
const { getCart, updateCart, resetCart } = require("../services/cartService");
const verifyToken = require("../middleware/authMiddleware");

// Protect all cart routes
router.use(verifyToken);

router.get("/:uid", async (req, res) => {
  try {
    const cart = await getCart(req.params.uid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:uid", async (req, res) => {
  const { cart } = req.body;
  if (!Array.isArray(cart))
    return res.status(400).json({ error: "cart must be an array" });
  try {
    await updateCart(req.params.uid, cart);
    res.json({ message: "Cart updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:uid", async (req, res) => {
  try {
    await resetCart(req.params.uid);
    res.json({ message: "Cart reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
