import "dotenv/config";
import { fetchWikiSummary } from "./facts.wikipedia";
import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import { analyzeImage } from "./image.analyzer";
import { detectLandmarkWithGemini } from "./gemini.landmark";

const app = express();

/** CORS: during development you can leave it open; tighten later */
app.use(cors({ origin: true }));

/** Accept only images, max 8 MB, store in memory */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only images are allowed"));
    cb(null, true);
  },
});

app.get("/health", (_req, res) => res.json({ ok: true }));

/**
 * POST /api/analyze
 * Form-Data: image (file)
 * Returns: { meta, landmark, mapsUrl, facts }
 */
app.post("/api/analyze", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: "No image uploaded (field name must be 'image')." });
    }

    // Normalize to JPEG to simplify downstream handling
    let normalizedJpeg: Buffer;
    try {
      normalizedJpeg = await sharp(req.file.buffer).jpeg({ quality: 90 }).toBuffer();
    } catch (e) {
      return res.status(400).json({ ok: false, error: "Invalid or unsupported image." });
    }

    // 1) Quick local analysis
    const meta = await analyzeImage(normalizedJpeg);

    // 2) Landmark guess (best-effort)
    let landmark = null as Awaited<ReturnType<typeof detectLandmarkWithGemini>> | null;
    try {
      landmark = await detectLandmarkWithGemini(normalizedJpeg, "image/jpeg");
      console.log(landmark)
    } catch (e: any) {
      console.warn("Gemini error:", e.message);
    }

    // 2.5) Fetch short history if we have a landmark name
    let facts: { title: string; extract: string; url: string } | null = null;
    if (landmark?.name) {
      facts = await fetchWikiSummary(landmark.name, "en");
    }

    // 3) Build a Google Maps search URL when we have any textual clue
    let mapsUrl: string | null = null;
    if (landmark) {
      const q = [landmark.name, landmark.city, landmark.country].filter(Boolean).join(" ");
      if (q) mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
    }

    return res.json({ ok: true, meta, landmark, mapsUrl, facts });
  } catch (err) {
    next(err);
  }
});

/** Centralized error handler */
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ ok: false, error: `Upload error: ${err.message}` });
  }
  console.error(err);
  res.status(500).json({ ok: false, error: "Internal server error" });
});

/** Start server only if run directly (not when imported for tests) */
const PORT = Number(process.env.PORT || 3000);
if (require.main === module) {
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}

// Export for testing if needed
export { app };
