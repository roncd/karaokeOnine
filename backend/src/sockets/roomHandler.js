function registerRoomHandlers(io, socket) {

  socket.on("join-room", (roomCode) => {

    socket.join(roomCode);

    console.log(
      `${socket.id} a rejoint la room ${roomCode}`
    );

    io.to(roomCode).emit("user-joined", {
      userId: socket.id
    });
  });

}

module.exports = registerRoomHandlers;