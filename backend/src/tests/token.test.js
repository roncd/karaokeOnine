const request = require('supertest');
const app = require('../app');
const pool = require('../db/db');

// Nettoie la DB avant chaque test
beforeEach(async () => {
    await pool.query('DELETE FROM queue')
    await pool.query('DELETE FROM song')
    await pool.query('DELETE FROM utilisateur')
    await pool.query('DELETE FROM salon')
    await pool.query('DELETE FROM vote_skip')
})

// Ferme la connexion après tous les tests
afterAll(async () => {
    await pool.end()
})

describe('POST /api/token', () => {

  let salonId;
  let userId;

  beforeEach(async () => {
    const salon = await pool.query(
      `INSERT INTO salon (code, status) VALUES ($1, 'En attente') RETURNING *`,
      ['TEST01']
    );
    salonId = salon.rows[0].id;

    const user = await pool.query(
      `INSERT INTO utilisateur (salon_id, pseudo, role) VALUES ($1, $2, $3) RETURNING *`,
      [salonId, 'TestUser', 'Invité']
    );
    userId = user.rows[0].id;
  });


  it('Génère un token valide pour un participant existant', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({ salon_id: salonId, user_id: userId });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('room');
    expect(res.body).toHaveProperty('livekit_url');
    expect(res.body.room).toBe(`salon-${salonId}`);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.token.length).toBeGreaterThan(0);
  });

  it('Retourne erreur 404 si le salon n\'existe pas', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({ salon_id: 99999, user_id: userId });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Salon introuvable');
  });

  it('Retourner 404 si le participant n\'existe pas', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({ salon_id: salonId, user_id: 99999 });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Participant introuvable');
  });

  it('Retourner 400 si salon_id est manquant', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({ user_id: userId });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('Retourner 400 si user_id est manquant', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({ salon_id: salonId });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

});