// Connexion database
require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
 connectionString: process.env.DB_URL,
})

// Test la connexion 
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur connexion PostgreSQL:', err.message)
  } else {
    console.log('Connexion à la base de donnée réussi.')
    release()
  }
})

module.exports = pool