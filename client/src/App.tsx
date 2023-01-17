import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import SignInForm from './components/SignInForm'
import { Messenger } from './components/Messenger'
import { Routes, Route, useNavigate } from 'react-router-dom'

export default function App() {
  const [user, setUser] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (user === '') navigate('/')
  }, [])

  return (
    <Routes>
      <Route path="/" element={<SignInForm setUser={setUser} />} />
      <Route path="/messenger" element={<Messenger user={user} />} />
    </Routes>
  )
}
