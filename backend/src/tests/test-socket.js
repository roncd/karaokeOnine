const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {

  console.log("Connecté !");
  console.log("ID :", socket.id);

  socket.emit("join-room", "ABC123");

  setTimeout(() => {

  socket.emit("add-song", {
    roomCode: "ABC123",
    songTitle: "Bohemian Rhapsody"
  });

}, 1000);

setTimeout(() => {

  socket.emit("add-song", {
    roomCode: "ABC123",
    songTitle: "Imagine"
  });

}, 2000);

setTimeout(() => {

  socket.emit("add-song", {
    roomCode: "ABC123",
    songTitle: "Wonderwall"
  });

}, 3000);

setTimeout(() => {

  socket.emit("vote-skip", {
    roomCode: "ABC123"
  });

}, 4000);

setTimeout(() => {

  socket.emit("vote-skip", {
    roomCode: "ABC123"
  });

}, 5000);

});

socket.on("user-joined", (data) => {

  console.log("Utilisateur rejoint :", data);

});

socket.on("song-added", (data) => {

  console.log("Nouvelle chanson :", data.songTitle);

});

socket.on("queue-updated", (queue) => {

  console.log("File d'attente :");

  console.log(queue);

});

socket.on("skip-updated", (data) => {

  console.log(
    `Votes skip : ${data.votes}`
  );

});

socket.on("song-skipped", (data) => {

  console.log(
    `Chanson retirée : ${data.skippedSong}`
  );

});