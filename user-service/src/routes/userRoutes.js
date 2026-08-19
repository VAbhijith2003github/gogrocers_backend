const express = require("express");
const router = express.Router();
const { createUser, getUser, updateUser, setAddress, addAddress } = require("../services/userService");
const verifyToken = require("../middleware/authMiddleware");

// Protect all user routes
router.use(verifyToken);

// Middleware to authorize user actions
const authorizeUser = (req, res, next) => {
  const targetUid = req.params.uid || req.body.uid;
  if (!targetUid) {
    return res.status(400).json({ error: "User ID is required" });
  }
  if (targetUid !== req.user.uid) {
    return res.status(403).json({ error: "Forbidden: Access denied" });
  }
  next();
};

router.post("/create", authorizeUser, async (req, res) => {
  const { uid, email, name } = req.body;
  if (!uid || !email || !name)
    return res.status(400).json({ error: "uid, email, and name are required" });
  try {
    await createUser(uid, email, name);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:uid", authorizeUser, async (req, res) => {
  try {
    const user = await getUser(req.params.uid);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:uid", authorizeUser, async (req, res) => {
  const { name, phonenumber } = req.body;
  if (!name || !phonenumber)
    return res.status(400).json({ error: "name and phonenumber are required" });
  try {
    await updateUser(req.params.uid, name, phonenumber);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:uid/set-address", authorizeUser, async (req, res) => {
  const { addresses } = req.body;
  if (!Array.isArray(addresses))
    return res.status(400).json({ error: "addresses must be an array" });
  try {
    await setAddress(req.params.uid, addresses);
    res.json({ message: "Addresses updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:uid/add-address", authorizeUser, async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "address is required" });
  try {
    await addAddress(req.params.uid, address);
    res.json({ message: "Address added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
