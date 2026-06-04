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
    test(`Ajouter un morceau à la file d'attente`, async () => {
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

        const res = await request(app)
            .post('/api/queues')
            .send({ salon_id, user_id, song_id, position: 3 })

        expect(res.statusCode).toBe(201)
        expect(res.body.salon_id).toBe(salon_id)
        expect(res.body.user_id).toBe(user_id)
        expect(res.body.song_id).toBe(song_id)
        expect(res.body.position).toBe(3)
        expect(res.body.status).toBe('En attente')
        expect(res.body.id).toBeDefined()
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
