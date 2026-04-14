// routes/auth.js
const express  = require('express');
const router   = express.Router();
const store    = require('../data/store');
const { makeToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email et mot de passe requis' });

  const user = store.findUserByEmail(email.trim().toLowerCase());
  if (!user || user.password !== password)
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  const { password: _pw, ...safeUser } = user;
  res.json({ token: makeToken(user.id), user: safeUser });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, company, email, password, phone, wilaya } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Nom, email et mot de passe requis' });

  const existing = store.findUserByEmail(email.trim().toLowerCase());
  if (existing)
    return res.status(409).json({ error: 'Email déjà utilisé' });

  const user = store.createUser({
    name,
    company: company || '',
    email: email.trim().toLowerCase(),
    password,
    phone:  phone  || '',
    wilaya: wilaya || '',
  });

  const { password: _pw, ...safeUser } = user;
  res.status(201).json({ token: makeToken(user.id), user: safeUser });
});

module.exports = router;
