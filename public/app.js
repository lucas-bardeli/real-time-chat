const $ = (id) => document.getElementById(id);
const socket = io();

const statusEl = $('status-el');
const statusColor = $('status-color');
const messages = $('messages');
const chat = $('chat');
const chatForm = $('chat-form');
const chatInput = $('chat-input');
const pingBtn = $('ping-btn');
const login = $('login');
const loginForm = $('login-form');
const loginInput = $('login-input');

const user = { id: null, name: "", color: "" };

const colors = ["cadetblue", "darkgoldenrod", "cornflowerblue", "darkkhaki", "hotpink", "darkorange", "forestgreen", "royalblue", "tomato", "aqua", "olive"];

const addMessage = (isMe, content, username, color, date = new Date().toLocaleTimeString()) => {
  const divMessage = document.createElement('div');
  divMessage.classList.add('message', isMe ? 'me' : 'other');
  
  const divLabel = document.createElement('div');
  divLabel.classList.add('label');

  const spanName = document.createElement('span');
  spanName.style.color = isMe ? 'darkblue' : color;
  spanName.textContent = username;

  const spanTime = document.createElement('span');
  spanTime.classList.add('time');
  spanTime.textContent = `(${date})`;
  
  divLabel.append(spanName, spanTime);

  const msg = document.createElement('p');
  msg.textContent = content;

  divMessage.append(divLabel, msg);
  messages.appendChild(divMessage);
  
  scrollScreen();
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

  scrollScreen();
};

socket.on('connect', () => {
  user.id = socket.id;
  statusEl.textContent = `Conectado: ${socket.id}`;
  statusColor.style.backgroundColor = 'green';
});

socket.on('disconnect', (reason) => {
  statusEl.textContent = `Desconectado: ${reason}.`;
  statusColor.style.backgroundColor = 'red';
});

socket.on('server:welcome', (data) => addServerMessage(`${data.username} entrou no chat.`));
socket.on('server:bye', (data) => addServerMessage(`${data.username} saiu.`));
socket.on('server:pong', () => addServerMessage('Respondeu com pong!'));

socket.on('chat:msg', ({ from: { id, username, color }, msg, at }) => {
  addMessage(id === socket.id, msg, username, color, new Date(at).toLocaleTimeString());
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

  socket.emit('user:login', { username: user.name, color: user.color });

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

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};