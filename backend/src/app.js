require('dotenv').config()
const express = require('express');
const cors= require('cors');

const salonRoutes = require('./routes/salon');
const userRoutes = require('./routes/user');
const songRoutes = require('./routes/song');
const queueRoutes = require('./routes/queue');
const voteSkipRoutes = require('./routes/vote-skip');
const tokenRoutes = require('./routes/token');

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
app.use('/api/vote-skip', voteSkipRoutes);
app.use('/api/token', tokenRoutes);

module.exports = app;