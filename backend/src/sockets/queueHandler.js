const { roomQueues } = require('../services/roomState');

function registerQueueHandlers(io, socket) {

  socket.on("add-song", (data) => {

    const { roomCode, songTitle } = data;

    if (!roomQueues[roomCode]) {
      roomQueues[roomCode] = [];
    }

    roomQueues[roomCode].push(songTitle);

    console.log(
      `Ajout chanson ${songTitle} dans ${roomCode}`
    );

    io.to(roomCode).emit(
      "queue-updated",
      roomQueues[roomCode]
    );
  });

}

module.exports = registerQueueHandlers;