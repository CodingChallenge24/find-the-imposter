const { Server } = require('socket.io');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const express = require('express');
const { getAnswer, loadData } = require('./interactor');
const { auth } = require('./auth');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/login', auth);

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

  socket.on('start', (data) => {
    console.log(
      `${username} starts a new round with ${data.numPlayers} imposters and results: ${data.results}`,
    );
    socket.emit('start', loadData(data));
    socket.broadcast.emit('start', { numPlayers: data.numPlayers });
  });

  socket.on('disconnect', () => {
    console.log(`${username} is disconnected.`);
  });
});
