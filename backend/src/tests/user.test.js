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

// POST /api/users
describe('POST /api/users', () => {
    let salon_id;

    beforeEach(async () => {
        const salon = await pool.query(
            `INSERT INTO salon (code, status) VALUES ($1, 'En attente') RETURNING *`,
            ['TEST01']
        );
        salon_id = salon.rows[0].id;
    });
    test('Créer un utilisateur dans un salon', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ salon_id: salon_id, "pseudo": 'test', "role": 'Invité' })

        expect(res.statusCode).toBe(201)
        expect(res.body.salon_id).toBe(salon_id)
        expect(res.body.pseudo).toBe('test')
        expect(res.body.role).toBe('Invité')
        expect(res.body.id).toBeDefined()
    })
    test(`Retourne 404 si le salon n'existe pas`, async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ salon_id: 999, pseudo: 'test', role: 'Invité' })

        expect(res.statusCode).toBe(404)
        expect(res.body.error).toBe('Salon introuvable')
    })

    test('Retourne erreur 400 si salon_id est manquant', async () => {
        const res = await request(app).post('/api/users')
            .send({ "pseudo": 'test', "role": 'Invité' })

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    })

    test('Retourne erreur 400 si pseudo est manquant', async () => {
        const res = await request(app).post('/api/users')
            .send({ salon_id: salon_id, "role": 'Invité' })

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    })

    test('Retourne erreur 400 si role est manquant', async () => {
        const res = await request(app).post('/api/users')
            .send({ salon_id: salon_id, "pseudo": 'test' })

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    })
})

// GET /users/:salon_id
describe('GET /api/users/:salon_id', () => {
    test(`Retourne les utilisateurs d'un salon`, async () => {
        const salon = await request(app).post('/api/salons')
        const salon_id = salon.body.id

        await request(app)
            .post('/api/users')
            .send({ salon_id, pseudo: 'test', role: 'Invité' })

        const res = await request(app).get(`/api/users/${salon_id}`)

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(1)
        expect(res.body[0].pseudo).toBe('test')
    })

    test('Retourne erreur 404 si aucun utilisateur trouvé', async () => {
        const res = await request(app).get('/api/users/999')
        expect(res.statusCode).toBe(404)
        expect(res.body.error).toBe('Aucun participant trouvé dans le salon.')
    })
})

// GET /users/
describe('GET /api/users', () => {
    test(`Retourne tous les utilisateurs`, async () => {
        const salon = await request(app).post('/api/salons')
        const salon_id = salon.body.id

        await request(app)
            .post('/api/users')
            .send({ salon_id, pseudo: 'test', role: 'Invité' })
        const res = await request(app).get(`/api/users`)

        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBe(1)
    })

    test('Retourne un tableau vide si aucun utilisateur trouvé', async () => {
        const res = await request(app).get('/api/users')
        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBe(0)
    })
})
