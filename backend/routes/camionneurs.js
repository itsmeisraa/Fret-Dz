// routes/camionneurs.js — Table B (Ressources)
const express = require('express');
const router  = express.Router();
const store   = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

// GET /api/camionneurs — list all (authenticated)
router.get('/', authMiddleware, (req, res) => {
  const { type, search, avail } = req.query;
  let list = store.getAllCamionneurs();

  if (type   && type   !== 'Tous') list = list.filter((c) => c.type === type);
  if (avail  === 'true')           list = list.filter((c) => c.avail);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dep.toLowerCase().includes(q)  ||
        c.arr.toLowerCase().includes(q)
    );
  }
  res.json(list);
});

// GET /api/camionneurs/:id
router.get('/:id', authMiddleware, (req, res) => {
  const cam = store.getCamionneurById(req.params.id);
  if (!cam) return res.status(404).json({ error: 'Camionneur introuvable' });
  res.json(cam);
});

module.exports = router;
