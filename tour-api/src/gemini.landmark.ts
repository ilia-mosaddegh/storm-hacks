// src/gemini.landmark.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Part } from "@google/generative-ai";

export type LandmarkGuess = {
  name: string;
  city?: string;
  country?: string;
  confidence: number; // 0..1
};

type DetectResponse = {
  best?: LandmarkGuess;
  candidates?: LandmarkGuess[];
};

const SYSTEM =
  "You are a precise landmark recognizer. Return strict JSON only. No markdown, no prose.";

const USER_INSTRUCTION =
  [
    "Look at the image and propose up to 5 landmark candidates.",
    "For each candidate, include: name (string), city (string, optional), country (string, optional), confidence (0..1).",
    "Pick the single best guess as 'best'.",
    "If you are not confident at all, return candidates: [] and omit 'best'.",
  ].join(" ");

function buildParts(jpegImage: Buffer, mime: string): Part[] {
  return [
    { text: USER_INSTRUCTION },
    { inlineData: { data: jpegImage.toString("base64"), mimeType: mime } },
  ];
}

// ...imports and types unchanged...

async function runModel(
  modelId: "gemini-2.5-pro" | "gemini-2.5-pro",
  image: Buffer,
  mime: string
) {
  const apiKey = process.env.GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction:
      "You are a precise landmark recognizer. Return strict JSON only. No markdown, no prose.",
    generationConfig: {
      temperature: 0.1,
      // If your SDK supports it, this helps:
      // @ts-ignore
      responseMimeType: "application/json"
    },
  });

  const result = await model.generateContent([
    { text: [
        "Look at the image and propose up to 5 landmark candidates.",
        "For each candidate include: name (string), city (optional), country (optional), confidence (0..1).",
        "Pick a single best guess as 'best'. If you are unsure, omit 'best' and return candidates: []."
      ].join(" ")
    },
    { inlineData: { data: image.toString("base64"), mimeType: mime } },
  ]);

  const text = result.response.text().trim();
  const jsonStr = text.match(/\{[\s\S]*\}$/)?.[0] ?? text;
  try { return JSON.parse(jsonStr); } catch { return null; }
}

export async function detectLandmarkWithGemini(
  jpeg: Buffer,
  mime: "image/jpeg" | "image/png" = "image/jpeg"
) {
  // 1) Try PRO first (more accurate)
  const pro = await runModel("gemini-2.5-pro", jpeg, mime);
  const proBest = pro?.best;
  if (proBest?.name && (proBest.confidence ?? 0) >= 0.5) return proBest;

  // 2) Fallback to FLASH
  const flash = await runModel("gemini-2.5-pro", jpeg, mime);
  return flash?.best ?? null;
}
