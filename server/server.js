// server/server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(express.json());

const server = http.createServer(app);

const wss = new WebSocket.Server({ server, path: '/ws' });

const clients = new Map();

wss.on('connection', (ws) => {
  let userNickname = null;

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.error('Ошибка парсинга JSON:', e);
      return;
    }

    switch (data.type) {
      case 'new-user': {
        const desiredNickname = data.name;
        if (clients.has(desiredNickname)) {
          ws.send(JSON.stringify({
            type: 'login',
            status: 'error',
            message: 'Ник занят, выберите другой.'
          }));
        } else {
          userNickname = desiredNickname;
          clients.set(userNickname, ws);
          ws.send(JSON.stringify({
            type: 'login',
            status: 'ok',
            user: { name: userNickname }
          }));
          broadcastUserList();
        }
        break;
      }
      case 'send': {
        if (!userNickname) return;
        broadcastMessage(userNickname, data.msg);
        break;
      }
      case 'exit': {
        if (userNickname && clients.has(userNickname)) {
          clients.delete(userNickname);
          broadcastUserList();
        }
        break;
      }
      default:
        console.log('Неизвестный тип сообщения:', data.type);
    }
  });

  ws.on('close', () => {
    if (userNickname && clients.has(userNickname)) {
      clients.delete(userNickname);
      broadcastUserList();
    }
  });
});

function broadcastUserList() {
  const userList = Array.from(clients.keys()).map((name) => ({ name }));
  const msg = JSON.stringify(userList);
  for (const [, client] of clients) {
    client.send(msg);
  }
}

function broadcastMessage(sender, msg) {
  const payload = JSON.stringify({
    type: 'message',
    user: sender,
    msg: msg
  });
  for (const [, client] of clients) {
    client.send(payload);
  }
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
