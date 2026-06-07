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

// POST /api/vote-skip
describe('POST /api/vote-skip', () => {
    let salon_id;
    let user_id;
    let queue_id;

    beforeEach(async () => {
        const salon = await pool.query(
            `INSERT INTO salon (code, status) VALUES ($1, 'En attente') RETURNING *`,
            ['TEST01']
        );
        salon_id = salon.rows[0].id;

        const user = await pool.query(
            `INSERT INTO utilisateur (salon_id, pseudo, role)
        VALUES ($1, $2, $3) RETURNING *`,
            [salon_id, 'pseudo', 'Invité']
        );
        user_id = user.rows[0].id;

        const song = await pool.query(
            `INSERT INTO song (titre, artiste, genre, duree, annee) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            ['Run the world (Girls)', 'Beyoncé', 'Pop', 260, 2011]
        );
        song_id = song.rows[0].id;

        const queue = await pool.query(
            `INSERT INTO queue (salon_id, user_id, song_id, position, status)
        VALUES ($1, $2, $3, $4, 'En attente') RETURNING *`,
            [salon_id, user_id, song_id, 3]
        );
        queue_id = queue.rows[0].id;
    });
    test(`Passer un morceau de la file d'attente`, async () => {
        const res = await request(app)
            .post('/api/vote-skip')
            .send({ salon_id: salon_id, queue_id: queue_id, user_id: user_id })

        expect(res.statusCode).toBe(201)
        expect(res.body.salon_id).toBe(salon_id)
        expect(res.body.user_id).toBe(user_id)
        expect(res.body.queue_id).toBe(queue_id)
        expect(res.body.id).toBeDefined()
    })

    test('Retourne erreur 400 si salon_id est manquant', async () => {
        const res = await request(app).post('/api/users')
            .send({ queue_id: queue_id, user_id: user_id })

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    })

    test('Retourne erreur 400 si queue_id est manquant', async () => {
        const res = await request(app).post('/api/users')
            .send({ salon_id: salon_id, user_id: user_id })

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    })

    test('Retourne erreur 400 si user_id est manquant', async () => {
        const res = await request(app).post('/api/users')
            .send({ salon_id: salon_id, queue_id: queue_id })

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    })
})

// GET /vote-skip/:queue_id
describe('GET /api/vote-skip/:queue_id', () => {
    test(`Retourne les morceaux voté "skip"`, async () => {
        const salon = await request(app).post('/api/salons')
        const salon_id = salon.body.id
        const user = await request(app).post('/api/users')
            .send({ salon_id, pseudo: 'Test', role: 'Invité' })
        const user_id = user.body.id
        const song = await request(app).post('/api/songs')
            .send({
                titre: 'Run the world (Girls)',
                artiste: 'Beyoncé',
                genre: 'Pop',
                duree: 260,
                annee: 2011
            })
        const song_id = song.body.id
        const queue = await request(app).post('/api/queues')
            .send({ salon_id, user_id, song_id, position: 3 })
        const queue_id = queue.body.id
        await request(app)
            .post('/api/vote-skip')
            .send({ salon_id, queue_id, user_id })
        const res = await request(app).get(`/api/vote-skip/${queue_id}`)

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    test('Retourne erreur 404 si aucun morceau voté "skip"', async () => {
        const res = await request(app).get('/api/vote-skip/999')
        expect(res.statusCode).toBe(404)
        expect(res.body.error).toBe(`Aucun morceau n'a été voté pour être ignoré dans la file d'attente pour ce salon.`)
    })
})
