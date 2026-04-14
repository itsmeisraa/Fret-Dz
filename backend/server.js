// server.js — Fret-DZ Express API
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const authRoutes = require('./routes/auth');
const camionneurRoutes = require('./routes/camionneurs');
const expeditionRoutes = require('./routes/expeditions');
const app = express();
const PORT = process.env.PORT || 4000;

// ── Ensure uploads directory exists ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static: serve uploaded files ─────────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/camionneurs',  require('./routes/camionneurs'));
app.use('/api/expeditions',  require('./routes/expeditions'));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Fret-DZ API' }));

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(PORT, () => {
  console.log(`✅ Fret-DZ API running → http://localhost:${PORT}`);
});
