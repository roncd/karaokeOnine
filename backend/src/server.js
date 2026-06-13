require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const registerRoomHandlers = require('./sockets/roomHandler');
const registerQueueHandlers = require('./sockets/queueHandler');
const registerVoteHandlers = require('./sockets/voteHandler');
const registerReadyHandlers = require('./sockets/readyHandler');
const registerVoteStarHandlers = require('./sockets/voteStarHandler');
const PORT = process.env.PORT || 3000;

// Créer le serveur HTTP à partir de l'app Express
const httpServer = http.createServer(app);

// Attacher Socket.io au serveur HTTP
const io = new Server(httpServer, {
  cors: {
    origin: '*', // à restreindre en production
    methods: ['GET', 'POST'],
  },
});

// Enregistrer les handlers socket
io.on('connection', (socket) => {
  console.log(`Nouvel utilisateur connecté : ${socket.id}`);

  registerRoomHandlers(io, socket);
  registerQueueHandlers(io, socket);
  registerVoteHandlers(io, socket);
  registerReadyHandlers(io, socket);
  registerVoteStarHandlers(io, socket);
  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté : ${socket.id}`);
  });
});

// export pour les tests
module.exports = { httpServer, io };

// Démarrer le serveur
if (require.main === module) {
  const { runMigrations } = require('./db/migrate');

  runMigrations()
    .catch((err) => {
      console.warn('Migration BDD (non bloquante):', err.message);
    })
    .finally(() => {
      httpServer.listen(PORT, () => {
        console.log(`Le serveur a démarré sur le port: ${PORT}`);
      });
    });
}