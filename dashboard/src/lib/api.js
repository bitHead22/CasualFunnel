const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  /** GET /api/sessions → [{ session_id, event_count, first_seen, last_seen, pages }] */
  getSessions: () => request('/sessions'),

  /** GET /api/sessions/:id → { session_id, events: [...] } */
  getSession: (id) => request(`/sessions/${encodeURIComponent(id)}`),

  /** GET /api/heatmap?page_url=... → { page_url, clicks: [{ x, y, viewport_width, viewport_height }] } */
  getHeatmap: (pageUrl) => request(`/heatmap?page_url=${encodeURIComponent(pageUrl)}`),

  /** GET /api/pages → [url, ...] */
  getPages: () => request('/pages'),
};
