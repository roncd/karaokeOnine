function registerRoomHandlers(io, socket) {

  // Rejoindre une room
  socket.on("join-room", (roomCode) => {
    const MAX_PLAYERS = 10;
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (room && room.size >= MAX_PLAYERS) {
    socket.emit('room-full');
    return;
    }
    socket.join(roomCode);
    console.log(`${socket.id} a rejoint la room ${roomCode}`);
    io.to(roomCode).emit("user-joined", {
      userId: socket.id,
    });
  });

  // Envoyer une réaction
  socket.on("send-reaction", ({ roomCode, type }) => {
    io.to(roomCode).emit("reaction-received", {
      type,
      userId: socket.id,
    });
  });

}

module.exports = registerRoomHandlers;