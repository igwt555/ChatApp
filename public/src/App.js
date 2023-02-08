import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import SetAvatar from './pages/setAvatar/SetAvatar';
import Chat from './pages/chat/Chat';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/setAvatar' element={<SetAvatar />}/>
        <Route path='/' element={<Chat />}/>
      </Routes>
    </BrowserRouter>
  )
}