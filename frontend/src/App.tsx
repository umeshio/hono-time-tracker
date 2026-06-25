import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'
import { isLoggedIn as checkIsLoggedIn } from './api/client'

function App() {
  // checkIsLoggedInはトークンの有無をbooleanで返す
  const [isLoggedIn, setIsLoggedIn] = useState(checkIsLoggedIn())

  if(!isLoggedIn){
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  return <DashboardPage onLogout={() => setIsLoggedIn(false)} />
}

export default App
