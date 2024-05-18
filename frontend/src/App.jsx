import { useState, useEffect } from 'react'
import './App.css'
import { socket } from './socket.js'
import ParticipantPage from './ParticipantPage.jsx';
import axios from 'axios';
import ViewerPage from './ViewerPage.jsx';
function App() {

  useEffect(() => {
    document.title = 'Find the imposter';
  }, []);

  const user = localStorage.getItem('user');

  async function handleSubmit(event) {
    event.preventDefault();
    const username = event.target.user.value;
    const password = event.target.password.value;

    if (username && password) {
      const res = await axios.post('http://localhost:4000/login', { username, password })
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify({id: res.data.id, username, fullname: res.data.fullname, role: res.data.role }));
        window.location.reload();
      }
    }
  }

  return (
    <>
      {
        user
          ? <ParticipantPage />
          : <div id="login">
            <form className='flex flex-col gap-2 w-[300px] mx-auto' onSubmit={handleSubmit}>
              <h2 className='text-center text-xl'>Login</h2>
              <input type='text' name='user' placeholder='Enter username' />
              <input type='password' name='password' placeholder='Enter password' />
              <button type='submit'>Login</button>
            </form>
          </div>
        }
      </>
    )
}

export default App
