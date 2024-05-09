import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserBar from '../src/UserBar.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UserBar userName="Player 1" noImposter={30} choosingMask={7} displayText="A" />
      <UserBar userName="Player 2" noImposter={30} choosingMask={12} displayText="B" />
      <UserBar userName="Player 3" noImposter={30} choosingMask={42512} displayText="C" />
      <UserBar userName="Player 4" noImposter={30} choosingMask={5224} displayText="D" />
      <div id="logo"></div>
    </>
  )
}

export default App
