// routes/expeditions.js — Table C (Interactions)
const express = require('express');
const multer  = require('multer');
const path    = require('path');
const router  = express.Router();
const store   = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

// Multer config — save uploads to /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

// ── GET /api/expeditions — own expeditions only (RLS-equivalent) ─────────────
router.get('/', authMiddleware, (req, res) => {
  const { statut } = req.query;
  let list = store.getExpeditionsByUser(req.user.id);
  if (statut && statut !== 'Tous') list = list.filter((e) => e.statut === statut);
  // Hydrate camionneur info
  const camionneurs = require('../data/store').getAllCamionneurs();
  const hydrated = list.map((e) => ({
    ...e,
    camionneur: camionneurs.find((c) => c.id === e.camId) || null,
  }));
  res.json(hydrated);
});

// ── POST /api/expeditions — create new expedition ────────────────────────────
router.post('/', authMiddleware, upload.single('bon'), (req, res) => {
  const { camId, dep, arr, kg, desc, date } = req.body;

  if (!camId || !dep || !arr || !kg)
    return res.status(400).json({ error: 'camId, dep, arr et kg sont obligatoires' });

  const cam = store.getCamionneurById(camId);
  if (!cam)  return res.status(404).json({ error: 'Camionneur introuvable' });
  if (!cam.avail) return res.status(409).json({ error: 'Ce camionneur est actuellement occupé' });

  const kgNum = parseInt(kg, 10);
  if (isNaN(kgNum) || kgNum <= 0)
    return res.status(400).json({ error: 'Poids invalide' });
  if (kgNum > cam.cap)
    return res.status(400).json({ error: `Poids dépasse la capacité du camion (${cam.cap.toLocaleString()} kg max)` });

  const bon = req.file ? req.file.filename : null;

  const exp = store.createExpedition({
    userId: req.user.id,
    camId,
    dep,
    arr,
    kg: kgNum,
    desc: desc || null,
    date:  date || new Date().toISOString().slice(0, 10),
    bon,
  });

  res.status(201).json({ ...exp, camionneur: cam });
});

// ── POST /api/expeditions/:id/bon — upload bon de livraison later ─────────────
router.post('/:id/bon', authMiddleware, upload.single('bon'), (req, res) => {
  const exp = store.getExpeditionById(req.params.id);
  if (!exp) return res.status(404).json({ error: 'Expédition introuvable' });
  if (exp.userId !== req.user.id)
    return res.status(403).json({ error: 'Accès refusé' });
  if (!req.file)
    return res.status(400).json({ error: 'Fichier requis' });

  const updated = store.updateExpeditionBon(exp.id, req.file.filename);
  res.json(updated);
});

module.exports = router;
