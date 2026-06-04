const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// POST /api/songs -> création morceau
router.post('/', async (req, res) => {
  try {
    const { titre, artiste, genre, duree, annee } = req.body;
    const result = await pool.query(
      `INSERT INTO song (titre, artiste, genre, duree, annee) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
       [titre, artiste, genre, duree, annee]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET api/songs -> voir tous les morceaux 
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM song ORDER BY titre ASC'
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// GET /api/songs/search -> recherche morceau par titre/artiste/genre
router.get('/search', async (req, res) => {
    try {
        const { artiste, titre, genre } = req.query;
        if (!titre && !artiste && !genre) {
            const result = await pool.query(
                `SELECT * FROM song ORDER BY titre ASC`
            );
        }
        const result = await pool.query(
            `SELECT * FROM song 
      WHERE  ($1::text IS NULL OR titre ILIKE $1)
        AND ($2::text IS NULL OR artiste ILIKE $2)
        AND ($3::text IS NULL OR genre ILIKE $3)
        ORDER BY titre ASC`,
            [titre ? `%${titre}%` : null, artiste ? `%${artiste}%` : null, genre ? `%${genre}%` : null]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Aucun morceau trouvé.' });
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/songs/:id -> voir 1 morceau
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM song WHERE id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Aucun morceau trouvé.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
