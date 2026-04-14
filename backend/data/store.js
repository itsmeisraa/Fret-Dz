// data/store.js — In-memory database (replace with Supabase/PostgreSQL in production)
const { v4: uuid } = require('uuid');

// ── TABLE B : Camionneurs ────────────────────────────────────────────────────
const camionneurs = [
  { id: 'c1', name: 'Karim Bensalem',  phone: '0770 112 233', dep: 'Alger',      arr: 'Oran',       type: 'Camion 10T',    cap: 10000, tarif: 18.5, avail: true  },
  { id: 'c2', name: 'Mourad Khaldi',   phone: '0550 445 566', dep: 'Oran',       arr: 'Alger',      type: 'Camion 3T',     cap: 3000,  tarif: 14,   avail: true  },
  { id: 'c3', name: 'Yacine Amrani',   phone: '0660 778 899', dep: 'Alger',      arr: 'Constantine',type: 'Semi-remorque', cap: 25000, tarif: 22,   avail: true  },
  { id: 'c4', name: 'Bilal Hamdi',     phone: '0770 321 654', dep: 'Constantine',arr: 'Alger',      type: 'Camionnette',   cap: 1200,  tarif: 10.5, avail: false },
  { id: 'c5', name: 'Sofiane Bouzid',  phone: '0555 987 123', dep: 'Sétif',      arr: 'Alger',      type: 'Camion 3T',     cap: 3000,  tarif: 13,   avail: true  },
  { id: 'c6', name: 'Rachid Mebarki',  phone: '0660 456 789', dep: 'Alger',      arr: 'Annaba',     type: 'Camion 10T',    cap: 10000, tarif: 19,   avail: true  },
  { id: 'c7', name: 'Hamza Ouali',     phone: '0770 654 321', dep: 'Blida',      arr: 'Oran',       type: 'Camionnette',   cap: 1000,  tarif: 9.5,  avail: true  },
  { id: 'c8', name: 'Djamel Zerrouki', phone: '0550 111 222', dep: 'Alger',      arr: 'Béjaïa',     type: 'Camion 3T',     cap: 3000,  tarif: 15,   avail: true  },
];

// ── TABLE A : Users (commerçants) ────────────────────────────────────────────
const users = [
  {
    id: 'u1',
    name: 'Commerçant Demo',
    company: 'SARL Demo Import',
    email: 'demo@fretdz.dz',
    password: 'demo123',
    phone: '0770 000 001',
    wilaya: 'Alger',
  },
];

// ── TABLE C : Expéditions (interactions A↔B) ─────────────────────────────────
let expeditions = [
  { id: 'e1', userId: 'u1', camId: 'c1', dep: 'Zone industrielle Rouiba, Alger',    arr: "Port d'Oran, Oran",          kg: 4500,  desc: 'Matériaux de construction',     statut: 'en_transit', date: '2026-04-10', bon: null },
  { id: 'e2', userId: 'u1', camId: 'c3', dep: 'Entrepôt Dar El Beida, Alger',        arr: 'Marché Couvert, Constantine', kg: 12000, desc: 'Équipements électroménagers',    statut: 'livre',      date: '2026-04-05', bon: 'bon_e2.pdf' },
  { id: 'e3', userId: 'u1', camId: 'c5', dep: 'Zone activité Sétif',                 arr: 'Alger centre',                kg: 800,   desc: 'Pièces automobiles',             statut: 'en_attente', date: '2026-04-12', bon: null },
];

module.exports = {
  // ── users ──
  findUserByEmail: (email) => users.find((u) => u.email === email),
  findUserById:    (id)    => users.find((u) => u.id === id),
  createUser: ({ name, company, email, password, phone, wilaya }) => {
    const user = { id: uuid(), name, company, email, password, phone, wilaya };
    users.push(user);
    return user;
  },

  // ── camionneurs ──
  getAllCamionneurs: ()   => camionneurs,
  getCamionneurById: (id) => camionneurs.find((c) => c.id === id),

  // ── expeditions ──
  getExpeditionsByUser: (userId) => expeditions.filter((e) => e.userId === userId),
  getExpeditionById:    (id)     => expeditions.find((e) => e.id === id),
  createExpedition: (data) => {
    const exp = { id: 'e' + uuid().slice(0, 8), ...data, statut: 'en_attente' };
    expeditions.unshift(exp);
    return exp;
  },
  updateExpeditionBon: (id, bon) => {
    const exp = expeditions.find((e) => e.id === id);
    if (exp) exp.bon = bon;
    return exp;
  },
};
