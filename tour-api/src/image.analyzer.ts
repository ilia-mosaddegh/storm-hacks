import sharp from "sharp";

export type ImageAnalysis = {
  width: number | null;
  height: number | null;
  format?: string;
  dominant: { r: number; g: number; b: number } | null;
};

/**
 * Reads basic metadata and a crude dominant color from a 1x1 thumbnail.
 */
export async function analyzeImage(buf: Buffer): Promise<ImageAnalysis> {
  const meta = await sharp(buf).metadata();
  const { width = null, height = null, format } = meta;

  // Reduce to 1x1 to approximate dominant color
  const { data } = await sharp(buf).resize(1, 1).raw().toBuffer({ resolveWithObject: true });
  const [r, g, b] = Array.from(data);
  return { width, height, format, dominant: { r, g, b } };
}
