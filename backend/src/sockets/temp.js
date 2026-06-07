/**
 * voteStarHandler.js
 * Gère le vote pour la star de la session
 */

// Stocke les votes par room : { roomCode: { userId: votedFor } }
const roomVotesStar = {};

// Stocke les participants par room
const roomParticipants = {};

function registerVoteStarHandlers(io, socket) {

  // Enregistrer le participant dans la room
  socket.on('join-room', (roomCode) => {
    if (!roomParticipants[roomCode]) {
      roomParticipants[roomCode] = [];
    }
    if (!roomParticipants[roomCode].includes(socket.id)) {
      roomParticipants[roomCode].push(socket.id);
    }
  });

  // Envoyer la liste des participants
  socket.on('get-participants', ({ roomCode }) => {
    const participants = roomParticipants[roomCode] || [];
    socket.emit('participants-list', { participants });
  });

  // Recevoir un vote
  socket.on('vote-star', ({ roomCode, votedFor }) => {
    if (!roomVotesStar[roomCode]) {
      roomVotesStar[roomCode] = {};
    }

    // Enregistrer le vote (un seul vote par personne)
    roomVotesStar[roomCode][socket.id] = votedFor;

    console.log(`Vote star dans ${roomCode} : ${socket.id} vote pour ${votedFor}`);

    const totalParticipants = (roomParticipants[roomCode] || []).length;
    const totalVotes        = Object.keys(roomVotesStar[roomCode]).length;

    // Quand tout le monde a voté → calculer le gagnant
    if (totalVotes >= totalParticipants) {
      const votes = roomVotesStar[roomCode];

      // Compter les votes par candidat
      const count = {};
      for (const votedFor of Object.values(votes)) {
        count[votedFor] = (count[votedFor] || 0) + 1;
      }

      // Trouver le gagnant
      const winnerId = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];

      console.log(`Star de la soirée dans ${roomCode} : ${winnerId} avec ${count[winnerId]} votes`);

      io.to(roomCode).emit('vote-result', {
        winnerId,
        votes: count[winnerId],
      });

      // Nettoyer
      delete roomVotesStar[roomCode];
    }
  });

}

module.exports = registerVoteStarHandlers;