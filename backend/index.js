import dotenv from "dotenv";

// Vyber správný .env soubor podle prostředí
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });

import dbConect from "./db/dbConect.js";
import app from "./server.js";

// Připojení databáze a spuštění serveru
dbConect()
  .then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
