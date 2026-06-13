/**
 * readyHandler.js
 */
const pickRandomSinger = require('../utils/pickRandomSinger');
const { roomQueues, roomSongIds, roomParticipants, roomSingers, roomVotes } = require('../services/roomState');
const pool = require('../db/db');
const { socketToUserId } = require('./userMap');

const roomTimers = {};
const roomCurrentSingers = {};
const COUNTDOWN_SECONDS = 10;

function registerReadyHandlers(io, socket) {
  // L'hôte démarre le compte à rebours pour le prochain chanteur
  socket.on('start-countdown', ({ roomCode }) => {
    const participants = roomParticipants[roomCode];
    const singer = pickRandomSinger(participants);


    if (!singer) {
      console.warn("Aucun participant dans la room", roomCode);
      return;
    }
    // Annuler un timer existant si on en relance un
    if (roomTimers[roomCode]) {
      clearTimeout(roomTimers[roomCode]);
      delete roomTimers[roomCode];
    }

    const currentSong = roomQueues[roomCode]?.[0] ?? null;
    const songId = roomSongIds[roomCode]?.[0] ?? null;
    const singerId = singer.id;
    roomCurrentSingers[roomCode] = singerId;

    // Notifier tout le monde que le compte à rebours commence
    io.to(roomCode).emit('singer-selected', {
      singerId,
      pseudo: singer.pseudo,
      avatarIndex: singer.avatarIndex,
    });

    io.to(roomCode).emit('countdown-started', {
      duration: COUNTDOWN_SECONDS,
      currentSong: currentSong?.titre ?? null,
      songId,
      singerId,
      singerPseudo: singer.pseudo,
      singerAvatarIndex: singer.avatarIndex,
    });

    console.log(`Compte à rebours démarré dans ${roomCode} pour ${socket.id}`);

    roomTimers[roomCode] = setTimeout(() => {
      delete roomTimers[roomCode];
      delete roomCurrentSingers[roomCode];
      console.log(`Temps écoulé dans ${roomCode} — tour skippé automatiquement`);

      let skippedSong = null;

      if (roomQueues[roomCode]?.length > 0) {
        skippedSong = roomQueues[roomCode].shift();
        if (roomSongIds[roomCode]?.length > 0) roomSongIds[roomCode].shift();
        if (roomSingers[roomCode]?.length > 0) roomSingers[roomCode].shift();
        io.to(roomCode).emit('queue-updated', roomQueues[roomCode]);
      }

      // Toujours émettre turn-skipped, peu importe l'état de la queue
      io.to(roomCode).emit('turn-skipped', {
        reason: 'timeout',
        skippedSong,
        singerId,
      });

      // Nettoyage si tout est vide
      if (roomQueues[roomCode]?.length === 0) {
        delete roomQueues[roomCode];
        delete roomSongIds[roomCode];
        delete roomSingers[roomCode];
        delete roomVotes[roomCode];
      }
    }, COUNTDOWN_SECONDS * 1000);
  });

  socket.on('player-ready', async ({ roomCode }) => {
    const userId = socketToUserId[socket.id];
    if (!userId) {
      console.warn('player-ready ignoré : utilisateur inconnu pour', socket.id);
      return;
    }

    const expectedSingerId = roomCurrentSingers[roomCode];
    if (expectedSingerId != null && String(expectedSingerId) !== String(userId)) {
      console.warn(`player-ready ignoré : ${userId} n'est pas le chanteur (${expectedSingerId})`);
      return;
    }

    if (roomTimers[roomCode]) {
      clearTimeout(roomTimers[roomCode]);
      delete roomTimers[roomCode];
    }

    delete roomCurrentSingers[roomCode];

    const queueItem = roomQueues[roomCode]?.[0] ?? null;
    const songId = roomSongIds[roomCode]?.[0] ?? queueItem?.id ?? null;
    const currentSongTitle = queueItem?.titre ?? null;

    // Persistance BDD (non bloquante)
    if (songId) {
      try {
        const salonRes = await pool.query(
          `SELECT id FROM salon WHERE code = $1`,
          [roomCode]
        );
        if (salonRes.rows.length > 0) {
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
      singerId: userId,
      currentSong: currentSongTitle,
      songId,
    });
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} déconnecté`);
  });

}

module.exports = registerReadyHandlers;