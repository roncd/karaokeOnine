const { socketToUserId } = require('./userMap');
const { roomParticipants, roomSingers, roomQueues, roomSongIds, roomVotes, roomSkipVotes } = require('../services/roomState');

function registerRoomHandlers(io, socket) {

  socket.on("join-room", ({ roomCode, pseudo, avatarIndex, userId, isHost }) => {

    socketToUserId[socket.id] = userId;
    socket.roomCode = roomCode;

    const MAX_PLAYERS = 9;
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (room && room.size >= MAX_PLAYERS) {
      socket.emit('room-full');
      return;
    }

    socket.join(roomCode);
    console.log(`${socket.id} (${pseudo}) a rejoint la room ${roomCode}`);

    if (!roomParticipants[roomCode]) roomParticipants[roomCode] = [];

    const existing = roomParticipants[roomCode].findIndex(p => p.id === userId);
    const participant = { id: userId, pseudo, avatarIndex };

    if (existing >= 0) {
      roomParticipants[roomCode][existing] = participant;
    } else {
      roomParticipants[roomCode].push(participant);
    }

    io.to(roomCode).emit("user-joined", {
      userId,
      pseudo,
      avatarIndex,
      isHost: !!isHost,
    });
  });

  socket.on('get-participants', ({ roomCode }) => {
    const list = roomParticipants[roomCode] || [];
    socket.emit('participants-list', list);
  });

  socket.on('get-queue', ({ roomCode }) => {
    const queue = roomQueues[roomCode] || [];
    socket.emit('queue-updated', queue);
  });

  socket.on("send-reaction", ({ roomCode, type }) => {
    const userId = socketToUserId[socket.id];
    io.to(roomCode).emit("reaction-received", {
      type,
      userId,
    });
  });

  socket.on('vote-skip', ({ roomCode }) => {
    if (!roomParticipants[roomCode]) return;
    const totalParticipants = roomParticipants[roomCode].length;
    if (!roomSkipVotes[roomCode]) roomSkipVotes[roomCode] = new Set();
    roomSkipVotes[roomCode].add(socket.id);
    const totalVotes = roomSkipVotes[roomCode].size;
    io.to(roomCode).emit('skip-vote', { userId: socket.id, totalVotes, totalParticipants });
    if (totalVotes / totalParticipants >= 0.5) {
      roomSkipVotes[roomCode] = new Set();
    }
  });

  socket.on("disconnect", () => {
    const userId = socketToUserId[socket.id];
    const roomCode = socket.roomCode;

    if (roomCode) {
      if (roomParticipants[roomCode]) {
        roomParticipants[roomCode] = roomParticipants[roomCode].filter(
          p => p.id !== userId
        );
      }

      if (roomSingers[roomCode]) {
        roomSingers[roomCode] = roomSingers[roomCode].filter(
          s => s.userId !== userId
        );
      }

      const stillConnected = roomParticipants[roomCode]?.length || 0;
      if (stillConnected === 0) {
        delete roomParticipants[roomCode];
        delete roomQueues[roomCode];
        delete roomSongIds[roomCode];
        delete roomSingers[roomCode];
        delete roomVotes[roomCode];
        delete roomSkipVotes[roomCode];
      }
    }

    delete socketToUserId[socket.id];
  });
}

module.exports = registerRoomHandlers;