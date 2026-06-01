const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// Géneration code aléatoire
const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
};

// POST /api/salons -> création salon
router.post('/', async (req, res) => {
  try {
    const code = generateCode();
    const result = await pool.query(
      `INSERT INTO salon (code, status) VALUES ($1, 'En attente') RETURNING *`,
      [code]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/salons/:code -> rejoindre salon
router.get('/:code', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM salon WHERE code = $1`,
      [req.params.code.toUpperCase()]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Salon introuvable' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;