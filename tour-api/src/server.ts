// src/server.ts
import express from "express";
import cors from "cors";
import multer from "multer";
import { analyzeImage } from "./image.analyzer";

export const app = express();

// allow your app to call this API
app.use(cors());

// Multer to parse multipart/form-data (images)
const upload = multer({ storage: multer.memoryStorage() });

// Health check (optional)
app.get("/health", (_req, res) => res.json({ ok: true }));

// POST /api/analyze  (field name: "image")
app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided. Send as form-data with field 'image'." });
    }
    const result = await analyzeImage(req.file.buffer);
    return res.json({ ok: true, result });
  } catch (err) {
    console.error("analyze error:", err);
    return res.status(500).json({ ok: false, error: "Analysis failed" });
  }
});
