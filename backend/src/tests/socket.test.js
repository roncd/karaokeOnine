import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { io as ioc } from 'socket.io-client';
import { createServer } from 'http';
import { Server } from 'socket.io';

import registerRoomHandlers  from '../src/sockets/roomHandler.js';
import registerQueueHandlers from '../src/sockets/queueHandler.js';
import registerVoteHandlers  from '../src/sockets/voteHandler.js';

let httpServer;
let ioServer;
let clientSocket;
const PORT = 3001; // port différent pour ne pas confliter avec le dev

// ─── Utilitaire : attendre un événement socket ───────────────────────────────
function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, (data) => resolve(data));
  });
}

// ─── Setup / Teardown ────────────────────────────────────────────────────────
beforeAll(() => {
  return new Promise((resolve) => {
    httpServer = createServer();
    ioServer = new Server(httpServer);

    ioServer.on('connection', (socket) => {
      registerRoomHandlers(ioServer, socket);
      registerQueueHandlers(ioServer, socket);
      registerVoteHandlers(ioServer, socket);
    });

    httpServer.listen(PORT, () => {
      clientSocket = ioc(`http://localhost:${PORT}`, {
        transports: ['websocket'],
      });
      clientSocket.on('connect', resolve);
    });
  });
});

afterAll(() => {
  return new Promise((resolve) => {
    clientSocket.disconnect();
    ioServer.close();
    httpServer.close(resolve);
  });
});

// ─── Tests ───────────────────────────────────────────────────────────────────

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

    // Premier vote
    clientSocket.emit('vote-skip', { roomCode: 'TEST05' });
    await waitFor(clientSocket, 'skip-updated');

    // Deuxième vote — doit déclencher song-skipped
    const skippedPromise = waitFor(clientSocket, 'song-skipped');
    const queuePromise   = waitFor(clientSocket, 'queue-updated');
    clientSocket.emit('vote-skip', { roomCode: 'TEST05' });

    const skipped = await skippedPromise;
    const queue   = await queuePromise;

    expect(skipped).toHaveProperty('skippedSong', 'Purple Rain');
    expect(queue).not.toContain('Purple Rain');
  });

  it('remet les votes à 0 après un skip', async () => {
    clientSocket.emit('join-room', 'TEST06');
    clientSocket.emit('add-song', { roomCode: 'TEST06', songTitle: 'Hotel California' });
    await waitFor(clientSocket, 'queue-updated');

    // Déclencher le skip
    clientSocket.emit('vote-skip', { roomCode: 'TEST06' });
    await waitFor(clientSocket, 'skip-updated');
    clientSocket.emit('vote-skip', { roomCode: 'TEST06' });
    await waitFor(clientSocket, 'song-skipped');

    // Ajouter une nouvelle chanson et voter une fois
    clientSocket.emit('add-song', { roomCode: 'TEST06', songTitle: 'Stairway to Heaven' });
    await waitFor(clientSocket, 'queue-updated');

    const promise = waitFor(clientSocket, 'skip-updated');
    clientSocket.emit('vote-skip', { roomCode: 'TEST06' });
    const data = await promise;

    // Les votes doivent repartir de 1, pas de 3
    expect(data.votes).toBe(1);
  });
});