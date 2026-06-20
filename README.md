# CausalFunnel — User Analytics Application

A full-stack user analytics platform that tracks page views and click events, and visualises them in a real-time dashboard with session journeys and click heatmaps.

---

## Assignment Objective

**Build a Simple User Analytics Application** to help e-commerce businesses understand user behavior through session tracking and analytics.

### Requirements Fulfilled
1. **Event Tracking (Client Side)**: A vanilla JS script (`tracker.js`) tracks `page_view` and `click` events, attaching `session_id`, `event_type`, `page_url`, `timestamp`, and `x/y` coordinates.
2. **Backend (Node.js)**: Node.js/Express APIs to receive events, list sessions, fetch session event journeys, and aggregate heatmap data.
3. **Database (MongoDB)**: All data is stored in a structured, queryable format using Mongoose.
4. **Dashboard (Frontend)**: React/Vite dashboard featuring a **Sessions View** (lists sessions + timeline journey) and a **Heatmap View** (visualizes click positions on selected pages).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Tracker | Vanilla JavaScript (IIFE, no dependencies) |
| Backend | Node.js · Express.js · Mongoose |
| Database | MongoDB |
| Dashboard | React 18 · Vite · React Router v6 |
| Styling | Vanilla CSS |

---

## Project Structure

```
casualFunnel/
├── tracker/           # Embeddable JS tracking snippet
│   └── tracker.js
├── demo/              # Mock e-commerce demo page (ShopNova)
│   └── index.html
├── backend/           # Node.js REST API
│   ├── src/
│   │   ├── index.js
│   │   ├── models/Event.js
│   │   ├── controllers/eventController.js
│   │   └── routes/events.js
│   ├── .env.example
│   └── package.json
└── dashboard/         # React + Vite analytics dashboard
    ├── src/
    │   ├── App.jsx
    │   ├── index.css
    │   ├── lib/api.js
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── SessionsTable.jsx
    │   │   ├── EventJourney.jsx
    │   │   └── HeatmapCanvas.jsx
    │   └── pages/
    │       ├── Sessions.jsx
    │       └── Heatmap.jsx
    └── package.json
```

---

## Setup

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally (`mongodb://localhost:27017`) or a MongoDB Atlas connection string

---

### 1. Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env — set MONGODB_URI and PORT if needed

# Start server
npm run dev        # with nodemon (hot reload)
# OR
npm start          # production
```

Backend runs on **http://localhost:5000**.

---

### 2. Dashboard

```bash
cd dashboard

# Install dependencies
npm install

# Start dev server
npm run dev
```

Dashboard runs on **http://localhost:3000**.
The Vite dev server proxies `/api` requests to `http://localhost:5000`.

---

### 3. Demo Page

Open `demo/index.html` directly in your browser (or serve it):

```bash
# Using npx serve (no install needed)
npx serve demo
```

The demo page loads `tracker.js` which starts recording your interactions immediately.
A green **"CausalFunnel Tracking Active"** badge confirms the tracker is running.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/events` | Receive and store an event |
| `GET` | `/api/sessions` | List all sessions with event counts |
| `GET` | `/api/sessions/:id` | All events for a session (ordered by time) |
| `GET` | `/api/heatmap?page_url=...` | Click x/y data for heatmap |
| `GET` | `/api/pages` | Unique tracked page URLs |
| `GET` | `/health` | Health check |

### Event Payload (POST /api/events)

```json
{
  "session_id": "sess_abc123_xyz",
  "event_type": "click",
  "page_url": "http://localhost:5500/demo/index.html",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "x": 450,
  "y": 320,
  "viewport_width": 1440,
  "viewport_height": 900
}
```

---

## Dashboard Features

### Sessions View
- Stats cards: total sessions, events, unique pages, avg events/session
- Sortable sessions table with session ID, event count, pages visited, timestamps
- Click any row → animated slide-in panel showing the full event journey timeline

### Heatmap View
- Dropdown to select any tracked page URL
- **Contextual Iframe Overlay**: The actual target page is loaded into an embedded iframe, and the canvas heatmap perfectly overlays on top, providing 1:1 visual context of where clicks occurred.
- Canvas heatmap with additive gradient blobs (higher density = brighter red)
- Click density stats: total clicks, unique positions
- Color legend (low → high density)

### Extra Features Added
Beyond the core assignment requirements, the following advanced features were implemented:
- **Element-Level Tracking**: The tracker goes beyond raw coordinates to extract contextual DOM data (`target_tag`, `target_id`, `target_class`, `target_text`) for every click.
- **Top Clicked Elements Leaderboard**: An automatically generated sidebar in the Heatmap view that ranks the top 5 most interacted-with HTML elements (e.g., buttons, links) based on contextual target text.
- **Premium Glassmorphism UI**: Built with a sleek, modern aesthetic using CSS variables, micro-animations, and responsive flex/grid layouts instead of a basic wireframe.
- **Modular Architecture**: Clean separation of concerns with isolated React components, centralized API utilities, and domain-driven backend controllers (`ingestionController` & `analyticsController`).

---

## Assumptions & Trade-offs

| Decision | Rationale |
|---|---|
| `session_id` stored in `localStorage` | Simpler than cookies; survives page reloads within the same browser |
| `sendBeacon` with `fetch` fallback | Ensures events are sent even on page unload |
| Click coordinates stored as raw pixels + viewport dimensions | Allows accurate normalization to any canvas size in the heatmap |
| No authentication on the API | Out of scope for this assignment; would add JWT/API key in production |
| Canvas heatmap (no 3rd party lib) | Zero dependencies; additive compositing gives natural density visualization |
| Vite proxy for `/api` | Avoids CORS issues in development; production would use nginx or a unified host |
| MongoDB aggregation for sessions | Single DB round-trip for the sessions list (efficient at scale) |
