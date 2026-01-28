const $ = (id) => document.getElementById(id);
const socket = io();

const statusEl = $('status');
const messages = $('messages');
const chatForm = $('chat-form');
const chatInput = $('chat-input');
const ping = $('ping-btn');

const addMessage = (text, isMe = false) => {
  const div = document.createElement('div');

  div.classList.add('message', isMe ? 'me' : 'other');
  div.textContent = text;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
};

socket.on('connect', () => {
  statusEl.textContent =  `Conectado (${socket.id})!`;
  addMessage(`Conectado como ${socket.id}`);
});

socket.on('disconnect', (reason) => {
  statusEl.textContent =  `Desconectado (${reason})!`;
  addMessage(`Desconectado: ${reason}`);
});