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

// POST /api/queues
describe('POST /api/queues', () => {
    let salon_id;
    let user_id;
    let song_id;

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
    });
    test(`Ajouter un morceau à la file d'attente`, async () => {
        const res = await request(app)
            .post('/api/queues')
            .send({ salon_id: salon_id, user_id: user_id, song_id: song_id, position: 3 })

        expect(res.statusCode).toBe(201)
        expect(res.body.salon_id).toBe(salon_id)
        expect(res.body.user_id).toBe(user_id)
        expect(res.body.song_id).toBe(song_id)
        expect(res.body.position).toBe(3)
        expect(res.body.status).toBe('En attente')
        expect(res.body.id).toBeDefined()
    })

    test('Retourne erreur 400 si salon_id est manquant', async () => {
        const res = await request(app).post('/api/queues')
            .send({ user_id: user_id, song_id: song_id, "position": 3 })

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    })

    test('Retourne erreur 400 si user_id est manquant', async () => {
        const res = await request(app).post('/api/queues')
            .send({ salon_id: salon_id, song_id: song_id, "position": 3 })

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    })

    test('Retourne erreur 400 si song_id est manquant', async () => {
        const res = await request(app).post('/api/queues')
            .send({ salon_id: salon_id, user_id: user_id, "position": 3 })

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    })

    test('Retourne erreur 400 si position est manquant', async () => {
        const res = await request(app).post('/api/queues')
            .send({ salon_id: salon_id, user_id: user_id, song_id: song_id })

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    })


})

// GET /queues/:salon_id
describe('GET /api/queues/:salon_id', () => {
    test(`Retourne la file d'attente d'un salon`, async () => {
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
        await request(app)
            .post('/api/queues')
            .send({ salon_id, user_id, song_id, position: 3, status: 'En attente' })

        const res = await request(app).get(`/api/queues/${salon_id}`)

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body[0].position).toBe(3)
    })

    test('Retourne erreur 404 si aucun morceau trouvé dans le salon', async () => {
        const res = await request(app).get('/api/queues/999')
        expect(res.statusCode).toBe(404)
        expect(res.body.error).toBe(`Aucun morceau dans la file d'attente pour ce salon.`)
    })
})
