const express = require('express');
const pool = require('../db/db');

const router = express.Router();

// GET /api/stats/home -> statistiques affichées sur la page d'accueil
router.get('/home', async (req, res) => {
  try {
    const [topSongsResult, totalsResult] = await Promise.all([
      pool.query(
        `SELECT
          s.titre,
          s.artiste,
          s.genre,
          COUNT(q.id)::int AS play_count
        FROM queue q
        JOIN song s ON s.id = q.song_id
        WHERE q.status != 'Skippé'
        GROUP BY s.id, s.titre, s.artiste, s.genre
        ORDER BY play_count DESC, s.titre ASC
        LIMIT 5`,
      ),
      pool.query(
        `SELECT
          (SELECT COUNT(*)::int FROM queue WHERE status != 'Skippé') AS songs_played,
          (SELECT COUNT(*)::int FROM salon) AS salons,
          (SELECT COUNT(*)::int FROM utilisateur) AS players`,
      ),
    ]);

    res.json({
      topSongs: topSongsResult.rows.map((row) => ({
        titre: row.titre,
        artiste: row.artiste,
        genre: row.genre,
        playCount: row.play_count,
      })),
      totals: totalsResult.rows[0] || {
        songs_played: 0,
        salons: 0,
        players: 0,
      },
    });
  } catch (err) {
    console.error('Erreur stats home :', err.message);
    res.status(500).json({ error: 'Impossible de charger les statistiques.' });
  }
});

module.exports = router;
