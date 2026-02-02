const $ = (id) => document.getElementById(id);
const socket = io();

const statusEl = $('status');
const messages = $('messages');
const chat = $('chat');
const chatForm = $('chat-form');
const chatInput = $('chat-input');
const pingBtn = $('ping-btn');
const login = $('login');
const loginForm = $('login-form');
const loginInput = $('login-input');

const user = { id: null, name: "", color: "" };

const colors = ["cadetblue", "darkgoldenrod", "cornflowerblue", "darkkhaki", "hotpink", "gold"];

const addMeMessage = (content, date = new Date().toLocaleTimeString()) => {
  const div = document.createElement('div');
  div.classList.add('message', 'me');
  div.textContent = content;

  const span = document.createElement('span');
  span.classList.add('time');
  span.textContent = date;

  div.appendChild(span);
  messages.appendChild(div);
};

const addOtherMessage = (username, content, color, date = new Date().toLocaleTimeString()) => {
  const div = document.createElement('div');
  div.classList.add('message', 'other');

  const name = document.createElement('span');
  name.classList.add('username');
  name.style.color = color;
  name.textContent = username;

  const time = document.createElement('span');
  time.classList.add('time');
  time.textContent = date;
  name.appendChild(time);

  const msg = document.createElement('span');
  msg.textContent = content;

  div.append(name, msg, time);
  messages.appendChild(div);
};

const addServerMessage = (content) => {
  const div = document.createElement('div');
  div.classList.add('message', 'server');

  const label = document.createElement('span');
  label.classList.add('server-label');
  label.textContent = 'Server:';

  const msg = document.createElement('span');
  msg.textContent = content;

  div.append(label, msg);
  messages.appendChild(div);
};

socket.on('connect', () => {
  user.id = socket.id;
  statusEl.textContent =  `Conectado como (${socket.id})`;
});

socket.on('disconnect', (reason) => {
  statusEl.textContent =  `Desconectado (${reason}).`;
});

socket.on('server:welcome', (data) => addServerMessage(`${data.username} entrou no chat.`));
socket.on('server:bye', (data) => addServerMessage(`${data.username} saiu.`));
socket.on('server:pong', () => addServerMessage('Respondeu com pong!'));

socket.on('chat:msg', ({ from: { id, username, color }, msg, at }) => {
  id === socket.id
    ? addMeMessage(msg, new Date(at).toLocaleTimeString())
    : addOtherMessage(username, msg, color, new Date(at).toLocaleTimeString());
});

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

// Login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = loginInput.value.trim();
  if (!name) return;
  
  user.name = name;
  user.color = getRandomColor();

  socket.emit('user:login', { name: user.name, color: user.color });

  login.style.display = "none";
  chat.style.display = "flex";
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