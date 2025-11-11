import List from "../models/List.js";

export async function requireOwner(req, res, next) {
  const { id: listId } = req.params;
  const userId = req.user.id;
  const list = await List.findById(listId);
  if (!list) return res.status(404).json({ message: "List not found" });
  if (list.owner.toString() !== userId)
    return res.status(403).json({ message: "Owner only" });
  req.list = list; // pass along
  next();
}

export async function requireOwnerFromItem(req, res, next) {
  // for routes with :listId in params
  const { listId } = req.params;
  const userId = req.user.id;
  const list = await List.findById(listId);
  if (!list) return res.status(404).json({ message: "List not found" });
  if (list.owner.toString() !== userId)
    return res.status(403).json({ message: "Owner only" });
  req.list = list;
  next();
}
