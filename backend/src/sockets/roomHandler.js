const { roomParticipants } = require('../services/roomState');
const { socketToUserId }   = require('./userMap');

function registerRoomHandlers(io, socket) {

  socket.on("join-room", ({ roomCode, pseudo, avatarIndex, userId, isHost }) => {
    if (userId) socketToUserId[socket.id] = userId;

    const MAX_PLAYERS = 9;
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (room && room.size >= MAX_PLAYERS) {
      socket.emit('room-full');
      return;
    }
    socket.join(roomCode);

    if (!roomParticipants[roomCode]) roomParticipants[roomCode] = [];
    const existing = roomParticipants[roomCode].findIndex(p => p.userId === socket.id);
    const participant = {
      userId: socket.id,
      pseudo: pseudo || 'Anonyme',
      avatarIndex: avatarIndex ?? 0,
      isHost: !!isHost,
    };
    if (existing >= 0) {
      roomParticipants[roomCode][existing] = participant;
    } else {
      roomParticipants[roomCode].push(participant);
    }

    console.log(`${socket.id} (${pseudo || 'Anonyme'}) a rejoint la room ${roomCode}`);

    io.to(roomCode).emit("user-joined", {
      userId: socket.id,
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
    const { roomQueues } = require('../services/roomState');
    const queue = roomQueues[roomCode] || [];
    socket.emit('queue-updated', queue);
  });

  socket.on("send-reaction", ({ roomCode, type }) => {
    io.to(roomCode).emit("reaction-received", { type, userId: socket.id });
  });

  socket.on('vote-skip', ({ roomCode }) => {
    if (!roomParticipants[roomCode]) return;
    const totalParticipants = roomParticipants[roomCode].length;
    const { roomSkipVotes } = require('../services/roomState');
    if (!roomSkipVotes[roomCode]) roomSkipVotes[roomCode] = new Set();
    roomSkipVotes[roomCode].add(socket.id);
    const totalVotes = roomSkipVotes[roomCode].size;
    io.to(roomCode).emit('skip-vote', { userId: socket.id, totalVotes, totalParticipants });
    if (totalVotes / totalParticipants >= 0.5) {
      roomSkipVotes[roomCode] = new Set();
    }
  });

  socket.on('disconnect', () => {
    delete socketToUserId[socket.id];
  });

  socket.on('disconnecting', () => {
    for (const roomCode of socket.rooms) {
      if (roomCode === socket.id) continue;
      if (roomParticipants[roomCode]) {
        roomParticipants[roomCode] = roomParticipants[roomCode].filter(
          p => p.userId !== socket.id
        );
      }
      socket.to(roomCode).emit('user-left', { userId: socket.id });
    }
  });
}

module.exports = registerRoomHandlers;