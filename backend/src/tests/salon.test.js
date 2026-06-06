const request = require('supertest')
const app = require('../app')
const pool = require('../db/db')

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

// /api/salons
describe('POST /api/salons', () => {
  test('Créer un salon', async () => {
    const res = await request(app)
      .post('/api/salons')
      .send({})

    expect(res.statusCode).toBe(201)
    expect(res.body.code).toHaveLength(6)
    expect(res.body.status).toBe('En attente')
    expect(res.body.id).toBeDefined()
  })
})

// GET /salon/:code
describe('GET /api/salons/:code', () => {
  test('Retourne un salon correspondant au code', async () => {
    const created = await request(app).post('/api/salons')
    const code = created.body.code
    const res = await request(app).get(`/api/salons/${code}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.code).toBe(code)
  })

  test('Retourne erreur 404 si aucun salon trouvé', async () => {
    const res = await request(app).get('/api/salons/ABCDE1')
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Salon introuvable')
  })
})