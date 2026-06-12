/**
 * readyHandler.js
 * Gère le compte à rebours avant de chanter
 * - Si le chanteur clique "Prêt ?" → annule le timer, notifie tout le monde
 * - Si le timer expire sans réponse → skip automatique, notifie tout le monde
 */

const { roomQueues, roomSongIds, roomSingers } = require('../services/roomState');
const pool = require('../db/db');
// Stocke les timers actifs par room pour pouvoir les annuler
const roomTimers = {};
const { socketToUserId } = require('./userMap');

const {socketToUserId} = require('./roomHandler'); // Pour associer socket.id à userId dans la BDD

const COUNTDOWN_SECONDS = 10;

function registerReadyHandlers(io, socket) {

  // L'hôte démarre le compte à rebours pour le prochain chanteur
  socket.on('start-countdown', ({ roomCode }) => {

    // Annuler un timer existant si on en relance un
    if (roomTimers[roomCode]) {
      clearTimeout(roomTimers[roomCode]);
      delete roomTimers[roomCode];
    }

    const currentSong = roomQueues[roomCode]?.[0] ?? null;
    const songId = roomSongIds[roomCode]?.[0] ?? null;
    const singerId = roomSingers[roomCode]?.[0] ?? socket.id;
    // Notifier tout le monde que le compte à rebours commence
    io.to(roomCode).emit('countdown-started', {
      duration: COUNTDOWN_SECONDS,
      currentSong: currentSong?.titre ?? null,
      songId,
      singerId,
    });

    console.log(`Compte à rebours démarré dans ${roomCode} pour ${socket.id}`);

    // Timer de 10 secondes — skip automatique si pas de réponse
    roomTimers[roomCode] = setTimeout(() => {
      delete roomTimers[roomCode];

      console.log(`Temps écoulé dans ${roomCode} — tour skippé automatiquement`);

      // Retirer la chanson de la file
      if (roomQueues[roomCode]?.length > 0) {
        const skippedSong = roomQueues[roomCode].shift();
        if (roomSongIds[roomCode]?.length > 0) roomSongIds[roomCode].shift();
        if (roomSingers[roomCode]?.length > 0) roomSingers[roomCode].shift();
        io.to(roomCode).emit('queue-updated', roomQueues[roomCode]);
        io.to(roomCode).emit('turn-skipped', {
          reason: 'timeout',
          skippedSong,
          singerId: socket.id,
        });
      } else {
        io.to(roomCode).emit('turn-skipped', {
          reason: 'timeout',
          skippedSong: null,
          singerId: socket.id,
        });
      }

    }, COUNTDOWN_SECONDS * 1000);

  });

  // Le chanteur clique "Prêt ?" avant la fin du compte à rebours
  socket.on('player-ready', async ({ roomCode }) => {
    const userId = socketToUserId[socket.id];

    if (!userId) {
      console.warn("Erreur: userId introuvable pour socket", socket.id);
      return;
    }
    // Annuler le timer — le chanteur a répondu à temps
    if (roomTimers[roomCode]) {
      clearTimeout(roomTimers[roomCode]);
      delete roomTimers[roomCode];
    }

    const currentSong = roomQueues[roomCode]?.[0] ?? null;
    const songId = roomSongIds[roomCode]?.[0] ?? null;
    if (songId) {
      try {
        const userId = socketToUserId[socket.id];
        console.log("READY:", socket.id, "mapped to user_id:", socketToUserId[socket.id]);
        await pool.query(
          `INSERT INTO queue (salon_id, user_id, song_id, position, status)
       VALUES ($1, $2, $3, $4, 'En cours')
       ON CONFLICT DO NOTHING`,
          [roomCode, userId, songId, 1]
        );
      }
      catch (err) {
        console.error('Erreur persistance player ready (chanson en cours):', err.message);
      }

    }
    // Notifier tout le monde que le chanteur est prêt
    io.to(roomCode).emit('singer-ready', {
      singerId: socket.id,
      currentSong,
      songId,
    });

  });

  // Nettoyage si le chanteur se déconnecte pendant le compte à rebours
  socket.on('disconnect', () => {
    // On ne peut pas savoir dans quelle room était le socket sans stocker l'info
    // Pour l'instant on laisse le timer expirer naturellement
    console.log(`Socket ${socket.id} déconnecté`);
  });

}

module.exports = registerReadyHandlers;