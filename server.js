import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.static('public'));

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

const users = new Map();

io.on('connection', (socket) => {
  socket.on('user:login', (data) => {
    users.set(socket.id, { id: socket.id, username: data.username, color: data.color });

    const user = users.get(socket.id);
    if (!user) return;

    io.emit('server:welcome', { username: user.username });
  });
  
  socket.on('client:ping', () => socket.emit('server:pong', { at: Date.now() }));

  socket.on('chat:msg', (msg) => {
    const user = users.get(socket.id);
    if (!user) return;

    io.emit('chat:msg', { from: { id: socket.id, username: user.username, color: user.color }, msg, at: Date.now() });
  });
  
  socket.on('disconnect', (reason) => {
    const user = users.get(socket.id);
    if (!user) return;

    io.emit('server:bye', { username: user.username, reason: reason });
    users.delete(socket.id);
  });
});

const PORT = 3000; // http://localhost:3000/
server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));