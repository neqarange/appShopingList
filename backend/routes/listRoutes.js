import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import { requireOwner } from "../middleware/ownerMiddleware.js";
import List from "../models/List.js";
import User from "../models/User.js";

const router = Router();

// GET /api/lists — moje + sdílené
router.get("/", authRequired, async (req, res) => {
  const userId = req.user.id;
  const lists = await List.find({
    $or: [{ owner: userId }, { sharedWith: userId }],
  }).sort("-updatedAt");
  res.json(lists);
});

// POST /api/lists — vytvoření (owner = current)
router.post("/", authRequired, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name required" });
  const list = await List.create({ name, owner: req.user.id });
  res.status(201).json(list);
});

// PUT /api/lists/:id/share — přidání uživatele do sdílení (email → id)
router.put("/:id/share", authRequired, requireOwner, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  const list = req.list;
  if (list.sharedWith.some((u) => u.toString() === user._id.toString())) {
    return res.json(list); // already shared
  }
  list.sharedWith.push(user._id);
  await list.save();
  res.json(list);
});

// PUT /api/lists/:id/archive — owner only
router.put("/:id/archive", authRequired, requireOwner, async (req, res) => {
  const list = req.list;
  list.archived = true;
  await list.save();
  res.json(list);
});

// DELETE /api/lists/:id — owner only
router.delete("/:id", authRequired, requireOwner, async (req, res) => {
  await req.list.deleteOne();
  res.status(204).end();
});

export default router;
