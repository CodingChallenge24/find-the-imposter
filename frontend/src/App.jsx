import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ImposterRow from '../src/ImposterRow.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ImposterRow noImposter={15}/>
    </>
  )
}

export default App
