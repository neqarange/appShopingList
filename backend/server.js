import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/lists", itemRoutes);

export default app;
