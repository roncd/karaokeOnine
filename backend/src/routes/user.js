const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// POST /api/users -> création participant (rejoindre salon)
router.post('/', async (req, res) => {
  try {
    const { salon_id, pseudo, role } = req.body;
    // Vérification de l'existance du salon
    const salon = await pool.query('SELECT * FROM salon where id = $1', [salon_id]);
    if (salon.rows.length === 0){
        return res.status(404).json({ error: 'Salon introuvable'});
    }

    // Création du participant
    const result = await pool.query(
        `INSERT INTO utilisateur (salon_id, pseudo, role)
        VALUES ($1, $2, $3) RETURNING *`,
        [salon_id, pseudo, role || 'Invité']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505'){
        return res.status(409).json({ error: 'Ce pseudo est déjà utilisé dans le salon, veillez en choisir un autre.'})
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:salon_id -> lister participant d'un salon 
router.get('/:salon_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM utilisateur WHERE salon_id = $1 ORDER BY joined ASC`,
      [req.params.salon_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aucun participant trouvé dans le salon.' });
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET api/users -> voir tous les utilisateurs (debug)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM utilisateur ORDER BY joined DESC'
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

module.exports = router;