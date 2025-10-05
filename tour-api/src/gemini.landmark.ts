// src/gemini.landmark.ts
// Pure REST (v1) call to Gemini. No SDK imports. No DOM types.

export type GeminiLandmark = {
  name: string | null;
  city: string | null;
  country: string | null;
  confidence: number | null;
};

// ✅ Use exact v1 model names (no "-latest")
const PRIMARY_MODEL = "gemini-1.5-pro";
const FALLBACK_MODEL = "gemini-1.5-flash";

// Minimal fetch type so TS doesn't require DOM libs
type FetchLike = (input: any, init?: any) => Promise<any>;

function getFetch(): FetchLike {
  const f = (globalThis as any).fetch;
  if (!f) {
    throw new Error(
      "Global fetch not found. Use Node 18+ OR install 'undici' and set: (globalThis as any).fetch = (await import('undici')).fetch as any;"
    );
  }
  return f as FetchLike;
}

async function callGeminiV1(
  modelName: string,
  buffer: Buffer,
  mimeType: string
): Promise<GeminiLandmark | null> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY env var.");

  const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const prompt = `
You are a landmark recognition assistant.
Return ONLY JSON (no extra text) exactly like:
{"name": string|null, "city": string|null, "country": string|null, "confidence": number|null}
If unsure, set fields to null.
`;

  // ❌ Do NOT send generation_config / responseMimeType for v1 generateContent
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType || "image/jpeg",
              data: buffer.toString("base64"),
            },
          },
        ],
      },
    ],
  };

  const fetchFn = getFetch();
  const res = await fetchFn(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.warn(`[Gemini:v1 ${modelName}] HTTP ${res.status}: ${String(errText).slice(0, 300)}`);
    return null;
  }

  const data: any = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.content?.parts?.[0]?.functionCall ??
    "";

  console.log(`[Gemini:v1 ${modelName}] raw (first 200):`, String(text).slice(0, 200));

  if (typeof text !== "string" || !text.trim()) return null;

  let obj: any;
  try {
    obj = JSON.parse(text);
  } catch {
    console.warn(`[Gemini:v1 ${modelName}] non-JSON output`);
    return null;
  }

  const out: GeminiLandmark = {
    name: obj?.name ?? null,
    city: obj?.city ?? null,
    country: obj?.country ?? null,
    confidence: typeof obj?.confidence === "number" ? obj.confidence : null,
  };

  if (!out.name && !out.city && !out.country) return null;
  return out;
}

export async function detectLandmarkWithGemini(
  buffer: Buffer,
  mimeType = "image/jpeg"
): Promise<GeminiLandmark | null> {
  const first = await callGeminiV1(PRIMARY_MODEL, buffer, mimeType);
  if (first) return first;

  console.log(`[Gemini:v1] Primary ${PRIMARY_MODEL} returned null, trying ${FALLBACK_MODEL}`);
  return await callGeminiV1(FALLBACK_MODEL, buffer, mimeType);
}
