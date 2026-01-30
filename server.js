import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.static('public'));

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  // Envia mensagem quando alguém se conecta
  io.emit('server:welcome', { msg: "pulou para o servidor.", id: socket.id});
  console.log(`Socket connected: ${socket.id}`);
  
  // Recebe mensagems do cliente
  socket.on('client:ping', (data) => {
    socket.emit('server:pong', { received: data, at: Date.now() })
  });
  
  // Broadcast para todos
  socket.on('chat:msg', (msg) => {
    io.emit('chat:msg', { from: socket.id, msg, at: Date.now() });
  });
  
  socket.on('disconnect', (reason) => {
    io.emit('server:bye', { id: socket.id, msg: "saiu.", reason: reason});
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = 3000; // http://localhost:3000/
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});