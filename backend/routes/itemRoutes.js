import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import { requireOwnerFromItem } from "../middleware/ownerMiddleware.js";
import List from "../models/List.js";
import Item from "../models/Item.js";

const router = Router();

// helper: authorize access (owner or shared user)
async function canAccessList(userId, listId) {
  const list = await List.findById(listId);
  if (!list) return null;
  const isOwner = list.owner.toString() === userId;
  const isShared = list.sharedWith.map(String).includes(userId);
  return isOwner || isShared ? list : null;
}

// GET /api/lists/:listId/items
router.get("/:listId/items", authRequired, async (req, res) => {
  const { listId } = req.params;
  const list = await canAccessList(req.user.id, listId);
  if (!list) return res.status(403).json({ message: "Forbidden" });
  const items = await Item.find({ listId }).sort("-updatedAt");
  res.json(items);
});

// POST /api/lists/:listId/items — přidají i sdílení uživatelé
router.post("/:listId/items", authRequired, async (req, res) => {
  const { listId } = req.params;
  const list = await canAccessList(req.user.id, listId);
  if (!list) return res.status(403).json({ message: "Forbidden" });
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name required" });
  const item = await Item.create({ listId, name });
  res.status(201).json(item);
});

// PUT /api/lists/:listId/items/:itemId/bought — kdokoli z účastníků
router.put("/:listId/items/:itemId/bought", authRequired, async (req, res) => {
  const { listId, itemId } = req.params;
  const list = await canAccessList(req.user.id, listId);
  if (!list) return res.status(403).json({ message: "Forbidden" });
  const item = await Item.findOne({ _id: itemId, listId });
  if (!item) return res.status(404).json({ message: "Item not found" });
  item.bought = !!req.body.bought;
  await item.save();
  res.json(item);
});

// PUT /api/lists/:listId/items/:itemId/archive — pouze owner
router.put(
  "/:listId/items/:itemId/archive",
  authRequired,
  requireOwnerFromItem,
  async (req, res) => {
    const { listId, itemId } = req.params;
    const item = await Item.findOne({ _id: itemId, listId });
    if (!item) return res.status(404).json({ message: "Item not found" });
    item.archived = true;
    await item.save();
    res.json(item);
  }
);

export default router;
