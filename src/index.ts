import { app } from "./server.js";
import { startWorker } from "./queue.js";
import { updateRequest } from "./requests.store.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

// Demo worker to simulate progress
startWorker(async ({ requestId }) => {
  const steps = [
    "identifying",
    "facts_fetching",
    "story_writing",
    "tts_rendering",
  ] as const;

  for (const s of steps) {
    updateRequest(requestId, { status: s });
    await new Promise(r => setTimeout(r, 600));
  }

  updateRequest(requestId, {
    status: "done",
    audioUrl: `https://example.com/audio/${requestId}.mp3`
  });
});
