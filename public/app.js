const $ = (id) => document.getElementById(id);
const socket = io();

const statusEl = $('status');
const messages = $('messages');
const chatForm = $('chat-form');
const chatInput = $('chat-input');
const pingBtn = $('ping-btn');

const addMessage = (msg, isMe = false, date = new Date().toLocaleTimeString()) => {
  const div = document.createElement('div');
  div.classList.add('message', isMe ? 'me' : 'other');

  const divMsg = document.createElement('div');
  divMsg.classList.add('text');
  divMsg.textContent = msg;

  const span = document.createElement('span');
  span.classList.add('date');
  span.textContent = date;

  div.appendChild(divMsg);
  div.appendChild(span);

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
};

socket.on('connect', () => {
  statusEl.textContent =  `Conectado como (${socket.id})`;
  addMessage(`Conectado como ${socket.id}`);
});

socket.on('disconnect', (reason) => {
  statusEl.textContent =  `Desconectado (${reason}).`;
  addMessage(`Desconectado: ${reason}.`);
});

socket.on('server:welcome', (data) => addMessage(`${data.id} ${data.msg}`));
socket.on('server:bye', (data) => addMessage(`${data.id} ${data.msg}`));
socket.on('server:pong', (data) => addMessage(`Pong! (${new Date(data.at).toLocaleTimeString()})`));

socket.on('chat:msg', ({ from, msg, at }) => {
  addMessage(msg, from === socket.id, new Date(at).toLocaleTimeString());
});

// Envio de mensagens
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = chatInput.value.trim();
  if (!msg) return;

  socket.emit('chat:msg', msg);
  chatInput.value = '';
});

// Botão Ping
pingBtn.addEventListener('click', () => {
  socket.emit('client:ping', { at: Date.now() });
});