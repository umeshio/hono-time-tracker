import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if(!isLoggedIn){
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <div>
      <h1>ダッシュボード</h1>
      <button onClick={() => setIsLoggedIn(false)}>ログアウト</button>
    </div>
  )
}

export default App
