const { Server } = require('socket.io');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const express = require('express');
const { getAnswer, loadData } = require('./interactor');
const [dataRef] = require('./interactor/data');
const { auth } = require('./auth');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/login', auth);

const userList = new Set();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}.`);
});

io.on('connect', (socket) => {
  const username = `User ${socket.id.toString().slice(0, 6)}`;
  console.log(`${username} is connected.`);

  userList.add(`${username}`);
  userList.forEach((user) => {
    console.log(`name: ${user}`);
  });

  socket.on('view', (data) => {
    socket.broadcast.emit('update_view', data);
  });

  socket.on('query', (data) => {
    console.log(typeof data);
    if (typeof data.query === 'string') {
      const query = data.query.trim();
      console.log(`${username} asks interactor with query "${query}"`);
      socket.emit('query', getAnswer(query));
    } else {
      console.log(
        `${username} asks interactor with query which is not a string "${data.query}"`,
      );
    }
  });

  socket.on('answer', (data) => {
    console.log(`${username} answers "${data.answer}"`);
    socket.broadcast.emit('answer_view', data);
  });

  socket.on('show_answer', () => {
    console.log(`${username} asks to show answer`);
    socket.broadcast.emit('show_answer', dataRef.current);
  });

  socket.on('show_score', () => {
    console.log(`${username} asks to show score`);
    socket.broadcast.emit('show_score', dataRef.current);
  });

  socket.on('start', (data) => {
    console.log(
      `${username} starts a new round with ${data.numPlayers} players and results: ${data.results}`,
    );

    socket.emit('start', loadData(data));
    socket.broadcast.emit('start', { numPlayers: data.numPlayers });
  });

  socket.on('score', (data) => {
    console.log(`current score: ${data.scores}`);
    socket.broadcast.emit('score', data);
  });

  socket.on('disconnect', () => {
    console.log(`${username} is disconnected.`);
    userList.forEach((name) => {
      if (name == username) {
        console.log('found');
        userList.delete(name);
      }
    });
  });
});
