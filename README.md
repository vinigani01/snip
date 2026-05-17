# Snip — URL Shortener

A self-hosted URL shortener with custom aliases, click tracking, and a clean light UI.
Deployed on [Render](https://render.com) with PostgreSQL.

**Live:** [snip-zdbg.onrender.com](https://snip-zdbg.onrender.com)

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | PostgreSQL (Render free tier) |
| Frontend | Vanilla HTML / CSS / JS |
| Hosting | Render (Docker) |

---

## Project Structure

```
urlshort/
├── Dockerfile
├── docker-compose.yml
├── render.yaml
├── backend/
│   ├── server.js
│   └── package.json
└── frontend/
    └── index.html
```

---

## Features

- Shorten any valid URL
- Custom aliases (e.g. `/my-link`)
- Click tracking
- Recent links dashboard
- Persistent storage via PostgreSQL

---

## Deploy to Render

This repo includes a `render.yaml` blueprint that sets everything up automatically.

### Steps

1. Fork or clone this repo to your GitHub account

2. Go to [render.com](https://render.com) → **New → Blueprint**

3. Connect your GitHub repo — Render will detect `render.yaml` and create:
   - A free PostgreSQL database (`urlshort-db`)
   - A Docker web service (`snip`)

4. After the first deploy completes, copy your app URL from the Render dashboard (e.g. `https://your-app.onrender.com`)

5. Go to your service → **Environment** → set `BASE_URL` to your app URL → **Save Changes**

Render will redeploy automatically and your short links will use the correct base URL.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string — set automatically by Render via the blueprint |
| `BASE_URL` | Public base URL for generated short links (e.g. `https://your-app.onrender.com`) |
| `PORT` | Port the server listens on (default: `3000`) |

---

## Custom Domain

To connect a custom domain:

1. Render dashboard → your service → **Settings → Custom Domains**
2. Add your domain and follow the DNS instructions
3. Update `BASE_URL` in Environment to match your custom domain

---

## Notes

- The Render free tier spins down after inactivity — the first request after a period of idle may take ~50 seconds to wake up.
- There is no authentication by default — anyone who can reach the app can create links.
