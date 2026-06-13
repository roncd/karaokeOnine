const request = require('supertest');
const app = require('../app');
const pool = require('../db/db');

beforeEach(async () => {
  await pool.query('DELETE FROM vote_skip');
  await pool.query('DELETE FROM queue');
  await pool.query('DELETE FROM utilisateur');
  await pool.query('DELETE FROM salon');
  await pool.query('DELETE FROM song');
});

afterAll(async () => {
  await pool.end();
});

describe('GET /api/stats/home', () => {
  test('Retourne les stats avec le top des chansons', async () => {
    const salon = await pool.query(
      `INSERT INTO salon (code, status) VALUES ('ABC12345', 'En attente') RETURNING id`,
    );
    const user = await pool.query(
      `INSERT INTO utilisateur (salon_id, pseudo, role) VALUES ($1, 'Alice', 'Hôte') RETURNING id`,
      [salon.rows[0].id],
    );
    const songA = await pool.query(
      `INSERT INTO song (titre, artiste, genre, duree, annee)
       VALUES ('Bohemian Rhapsody', 'Queen', 'Rock', 354, 1975) RETURNING id`,
    );
    const songB = await pool.query(
      `INSERT INTO song (titre, artiste, genre, duree, annee)
       VALUES ('Imagine', 'John Lennon', 'Pop', 183, 1971) RETURNING id`,
    );

    await pool.query(
      `INSERT INTO queue (salon_id, user_id, song_id, position, status) VALUES
       ($1, $2, $3, 1, 'En cours'),
       ($1, $2, $3, 2, 'En attente'),
       ($1, $2, $4, 3, 'Skippé')`,
      [salon.rows[0].id, user.rows[0].id, songA.rows[0].id, songB.rows[0].id],
    );

    const res = await request(app).get('/api/stats/home');

    expect(res.statusCode).toBe(200);
    expect(res.body.topSongs).toHaveLength(2);
    expect(res.body.topSongs[0].titre).toBe('Bohemian Rhapsody');
    expect(res.body.topSongs[0].playCount).toBe(2);
    expect(res.body.totals.songs_played).toBe(2);
    expect(res.body.totals.salons).toBe(1);
    expect(res.body.totals.players).toBe(1);
  });

  test('Retourne des stats vides si aucune donnée', async () => {
    const res = await request(app).get('/api/stats/home');

    expect(res.statusCode).toBe(200);
    expect(res.body.topSongs).toEqual([]);
    expect(res.body.totals.songs_played).toBe(0);
  });
});
