import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import { analyzeImage } from "./image.analyzer";
import { detectLandmarkWithGemini } from "./gemini.landmark";

export const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: "No image provided. Send as form-data field 'image'." });
    }

    console.log("POST /api/analyze", {
      mime: req.file.mimetype,
      bytes: req.file.size
    });

    // 1) Try original meta
    let basic = await analyzeImage(req.file.buffer).catch(() => ({
      width: null,
      height: null,
      format: undefined as string | undefined,
      dominant: null as { r: number; g: number; b: number } | null,
    }));

    // 2) Normalize & downsize for the model (max 1280 px)
    const normalizedJpeg = await sharp(req.file.buffer)
      .jpeg({ quality: 90 })
      .resize({ width: 1280, height: 1280, fit: "inside", withoutEnlargement: true })
      .toBuffer();

    if (!basic.width || !basic.height || !basic.format) {
      basic = await analyzeImage(normalizedJpeg);
    }

    // 3) Ask Gemini
    let landmark = null as Awaited<ReturnType<typeof detectLandmarkWithGemini>> | null;
    try {
      landmark = await detectLandmarkWithGemini(normalizedJpeg, "image/jpeg");
      console.log("Gemini landmark:", landmark);
    } catch (e) {
      console.warn("Gemini landmark detection error:", (e as Error).message);
    }

    // 4) Build maps URL if we have anything textual
    let mapsUrl: string | null = null;
    if (landmark) {
      const q = [landmark.name, landmark.city, landmark.country].filter(Boolean).join(" ");
      if (q) mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
    }

    // 5) Flatten response
    return res.json({
      ok: true,
      result: {
        ...basic,
        landmark,
        mapsUrl,
      },
    });
  } catch (err) {
    console.error("analyze error:", err);
    return res.status(500).json({ ok: false, error: "Analysis failed" });
  }
});
