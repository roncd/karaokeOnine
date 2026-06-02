const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// POST /api/queues -> ajout d'une chanson à la file
router.post('/', async (req, res) => {
  try {
    const { salon_id, user_id, song_id, position } = req.body;
    const result = await pool.query(
        `INSERT INTO queue (salon_id, user_id, song_id, position)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [salon_id, user_id, song_id, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/queue/:salon_id -> file d'attente d'un salon
router.get('/:salon_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM queue WHERE salon_id = $1 ORDER BY position ASC`,
      [req.params.salon_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Aucun morceau dans la file d'attente pour ce salon.` });
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH api/queue/:id/position : supprimer 1 chanson de la file d'attente
router.patch('/:id/position', async (req, res) => {
    const { id } = req.params
    const {position} = req.body;    
    try {
        await pool.query('UPDATE queue SET position = $1 WHERE id = $2', [position, id])
        res.json({ message: `Le morceau ${id} a changé de position.` })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})


// DELETE api/queue/:id : supprimer 1 chanson de la file d'attente
router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        await pool.query('DELETE FROM queue WHERE id = $1', [id])
        res.json({ message: `Le morceau ${id} a été supprimé de la file d'attente.` })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

module.exports = router;