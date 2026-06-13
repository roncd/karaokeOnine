// const roomQueues  = {};
// const roomVotes   = {};
// const roomSongIds = {};
// const roomSingers = {};

// module.exports = {
//   roomQueues,
//   roomVotes,
//   roomSongIds,
//   roomSingers,
// };

const roomQueues       = {};
const roomVotes        = {};
const roomSongIds      = {};
const roomSingers      = {};
const roomParticipants = {}; // { [roomCode]: [{ userId, pseudo, avatarIndex, isHost }] }
const roomSkipVotes    = {}; // { [roomCode]: Set<socketId> }

module.exports = {
  roomQueues,
  roomVotes,
  roomSongIds,
  roomSingers,
  roomParticipants,
  roomSkipVotes,
};