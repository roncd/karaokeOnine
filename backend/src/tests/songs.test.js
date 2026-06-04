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

// /api/songs
describe('POST /api/songs', () => {
    test('Créer un morceau', async () => {
        const res = await request(app)
            .post('/api/songs')
            .send({ titre: 'Run the world (Girls)', artiste: 'Beyoncé', genre: 'Pop', duree: 260, annee: 2011 })

        expect(res.statusCode).toBe(201)
        expect(res.body.titre).toBe('Run the world (Girls)')
        expect(res.body.artiste).toBe('Beyoncé')
        expect(res.body.genre).toBe('Pop')
        expect(res.body.duree).toBe(260)
        expect(res.body.annee).toBe(2011)
        expect(res.body.id).toBeDefined()
    })
})

// GET /api/songs/
describe('GET /api/songs', () => {
    test(`Retourne tous les morceaux`, async () => {
        await request(app)
            .post('/api/songs')
            .send({ titre: 'Run the world (Girls)', artiste: 'Beyoncé', genre: 'Pop', duree: 260, annee: 2011 })
        const res = await request(app).get(`/api/songs`)

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(1)

    })

    test('Retourne un tableau vide si aucun morceaux trouvé', async () => {
        const res = await request(app).get('/api/songs')
        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBe(0)
    })
})

// GET /songs/search
describe('GET /api/songs/search', () => {
    test(`Retourne les morceaux correspondant à la recherche`, async () => {
        await request(app)
            .post('/api/songs')
            .send({ titre: 'Run the world (Girls)', artiste: 'Beyoncé', genre: 'Pop', duree: 260, annee: 2011 })
        const res = await request(app).get(`/api/songs/search?titre=run`)

        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBe(1)
    })

    test('Retourne erreur 404 si aucun morceau trouvé', async () => {
        const res = await request(app).get('/api/songs/search?titre=zozo')
        expect(res.statusCode).toBe(404)
        expect(res.body.error).toBe('Aucun morceau trouvé.')
    })
})

//  GET /api/songs/:id 
describe('GET /api/songs/:id', () => {
    test('Retourne 1 morceau spécifique', async () => {
        const created = await request(app).post(`/api/songs/`).send({ titre: 'Run the world (Girls)', artiste: 'Beyoncé', genre: 'Pop', duree: 260, annee: 2011 })
        const id = created.body.id
        const res = await request(app).get(`/api/songs/${id}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.id).toBe(id)
        expect(res.body.titre).toBe('Run the world (Girls)')
    })
    test('Retourne erreur 404 si aucun morceau trouvé', async () => {
        const res = await request(app).get('/api/songs/999')
        expect(res.statusCode).toBe(404)
        expect(res.body.error).toBe('Aucun morceau trouvé.')
    })
})
