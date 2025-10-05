type Job = { requestId: string };
const q: Job[] = [];

export function enqueue(job: Job) {
  q.push(job);
}

export function startWorker(processJob: (j: Job) => Promise<void>) {
  setInterval(async () => {
    const job = q.shift();
    if (!job) return;
    try {
      await processJob(job);
    } catch (err) {
      console.error("Worker error:", err);
    }
  }, 250);
}
