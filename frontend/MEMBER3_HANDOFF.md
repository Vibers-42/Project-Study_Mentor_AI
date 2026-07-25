# Member 3 Handoff

This repository contains only the Member 3 frontend: analytics, dashboard, gamification, learner profile, charts, reusable UI, animations, data adapters, hooks, and TypeScript types.

## Routes

- `/dashboard`
- `/analytics`
- `/leaderboard`
- `/profile`

There is deliberately no login, backend, interview-mode, practice-session, roadmap, voice, or settings route here. Those belong to the other team members.

## Running independently

The project starts in demo mode by default, using deterministic local data:

```bash
npm install
npm run dev
```

To connect the integration backend, create `.env` from `.env.example`, set `VITE_USE_MOCKS=false`, and set `VITE_API_URL` to the backend API root.

## Backend contract

Member 3 only calls these read endpoints:

- `GET /analytics`
- `GET /progress`
- `GET /leaderboard`
- `GET /profile`
- `GET /achievements`

Responses may be wrapped in `{ data: ... }`. Scores supplied on a 0-10 scale are normalized for the UI; 0-100 values should be documented by the integration owner before use.

Authentication remains the integration owner's responsibility. If their host application stores a bearer token as `aism_token`, this frontend will attach it. A 401 is surfaced to the relevant page; it does not redirect to an authentication route that is not part of this module.
