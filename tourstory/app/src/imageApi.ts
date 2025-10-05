import Constants from "expo-constants";

const API = Constants.expoConfig?.extra?.API_URL;
console.log("API_URL from config:", API);

function api() {
  const url = Constants.expoConfig?.extra?.API_URL;
  if (!url) throw new Error("Missing API_URL in app.config.js");
  return url;
}

export async function analyzeLocalImage(uri: string, fileName = "photo.jpg", mime = "image/jpeg") {
  const form = new FormData();
  // IMPORTANT: Do NOT set Content-Type manually. RN will set the correct boundary.
  form.append("image", {
    uri,
    name: fileName,
    type: mime,
  } as unknown as Blob);

  const res = await fetch(`${api()}/api/analyze`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Analyze failed (${res.status}): ${text}`);
  }
  return res.json();
}
