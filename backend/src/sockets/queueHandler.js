const { roomQueues, roomSongIds, roomSingers } = require('../services/roomState');
const pool = require('../db/db');

function registerQueueHandlers(io, socket) {
  socket.on("add-song", async (data) => {
    const { roomCode, songTitle, pseudo, avatarIndex, userId } = data;

    // Chercher la chanson en BDD
    const result = await pool.query(
      `SELECT id, titre, artiste, genre, duree FROM song WHERE titre ILIKE $1 LIMIT 1`,
      [songTitle]
    );

    if (result.rows.length === 0) {
      socket.emit('song-not-found');
      return;
    }

    const song = result.rows[0];

    if (!roomQueues[roomCode]) roomQueues[roomCode] = [];
    if (!roomSongIds[roomCode]) roomSongIds[roomCode] = [];
    if (!roomSingers[roomCode]) roomSingers[roomCode] = [];

    // Ajouter la chanson dans la file
    roomQueues[roomCode].push({
      id: song.id,
      titre: song.titre,
      artiste: song.artiste,
      genre: song.genre,
      duree: song.duree,
      pseudo,
      avatarIndex
    });

    // Ajouter l'id de la chanson
    roomSongIds[roomCode].push(song.id);

    // Ajouter le chanteur associé à cette chanson
    roomSingers[roomCode].push({
      userId,        // ✔ ID BDD
      pseudo,
      avatarIndex
    });

    console.log(`Ajout chanson ${song.titre} dans ${roomCode}`);

    socket.emit('song-added', { titre: song.titre });
    io.to(roomCode).emit('queue-updated', roomQueues[roomCode]);
  });

  socket.on('song-finished', ({ roomCode }) => {
    console.log('song-finished reçu pour room:', roomCode);

    // Retirer la chanson jouée
    if (roomQueues[roomCode]?.length > 0) {
      roomQueues[roomCode].shift();
      roomSongIds[roomCode]?.shift();
      roomSingers[roomCode]?.shift();
    }

    const remaining = roomQueues[roomCode]?.length ?? 0;

    // Mettre à jour la queue pour tout le monde
    io.to(roomCode).emit('queue-updated', roomQueues[roomCode] || []);

    // Répondre au client qui a fini
    socket.emit('song-finished-ack', { remaining });
  });


  socket.on('remove-song', ({ roomCode, index }) => {
    if (!roomQueues[roomCode]) return;
    roomQueues[roomCode].splice(index, 1);
    roomSongIds[roomCode]?.splice(index, 1);
    roomSingers[roomCode]?.splice(index, 1);
    io.to(roomCode).emit('queue-updated', roomQueues[roomCode]);
  });

  socket.on('move-song', ({ roomCode, from, to }) => {
    if (!roomQueues[roomCode]) return;

    const moveItem = (arr) => {
      if (!arr) return;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
    };

    moveItem(roomQueues[roomCode]);
    moveItem(roomSongIds[roomCode]);
    moveItem(roomSingers[roomCode]);

    io.to(roomCode).emit('queue-updated', roomQueues[roomCode]);
  });
}

module.exports = registerQueueHandlers;
