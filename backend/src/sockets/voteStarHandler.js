/**
 * voteStarHandler.js
 * Gère le vote pour la star de la session
 */

const { socketToUserId } = require('./userMap');
const { roomParticipants } = require('../services/roomState');

const roomVotesStar = {};

function registerVoteStarHandlers(io, socket) {

  // Enregistrer le participant dans la room
  socket.on('join-room', ({ roomCode, pseudo, avatarIndex, userId }) => {

    if (!roomParticipants[roomCode]) {
      roomParticipants[roomCode] = [];
    }

    const exists = roomParticipants[roomCode].some(p => p.id === userId);
    if (!exists) {
      roomParticipants[roomCode].push({
        id: userId,   
        pseudo,
        avatarIndex,
      });
    }
  });

  // Envoyer la liste des participants
  socket.on('get-participants', ({ roomCode }) => {
    const participants = roomParticipants[roomCode] || [];
    socket.emit('participants-list', { participants });
  });

  // Recevoir un vote
  socket.on('vote-star', ({ roomCode, votedFor }) => {

    const userId = socketToUserId[socket.id]; // ✔ ID BDD

    if (!roomVotesStar[roomCode]) {
      roomVotesStar[roomCode] = {};
    }

    roomVotesStar[roomCode][userId] = votedFor; // ✔ ID BDD

    console.log(`Vote star dans ${roomCode} : ${userId} vote pour ${votedFor}`);

    const totalParticipants = (roomParticipants[roomCode] || []).length;
    const totalVotes = Object.keys(roomVotesStar[roomCode]).length;

    if (totalVotes >= totalParticipants) {
      const votes = roomVotesStar[roomCode];

      const count = {};
      for (const votedFor of Object.values(votes)) {
        count[votedFor] = (count[votedFor] || 0) + 1;
      }

      const winnerId = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];

      const winnerParticipant = roomParticipants[roomCode]?.find(p => p.id == winnerId);

      io.to(roomCode).emit('vote-result', {
        winnerId,
        votes: count[winnerId],
        winnerPseudo: winnerParticipant?.pseudo ?? 'Anonyme',
        winnerAvatarIndex: winnerParticipant?.avatarIndex ?? 0,
      });

      delete roomVotesStar[roomCode];
    }
  });
}

module.exports = registerVoteStarHandlers;
