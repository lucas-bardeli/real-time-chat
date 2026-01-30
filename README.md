# 💬 Real-Time Chat
Um **chat em tempo real** construído com **Node.js**, **Express**, **Socket.io** e **WebSockets**, com frontend em **HTML, CSS e JavaScript**.

## 🚀 Demonstração do que o projeto faz

* Conexão em tempo real via WebSockets
* Broadcast de mensagens para todos os usuários conectados
* Identificação de mensagens próprias vs. mensagens de outros usuários
* Eventos de entrada e saída de usuários
* Sistema simples de *ping / pong* para testar o canal
* Frontend servido pelo próprio backend

## ⚙️ Como rodar o projeto localmente

### Pré-requisitos
* **Node.js** (versão 18+ recomendada)
* **npm**

### Instalar dependências e rodar o servidor
```bash
npm install
npm run serve
```

O servidor será iniciado em:
```
http://localhost:3000
```
O modo `--watch` no script reinicia automaticamente o servidor quando arquivos são alterados.