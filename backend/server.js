const { Server } = require('socket.io');
const { createServer } = require('http');

const express = require('express');
const getResult = require('./src/interactor');

const PORT = process.env.PORT || 4000;

const httpServer = createServer(express);

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

  socket.on('interact', (query) => {
    console.log(`${username} asks interactor with query "${query}"`);
    socket.emit('interact', getResult(query));
  });

  socket.on('disconnect', () => {
    console.log(`${username} is disconnected.`);
  });
});
