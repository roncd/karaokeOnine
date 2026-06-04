const {
  roomVotes,
  roomQueues
} = require('../services/roomState');

function registerVoteHandlers(io, socket) {

  socket.on("vote-skip", ({ roomCode }) => {

    if (!roomVotes[roomCode]) {
      roomVotes[roomCode] = 0;
    }

    roomVotes[roomCode]++;

    console.log(
      `Vote skip dans ${roomCode} : ${roomVotes[roomCode]}`
    );

    io.to(roomCode).emit(
      "skip-updated",
      {
        votes: roomVotes[roomCode]
      }
    );

    if (roomVotes[roomCode] >= 2) {

      if (
  roomQueues[roomCode] &&
  roomQueues[roomCode].length > 0
) {

  const skippedSong =
    roomQueues[roomCode].shift();

  io.to(roomCode).emit(
    "song-skipped",
    {
      skippedSong
    }
  );

  io.to(roomCode).emit(
    "queue-updated",
    roomQueues[roomCode]
  );
}

roomVotes[roomCode] = 0;
    }
  });

}

module.exports = registerVoteHandlers;