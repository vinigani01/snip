# SNIP — Self-Hosted URL Shortener

A containerised, self-hosted URL shortener with a sleek dark UI.
Built with Node.js, Express, SQLite, and Docker.

---

## 📦 Project Structure

```
urlshort/
├── Dockerfile
├── docker-compose.yml
├── backend/
│   ├── server.js
│   └── package.json
└── frontend/
    └── index.html
```

---

## 🚀 Quick Start (Local Network)

### 1. Build and run
```bash
docker compose up --build -d
```

### 2. Open the app
```
http://localhost:3000
```

Your links will be shortened to `http://localhost:3000/XXXXXX`.

---

## 🌐 Make It Publicly Accessible (Any Device, Any Network)

To generate short links accessible from the internet, you need a **public URL**.
Pick one of these options:

---

### Option A: Cloudflare Tunnel (Free, Permanent Domain) ✅ RECOMMENDED

1. Install cloudflared:
   ```bash
   # macOS
   brew install cloudflare/cloudflare/cloudflared

   # Linux
   wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   ```

2. Log in (one-time):
   ```bash
   cloudflared tunnel login
   ```

3. Create a named tunnel:
   ```bash
   cloudflared tunnel create snip
   ```

4. Route DNS (replace `yourdomain.com` with your Cloudflare domain):
   ```bash
   cloudflared tunnel route dns snip snip.yourdomain.com
   ```

5. Start the app with your public URL:
   ```bash
   BASE_URL=https://snip.yourdomain.com docker compose up -d
   cloudflared tunnel run snip --url http://localhost:3000
   ```

---

### Option B: ngrok (Quick, Temporary URL)

1. Install: https://ngrok.com/download

2. Start a tunnel:
   ```bash
   ngrok http 3000
   ```

3. Copy the `https://xxxx.ngrok-free.app` URL, then restart the app:
   ```bash
   BASE_URL=https://xxxx.ngrok-free.app docker compose up --build -d
   ```

> Note: Free ngrok URLs change every restart. Upgrade to a paid plan for a fixed subdomain.

---

### Option C: Deploy to a VPS (Permanent, Full Control)

1. SSH into your server (e.g., DigitalOcean, Hetzner, Linode)

2. Install Docker:
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

3. Clone or copy project files, then:
   ```bash
   BASE_URL=http://YOUR_SERVER_IP:3000 docker compose up -d
   ```

4. For a real domain + HTTPS, add an Nginx reverse proxy + Let's Encrypt certificate:
   ```bash
   apt install certbot python3-certbot-nginx -y
   certbot --nginx -d yourdomain.com
   ```
   Then set `BASE_URL=https://yourdomain.com` and redeploy.

---

## ⚙️ Configuration

| Environment Variable | Default                  | Description                          |
|----------------------|--------------------------|--------------------------------------|
| `PORT`               | `3000`                   | Port the server listens on           |
| `BASE_URL`           | `http://localhost:3000`  | Public base URL for short links      |

Set these in `docker-compose.yml` or pass via CLI:
```bash
BASE_URL=https://mysite.com docker compose up -d
```

---

## 🛑 Stop / Remove

```bash
# Stop
docker compose down

# Stop and delete all data
docker compose down -v
```

---

## 📊 Features

- Shorten any valid URL
- Custom aliases (e.g. `/my-link`)
- Click tracking
- Recent links dashboard
- SQLite persistence (data survives container restarts)
- Works on all devices on your network or publicly

---

## 🔒 Security Notes

- There is no authentication by default — anyone who can reach the app can create links.
- For private use, add HTTP basic auth via Nginx or a middleware.
- SQLite data is stored in a Docker volume (`url_data`).
