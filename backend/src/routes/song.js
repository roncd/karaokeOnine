const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const path = require('path');
const fs = require('fs');

// POST /api/songs -> création morceau
router.post('/', async (req, res) => {
  try {
    const { titre, artiste, genre, duree, annee } = req.body;
    
    // Vérif champs obligatoire
    if (!titre || !artiste || !genre || !duree || !annee) {
      return res.status(400).json({ error: 'titre, artiste, genre, duree et annee sont obligatoires' });
    }

    const result = await pool.query(
      `INSERT INTO song (titre, artiste, genre, duree, annee) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
       [titre, artiste, genre, duree, annee]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/songs -> voir tous les morceaux
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM song ORDER BY titre ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/songs/search -> recherche morceau par titre/artiste/genre
router.get('/search', async (req, res) => {
  try {
    const { artiste, titre, genre } = req.query;
    const result = await pool.query(
      `SELECT * FROM song 
       WHERE ($1::text IS NULL OR titre ILIKE $1)
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

// GET /api/songs/:id/audio -> stream le fichier audio
router.get('/:id/audio', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT audio_path FROM song WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chanson introuvable.' });
    }

    const filePath = path.join(__dirname, '../../', result.rows[0].audio_path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier audio introuvable.' });
    }

    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/songs/:id/lyrics -> retourne le contenu du fichier .lrc
router.get('/:id/lyrics', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT lyrics_path FROM song WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chanson introuvable.' });
    }

    const filePath = path.join(__dirname, '../../', result.rows[0].lyrics_path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier paroles introuvable.' });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ lyrics: content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
