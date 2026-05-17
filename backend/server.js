const express = require('express');
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const cors = require('cors');
const validUrl = require('valid-url');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Init Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')
    ? { rejectUnauthorized: false }
    : false,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      short_code TEXT UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('✅ Database ready');
}

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// POST /api/shorten
app.post('/api/shorten', async (req, res) => {
  const { url, custom_code } = req.body;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  // Prepend https:// if missing scheme
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  if (!validUrl.isWebUri(targetUrl)) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  let shortCode = custom_code ? custom_code.trim() : nanoid(6);

  // Validate custom code
  if (custom_code) {
    if (!/^[a-zA-Z0-9_-]{2,20}$/.test(shortCode)) {
      return res.status(400).json({ error: 'Custom code must be 2–20 alphanumeric characters (a-z, 0-9, -, _)' });
    }
    const { rows } = await pool.query('SELECT 1 FROM urls WHERE short_code = $1', [shortCode]);
    if (rows.length > 0) {
      return res.status(409).json({ error: 'That custom code is already taken' });
    }
  }

  try {
    await pool.query(
      'INSERT INTO urls (short_code, original_url) VALUES ($1, $2)',
      [shortCode, targetUrl]
    );
    const shortUrl = `${BASE_URL}/${shortCode}`;
    return res.json({ short_url: shortUrl, short_code: shortCode, original_url: targetUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create short URL' });
  }
});

// GET /api/stats
app.get('/api/stats', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT short_code, original_url, clicks, created_at FROM urls ORDER BY created_at DESC LIMIT 20'
  );
  res.json(rows);
});

// GET /:code — redirect
app.get('/:code', async (req, res) => {
  const { code } = req.params;

  // Skip favicon and api routes
  if (code === 'favicon.ico' || code.startsWith('api')) {
    return res.status(404).send('Not found');
  }

  const { rows } = await pool.query('SELECT * FROM urls WHERE short_code = $1', [code]);
  if (rows.length === 0) {
    return res.redirect(`/?error=Link+not+found`);
  }

  await pool.query('UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1', [code]);
  return res.redirect(301, rows[0].original_url);
});

initDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 URL Shortener running at ${BASE_URL}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});
