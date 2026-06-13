function pickRandomSinger(participants) {
  if (!participants || participants.length === 0) return null;
  const index = Math.floor(Math.random() * participants.length);
  return participants[index];
}

module.exports = pickRandomSinger;