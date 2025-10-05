// src/facts.wikipedia.ts
import https from "https";

export type WikiSummary = {
  title: string;
  extract: string; // short encyclopedic summary
  url: string;     // canonical page URL
};

// Fetches a concise summary from Wikipedia REST API
export async function fetchWikiSummary(
  title: string,
  lang: string = "en"
): Promise<WikiSummary | null> {
  // Wikipedia REST summary endpoint
  const path = `/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  const options: https.RequestOptions = {
    host: `${lang}.wikipedia.org`,
    path,
    method: "GET",
    headers: {
      "User-Agent": "tourstory-backend/1.0 (https://example.com)",
      "Accept": "application/json",
    },
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json?.extract && json?.content_urls?.desktop?.page) {
            resolve({
              title: json.title,
              extract: json.extract,
              url: json.content_urls.desktop.page,
            });
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.end();
  });
}
