// src/api.js — All HTTP calls to the backend
const BASE = '/api';

function getToken() {
  return localStorage.getItem('fret_token');
}

function headers(isMultipart = false) {
  const h = { Authorization: `Bearer ${getToken()}` };
  if (!isMultipart) h['Content-Type'] = 'application/json';
  return h;
}

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (email, password) =>
  fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handle);

export const register = (data) =>
  fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handle);

// ── Camionneurs ───────────────────────────────────────────────────────────────
export const getCamionneurs = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${BASE}/camionneurs${qs ? '?' + qs : ''}`, {
    headers: headers(),
  }).then(handle);
};

// ── Expeditions ───────────────────────────────────────────────────────────────
export const getExpeditions = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${BASE}/expeditions${qs ? '?' + qs : ''}`, {
    headers: headers(),
  }).then(handle);
};

export const createExpedition = (formData) =>
  fetch(`${BASE}/expeditions`, {
    method: 'POST',
    headers: headers(true), // multipart — no Content-Type, browser sets boundary
    body: formData,
  }).then(handle);

export const uploadBon = (expId, file) => {
  const fd = new FormData();
  fd.append('bon', file);
  return fetch(`${BASE}/expeditions/${expId}/bon`, {
    method: 'POST',
    headers: headers(true),
    body: fd,
  }).then(handle);
};
