const { Server } = require('socket.io');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const express = require('express');
const getResult = require('./src/interactor');
const { auth } = require('./auth');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/login', auth);

const userList = new Set()

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

  userList.add(`${username}`)
  userList.forEach((user)=>{
    console.log(`name: ${user}`)
  })

  socket.emit('online', {userList: Array.from(userList)})
  // socket.on('online', () => {
  //   console.log('online')
  // })

  socket.on('query', (data) => {
    console.log(typeof data);
    if (typeof data.query === 'string') {
      const query = data.query.trim();
      console.log(`${username} asks interactor with query "${query}"`);
      socket.emit('query', getResult(query));
    } else {
      console.log(
        `${username} asks interactor with query which is not a string "${data.query}"`,
      );
    }
  });

  socket.on('disconnect', () => {
    console.log(`${username} is disconnected.`);
    userList.forEach((name)=>{
      if (name == username) {
        console.log('found')
        userList.delete(name)
      }
    })
  });
});
