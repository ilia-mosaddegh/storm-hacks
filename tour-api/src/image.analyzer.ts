import sharp from "sharp";

export type ImageAnalysis = {
  width: number | null;
  height: number | null;
  format: string | undefined;
  dominant: { r: number; g: number; b: number } | null;
};

export async function analyzeImage(buffer: Buffer): Promise<ImageAnalysis> {
  const img = sharp(buffer);
  const meta = await img.metadata();
  const stats = await img.stats().catch(() => null);

  return {
    width: meta.width ?? null,
    height: meta.height ?? null,
    format: meta.format,
    dominant: stats
      ? { r: stats.dominant.r, g: stats.dominant.g, b: stats.dominant.b }
      : null,
  };
}
