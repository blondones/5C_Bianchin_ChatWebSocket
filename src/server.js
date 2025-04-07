const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname)));
let users = [];

io.on("connection", (socket) => {
    console.log("Un utente si è connesso:", socket.id);

    socket.on("join", (username) => {
        if (!username || users.find(u => u.name === username)) {
            socket.emit("join_error", "Nome già in uso o non valido.");
            return;
        }

        users.push({ name: username, socketId: socket.id });
        console.log(`Utente ${username} connesso.`);

        io.emit("chat", `${username} è entrato nella chat.`);
        io.emit("list", users);
    });

    socket.on("message", (msg) => {
        const user = users.find(u => u.socketId === socket.id);
        if (user) {
            io.emit("chat", `${user.name}: ${msg}`);
        }
    });

    socket.on("disconnect", () => {
        const userIndex = users.findIndex(u => u.socketId === socket.id);
        if (userIndex !== -1) {
            const username = users[userIndex].name;
            users.splice(userIndex, 1);
            console.log(`${username} si è disconnesso.`);
            io.emit("chat", `${username} ha lasciato la chat.`);
            io.emit("list", users);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
