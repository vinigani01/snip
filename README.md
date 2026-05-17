# Snip — URL Shortener

A self-hosted, containerised URL shortener with custom aliases, click tracking, and a clean light UI.
Built with Docker and deployed on [Render](https://render.com) with PostgreSQL.

**Live:** [snip-zdbg.onrender.com](https://snip-zdbg.onrender.com)

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | PostgreSQL (Render free tier) |
| Frontend | Vanilla HTML / CSS / JS |
| Container | Docker + Docker Compose |
| Hosting | Render (Docker runtime) |

---

## Project Structure

```
urlshort/
├── Dockerfile
├── docker-compose.yml
├── render.yaml
├── .env.example
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
- Fully containerised — runs anywhere Docker runs

---

## Run Locally with Docker

### 1. Clone the repo

```bash
git clone https://github.com/vinigani01/urlshort
cd urlshort
```

### 2. Set up environment

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to a local or remote PostgreSQL connection string:

```
DATABASE_URL=postgresql://user:password@localhost:5432/urlshort
BASE_URL=http://localhost:3000
```

### 3. Build and run

```bash
docker compose up --build -d
```

### 4. Open the app

```
http://localhost:3000
```

### Stop

```bash
docker compose down
```

---

## Deploy to Render

Render runs the app directly from the `Dockerfile` — no extra build config needed.
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
| `DATABASE_URL` | PostgreSQL connection string — auto-set by Render via the blueprint |
| `BASE_URL` | Public base URL for generated short links (e.g. `https://your-app.onrender.com`) |
| `PORT` | Port the container exposes (default: `3000`) |

---

## Custom Domain

1. Render dashboard → your service → **Settings → Custom Domains**
2. Add your domain and follow the DNS instructions
3. Update `BASE_URL` in Environment to match your custom domain

---

## Notes

- The Render free tier spins down after inactivity — the first request after idle may take ~50 seconds as the container restarts.
- There is no authentication by default — anyone who can reach the app can create links.
