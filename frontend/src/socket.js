import { io } from 'socket.io-client';

export const URL = 'http://localhost:4000';

export const socket = io(URL, {
  autoConnect: false,
});
