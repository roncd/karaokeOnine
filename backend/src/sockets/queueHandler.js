const { roomQueues, roomSongIds, roomSingers } = require('../services/roomState');
const pool = require('../db/db');

function registerQueueHandlers(io, socket) {

  socket.on("add-song", async (data) => {
    const { roomCode, songTitle } = data;

    // Chercher la chanson en BDD
    const result = await pool.query(
      `SELECT id, titre FROM song WHERE titre ILIKE $1 LIMIT 1`,
      [songTitle]
    );

    if (result.rows.length === 0) {
      socket.emit('song-not-found');
      return;
    }

    const song = result.rows[0];

    if (!roomQueues[roomCode])  roomQueues[roomCode]  = [];
    if (!roomSongIds[roomCode]) roomSongIds[roomCode] = [];
    if (!roomSingers[roomCode]) roomSingers[roomCode] = [];

    roomQueues[roomCode].push(song.titre);
    roomSongIds[roomCode].push(song.id);
    roomSingers[roomCode].push(socket.id);

    console.log(`Ajout chanson ${song.titre} dans ${roomCode}`);

    io.to(roomCode).emit('queue-updated', roomQueues[roomCode]);
  });

}

module.exports = registerQueueHandlers;