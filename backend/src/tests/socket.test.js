const { httpServer, io } = require('../server');
const { io: ioc } = require('socket.io-client');
const pool = require('../db/db')

let clientSocket;
const PORT = 3001;

function waitFor(socket, event) {
  return new Promise((resolve) => socket.once(event, resolve));
}

beforeAll((done) => {
  httpServer.listen(PORT, () => {
    clientSocket = ioc(`http://localhost:${PORT}`, {
      transports: ['websocket'],
    });
    clientSocket.on('connect', done);
  });
});

// Nettoie la DB avant chaque test
beforeEach(async () => {
  await pool.query(`DELETE FROM song`);
  await pool.query(`
      INSERT INTO song (titre, artiste, genre, duree, annee) VALUES
      ('Bohemian Rhapsody', 'Queen', 'Rock', 354, 1975),
      ('Imagine', 'John Lennon', 'Pop', 183, 1971),
      ('Wonderwall', 'Oasis', 'Rock', 258, 1995),
      ('Billie Jean', 'Michael Jackson', 'Pop', 294, 1982),
      ('Purple Rain', 'Prince', 'Rock', 512, 1984),
      ('Hotel California', 'Eagles', 'Rock', 390, 1976),
      ('Stairway to Heaven', 'Led Zeppelin', 'Rock', 482, 1971)
    `);
})

// Ferme la connexion après tous les tests
afterAll(async () => {
  if (clientSocket.connected) {
    clientSocket.disconnect();
  }
  io.close();
  await new Promise((resolve) => httpServer.close(resolve));
  await pool.query(`DELETE FROM song`);
  await pool.end();
});

// Test
describe('roomHandler', () => {
  it('émet user-joined après join-room', async () => {
    const promise = waitFor(clientSocket, 'user-joined');
    clientSocket.emit('join-room', 'TEST01');
    const data = await promise;

    expect(data).toHaveProperty('userId');
    expect(typeof data.userId).toBe('string');
  });
});

describe('queueHandler', () => {
  it('met à jour la file après add-song', async () => {
    clientSocket.emit('join-room', 'TEST02');
    await waitFor(clientSocket, 'user-joined');
    const promise = waitFor(clientSocket, 'queue-updated');
    clientSocket.emit('add-song', { roomCode: 'TEST02', songTitle: 'Bohemian Rhapsody' });
    const queue = await promise;

    expect(Array.isArray(queue)).toBe(true);
    expect(queue).toContain('Bohemian Rhapsody');
  });

  it('accumule plusieurs chansons dans la file', async () => {
    clientSocket.emit('join-room', 'TEST03');

    clientSocket.emit('add-song', { roomCode: 'TEST03', songTitle: 'Imagine' });
    await waitFor(clientSocket, 'queue-updated');

    const promise = waitFor(clientSocket, 'queue-updated');
    clientSocket.emit('add-song', { roomCode: 'TEST03', songTitle: 'Wonderwall' });
    const queue = await promise;

    expect(queue.length).toBeGreaterThanOrEqual(2);
    expect(queue).toContain('Imagine');
    expect(queue).toContain('Wonderwall');
  });
});

describe('voteHandler', () => {
  it('incrémente le compteur de votes skip', async () => {
    clientSocket.emit('join-room', 'TEST04');
    await waitFor(clientSocket, 'user-joined');
    clientSocket.emit('add-song', { roomCode: 'TEST04', songTitle: 'Billie Jean' });
    await waitFor(clientSocket, 'queue-updated');

    const promise = waitFor(clientSocket, 'skip-updated');
    clientSocket.emit('vote-skip', { roomCode: 'TEST04' });
    const data = await promise;

    expect(data).toHaveProperty('votes');
    expect(data.votes).toBe(1);
  });

  it('skip la chanson quand 2 votes atteints', async () => {
    clientSocket.emit('join-room', 'TEST05');
    clientSocket.emit('add-song', { roomCode: 'TEST05', songTitle: 'Purple Rain' });
    await waitFor(clientSocket, 'queue-updated');

    clientSocket.emit('vote-skip', { roomCode: 'TEST05' });
    await waitFor(clientSocket, 'skip-updated');

    const skippedPromise = waitFor(clientSocket, 'song-skipped');
    const queuePromise = waitFor(clientSocket, 'queue-updated');
    clientSocket.emit('vote-skip', { roomCode: 'TEST05' });

    const skipped = await skippedPromise;
    const queue = await queuePromise;

    expect(skipped).toHaveProperty('skippedSong', 'Purple Rain');
    expect(queue).not.toContain('Purple Rain');
  });

  it('remet les votes à 0 après un skip', async () => {
    clientSocket.emit('join-room', 'TEST06');
    clientSocket.emit('add-song', { roomCode: 'TEST06', songTitle: 'Hotel California' });
    await waitFor(clientSocket, 'queue-updated');

    clientSocket.emit('vote-skip', { roomCode: 'TEST06' });
    await waitFor(clientSocket, 'skip-updated');
    clientSocket.emit('vote-skip', { roomCode: 'TEST06' });
    await waitFor(clientSocket, 'song-skipped');

    clientSocket.emit('add-song', { roomCode: 'TEST06', songTitle: 'Stairway to Heaven' });
    await waitFor(clientSocket, 'queue-updated');

    const promise = waitFor(clientSocket, 'skip-updated');
    clientSocket.emit('vote-skip', { roomCode: 'TEST06' });
    const data = await promise;

    expect(data.votes).toBe(1);
  });
});
