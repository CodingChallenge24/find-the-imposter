import { useState, useEffect } from 'react'
import './App.css'
import ImposterRow from '../src/ImposterRow.jsx'
import { socket } from './socket.js'

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
      <ImposterRow noImposter={15}/>
    </>
  )
}

export default App
