require('dotenv').config()
require('./db/db'); 
const express = require('express');
const cors= require('cors');
const PORT = process.env.PORT || 3000
const salonRoutes = require('./routes/salon');
const userRoutes = require('./routes/user');
const songRoutes = require('./routes/song');
const queueRoutes = require('./routes/queue');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Ok', service: 'backend' });
});

// Routes
app.use('/api/salons', salonRoutes);
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/queues', queueRoutes);

app.listen(PORT, () => {
    console.log(`Le serveur a démarré sur le port: ${PORT}`)
});