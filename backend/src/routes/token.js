const express = require('express');
const router = express.Router();
const { AccessToken } = require('livekit-server-sdk');
const pool = require('../db/db');

// POST /api/token -> générer un token LiveKit pour rejoindre un salon
router.post('/', async (req, res) => {
  try {
    const { salon_id, user_id } = req.body;
    
    // Vérif champs obligatoire
    if (!salon_id || !user_id) {
      return res.status(400).json({ error: 'salon_id et user_id sont obligatoires' });
    }

    // Vérifier que le salon existe
    const salon = await pool.query(
      'SELECT * FROM salon WHERE id = $1',
      [salon_id]
    );
    if (salon.rows.length === 0) {
      return res.status(404).json({ error: 'Salon introuvable' });
    }

    // Vérifier que le participant existe dans ce salon
    const participant = await pool.query(
      'SELECT * FROM utilisateur WHERE id = $1 AND salon_id = $2',
      [user_id, salon_id]
    );
    if (participant.rows.length === 0) {
      return res.status(404).json({ error: 'Participant introuvable' });
    }

    // Générer le token LiveKit
    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: `user-${user_id}`,
        name: participant.rows[0].pseudo
      }
    );

    token.addGrant({
      roomJoin: true,
      room: `salon-${salon_id}`,
      canPublish: true,       // peut envoyer son audio
      canSubscribe: true      // peut recevoir l'audio des autres
    });

    const jwt = await token.toJwt();

    res.json({
      token: jwt,
      room: `salon-${salon_id}`,
      livekit_url: process.env.LIVEKIT_URL
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;