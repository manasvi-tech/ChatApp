import { useState } from 'react'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import './App.css'
import Home from './pages/home/Home'
import { Routes,Route, Navigate } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import { useAuthContext } from './context/AuthContext'

function App() {
  const { authUser } = useAuthContext();
  // console.log(authUser)

  if (authUser === undefined) {
    // Optionally, you can return a loading spinner or some fallback UI
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='p-4 h-screen flex items-center justify-center'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/signup' element={authUser ? <Navigate to='/'/> : <Signup />} />
          <Route path='/login' element={authUser ? <Home /> : <Login />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App
