// Connexion database
require('dotenv').config()
const { Pool } = require('pg')

const connectionString = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_URL
  : process.env.DB_URL;

const pool = new Pool({ connectionString });

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