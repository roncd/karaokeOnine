/**
 * readyHandler.js
 */

const { roomQueues, roomSongIds, roomSingers } = require('../services/roomState');
const pool = require('../db/db');
const { socketToUserId } = require('./userMap');

const roomTimers = {};
const COUNTDOWN_SECONDS = 10;

function registerReadyHandlers(io, socket) {

  socket.on('start-countdown', ({ roomCode }) => {
    if (roomTimers[roomCode]) {
      clearTimeout(roomTimers[roomCode]);
      delete roomTimers[roomCode];
    }

    const currentSong = roomQueues[roomCode]?.[0] ?? null;
    const songId      = roomSongIds[roomCode]?.[0] ?? null;
    const singerId    = roomSingers[roomCode]?.[0] ?? socket.id;

    io.to(roomCode).emit('countdown-started', {
      duration: COUNTDOWN_SECONDS,
      currentSong: currentSong?.titre ?? null,
      songId,
      singerId,
    });

    console.log(`Compte à rebours démarré dans ${roomCode} pour ${socket.id}`);

    roomTimers[roomCode] = setTimeout(() => {
      delete roomTimers[roomCode];
      console.log(`Temps écoulé dans ${roomCode} — tour skippé automatiquement`);

      if (roomQueues[roomCode]?.length > 0) {
        const skippedSong = roomQueues[roomCode].shift();
        if (roomSongIds[roomCode]?.length > 0) roomSongIds[roomCode].shift();
        if (roomSingers[roomCode]?.length > 0) roomSingers[roomCode].shift();
        io.to(roomCode).emit('queue-updated', roomQueues[roomCode]);
        io.to(roomCode).emit('turn-skipped', { reason: 'timeout', skippedSong, singerId: socket.id });
      } else {
        io.to(roomCode).emit('turn-skipped', { reason: 'timeout', skippedSong: null, singerId: socket.id });
      }
    }, COUNTDOWN_SECONDS * 1000);
  });

  socket.on('player-ready', async ({ roomCode }) => {
    if (roomTimers[roomCode]) {
      clearTimeout(roomTimers[roomCode]);
      delete roomTimers[roomCode];
    }

    const currentSong = roomQueues[roomCode]?.[0] ?? null;
    const songId      = roomSongIds[roomCode]?.[0] ?? null;

    // Persistance BDD (non bloquante)
    if (songId) {
      try {
        const userId = socketToUserId[socket.id];
        const salonRes = await pool.query(
          `SELECT id FROM salon WHERE code = $1`,
          [roomCode]
        );
        if (salonRes.rows.length > 0 && userId) {
          const salonId = salonRes.rows[0].id;
          await pool.query(
            `INSERT INTO queue (salon_id, user_id, song_id, position, status)
             VALUES ($1, $2, $3, $4, 'En cours')
             ON CONFLICT DO NOTHING`,
            [salonId, userId, songId, 1]
          );
        }
      } catch (err) {
        console.warn('Erreur persistance player ready (non bloquante):', err.message);
      }
    }

    io.to(roomCode).emit('singer-ready', {
      singerId: socket.id,
      currentSong,
      songId,
    });
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} déconnecté`);
  });

}

module.exports = registerReadyHandlers;