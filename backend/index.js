import express from "express";
import dbConect from "./db/dbConect.js";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/lists", itemRoutes); // nested under /:listId/items

dbConect()
  .then(() => {
    app.listen(5001, () => console.log(`API on http://localhost:${5001}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });