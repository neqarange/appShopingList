import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import { requireOwner } from "../middleware/ownerMiddleware.js";
import List from "../models/List.js";
import User from "../models/User.js";

const router = Router();

router.get("/", authRequired, async (req, res) => {
  const userId = req.user.id;

  const lists = await List.find({
    $or: [{ owner: userId }, { sharedWith: userId }],
  })
    .populate("owner", "email name")
    .populate("sharedWith", "email name")
    .sort({ updatedAt: -1 });

  res.json(lists);
});

router.post("/", authRequired, async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name required" });
  }

  const list = await List.create({
    name,
    owner: req.user.id,
    sharedWith: [],      // clear
    archived: false,     // explicitně
  });

  // vrátíme i populate
  const populated = await List.findById(list._id)
    .populate("owner", "email name")
    .populate("sharedWith", "email name");

  res.status(201).json(populated);
});

router.put("/:id/share", authRequired, requireOwner, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const userToShare = await User.findOne({ email });
  if (!userToShare) {
    return res.status(404).json({ message: "User not found" });
  }

  const list = req.list;

  const alreadyShared = list.sharedWith.some(
    (id) => id.toString() === userToShare._id.toString()
  );

  if (!alreadyShared) {
    list.sharedWith.push(userToShare._id);
    await list.save();
  }

  const populated = await List.findById(list._id)
    .populate("owner", "email name")
    .populate("sharedWith", "email name");

  res.json(populated);
});

router.get("/:id", authRequired, async (req, res) => {
  try {
    const { id } = req.params;

    const list = await List.findById(id)
      .populate("owner", "email name")
      .populate("sharedWith", "email name");

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Přístup: owner OR sdílený
    const userId = req.user.id;
    const isOwner = list.owner._id.toString() === userId;
    const isShared = list.sharedWith
      .map(u => u._id.toString())
      .includes(userId);

    if (!isOwner && !isShared) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to load list" });
  }
});

router.put("/:id", authRequired, requireOwner, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name required" });
    }

    req.list.name = name.trim();
    await req.list.save();

    const populated = await List.findById(req.list._id)
      .populate("owner", "email name")
      .populate("sharedWith", "email name");

    res.json(populated);

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});



router.put("/:id/archive", authRequired, requireOwner, async (req, res) => {
  const list = req.list;

  list.archived = true;
  await list.save();

  res.json(list);
});

router.delete("/:id", authRequired, requireOwner, async (req, res) => {
  await req.list.deleteOne();
  res.status(204).end();
});

export default router;

