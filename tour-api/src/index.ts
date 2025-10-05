// src/index.ts
import path from "path";
import dotenv from "dotenv";

// Load ../.env relative to THIS file (not CWD)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { app } from "./server";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log("Env file loaded from:", path.resolve(__dirname, "../.env"));
  console.log("Gemini key present:", !!process.env.GOOGLE_API_KEY);
  if (process.env.GOOGLE_API_KEY) {
    console.log("Gemini key starts with:", process.env.GOOGLE_API_KEY.slice(0, 6));
  }
});
