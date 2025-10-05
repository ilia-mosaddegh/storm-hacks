import Constants from 'expo-constants';
const API = Constants.expoConfig?.extra?.API_URL;

if (!API) console.warn('Missing API_URL in app config');

export async function startRequest(): Promise<string> {
  const res = await fetch(`${API}/api/requests`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start request');
  const { id } = await res.json();
  return id;
}

export async function getRequest(id: string) {
  const res = await fetch(`${API}/api/requests/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Request not found');
  return res.json();
}

export async function pollRequest(id: string) {
  let delay = 800;
  while (true) {
    const data = await getRequest(id);
    if (['done','error','cancelled'].includes(data.status)) return data;
    await new Promise(r => setTimeout(r, delay));
    delay = Math.min(delay * 1.6, 5000);
  }
}
