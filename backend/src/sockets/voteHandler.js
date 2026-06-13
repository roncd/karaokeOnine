const {
  roomVotes,
  roomQueues,
  roomSongIds,
  roomSingers,
} = require('../services/roomState');
const pool = require('../db/db');
const { socketToUserId } = require('./userMap');

function registerVoteHandlers(io, socket) {

  socket.on("vote-skip", async ({ roomCode }) => {

    if (!roomVotes[roomCode]) {
      roomVotes[roomCode] = 0;
    }
    roomVotes[roomCode]++;
    console.log(`Vote skip dans ${roomCode} : ${roomVotes[roomCode]}`);
    io.to(roomCode).emit("skip-updated", { votes: roomVotes[roomCode] });

    if (roomVotes[roomCode] >= 2) {
      if (roomQueues[roomCode]?.length > 0) {
        const songId = roomSongIds[roomCode]?.[0];
        const skippedSong = roomQueues[roomCode].shift();

        if (songId) {
          try {
            const userId = socketToUserId[socket.id];
            console.log("SKIP:", socket.id, "→ user_id:", socketToUserId[socket.id]); await pool.query(
              `INSERT INTO queue (salon_id, user_id, song_id, position, status)
            VALUES ($1, $2, $3, $4, 'Skippé')
            ON CONFLICT DO NOTHING`,
              [roomCode, userId, songId, 1]
            );
          }
          catch (err) {
            console.error('Erreur persistance skip:', err.message);
          }
        }
        // Nettoyer aussi songIds et singers
        if (roomSongIds[roomCode]?.length > 0) roomSongIds[roomCode].shift();
        if (roomSingers[roomCode]?.length > 0) roomSingers[roomCode].shift();

        io.to(roomCode).emit("song-skipped", { skippedSong });
        io.to(roomCode).emit("queue-updated", roomQueues[roomCode]);
      }

      roomVotes[roomCode] = 0;
    }
  });

}

module.exports = registerVoteHandlers;