import { useState, useEffect } from 'react'
import './App.css'
import { socket } from './socket.js'
import ParticipantPage from './ParticipantPage.jsx';
import Timer from './Timer.jsx';
function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <h1>{isConnected ? 'Connected' : 'Disconnected'}</h1>
      <ParticipantPage name="Alice" id="1" noImposter={30} />
      {/* <Timer time={300} /> */}
    </>
  )
}

export default App
