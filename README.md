# Snip - URL Shortener

A self-hosted, containerised URL shortener with custom aliases, click tracking, and a clean light UI.
Built with Docker and deployed on [Render](https://render.com) with PostgreSQL.

**Live:** [snip-zdbg.onrender.com](https://snip-zdbg.onrender.com)

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Frontend | Vanilla HTML / CSS / JS |
| Container | Docker + Docker Compose |
| Hosting | Render (Docker runtime) |

---

## Project Structure

```
urlshort/
├── Dockerfile
├── docker-compose.yml           # Production / Render deployment
├── docker-compose.local.yml     # Local development (includes Postgres container)
├── render.yaml
├── .env.example
├── backend/
│   ├── server.js
│   └── package.json
└── frontend/
    └── index.html
```

The repo includes two compose files:

| File | Purpose |
|---|---|
| `docker-compose.yml` | For Production - used by Render |
| `docker-compose-local.yml` | For Running Locally - on Local Machine |

---

## Features

- Shorten any valid URL
- Custom aliases (e.g. `/my-link`)
- Click tracking
- Recent links dashboard
- Persistent storage via PostgreSQL
- Fully containerised - runs anywhere Docker runs

---

## Run Locally with Docker

### Steps

**1. Clone the repo**

```bash
git clone https://github.com/vinigani01/snip
cd snip
```

**2. Start the app**

```bash
docker compose -f docker-compose-local.yml up --build -d
```

This starts two containers — a Postgres database and the app — on the same Docker network. No manual database setup needed.

**3. Open the app**

```
http://localhost:3000
```

**4. Stop the app**

```bash
docker compose -f docker-compose-local.yml down
```

### Next time (no rebuild needed)

```bash
docker compose -f docker-compose-local.yml up -d
```

---

## Deploy to Render

Render runs the app directly from the `Dockerfile` using `docker-compose.yml`.
The `render.yaml` blueprint automates the full setup.

### Steps

1. Fork or clone this repo to your GitHub account

2. Go to [render.com](https://render.com) → **New → Blueprint**

3. Connect your GitHub repo — Render reads `render.yaml` and creates:
   - A free PostgreSQL database
   - A Docker web service built from the `Dockerfile`

4. After the first deploy, copy your app URL from the Render dashboard

5. Go to your service → **Environment** → set `BASE_URL` to your app URL → **Save Changes**

Render redeploys automatically on every push to `main`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string — auto-set by Render via the blueprint; set manually for local use |
| `BASE_URL` | Public base URL for generated short links (e.g. `https://your-app.onrender.com`) |
| `PORT` | Port the container exposes (default: `3000`) |

---

## Custom Domain

1. Render dashboard → your service → **Settings → Custom Domains**
2. Add your domain and follow the DNS instructions
3. Update `BASE_URL` in Environment to match your custom domain

---

## Notes

- The Render free tier spins down after inactivity - the first request after idle may take ~50 seconds as the container restarts.
- There is no authentication by default - anyone who can reach the app can create links.
