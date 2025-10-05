import { randomUUID } from "crypto";

export type RequestStatus =
  | "queued" | "identifying" | "facts_fetching"
  | "story_writing" | "tts_rendering" | "done"
  | "error" | "cancelled";

export type RequestRecord = {
  id: string;
  status: RequestStatus;
  attempt: number;
  updatedAt: number;
  facts?: unknown;
  storyText?: string;
  audioUrl?: string;
  errorMessage?: string;
};

const store = new Map<string, RequestRecord>();

export function createRequest() {
  const id = randomUUID();
  const rec: RequestRecord = {
    id,
    status: "queued",
    attempt: 0,
    updatedAt: Date.now()
  };
  store.set(id, rec);
  return { id };
}

export function getRequest(id: string) {
  return store.get(id);
}

export function updateRequest(id: string, partial: Partial<RequestRecord>) {
  const current = store.get(id);
  if (!current) return false;
  store.set(id, { ...current, ...partial, updatedAt: Date.now() });
  return true;
}
