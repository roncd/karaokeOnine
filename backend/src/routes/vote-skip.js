const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// POST /api/vote-skip -> voter pour skipper la chanson en cours
router.post('/', async (req, res) => {
  try {
    const { salon_id, queue_id, user_id } = req.body;
    
    // Vérif champs obligatoire
    if (!salon_id || !queue_id || !user_id) {
      return res.status(400).json({ error: 'salon_id, queue_id et user_id sont obligatoires' });
    }

    const result = await pool.query(
        `INSERT INTO vote_skip (salon_id, queue_id, user_id)
        VALUES ($1, $2, $3) RETURNING *`,
        [salon_id, queue_id, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET  /api/vote-skip/:queue_id -> voir les votes pour une chanson
router.get('/:queue_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM vote_skip WHERE queue_id = $1`,
      [req.params.queue_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Aucun morceau n'a été voté pour être ignoré dans la file d'attente pour ce salon.` });
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
