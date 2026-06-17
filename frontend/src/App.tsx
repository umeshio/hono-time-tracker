import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import './App.css'
import { isLoggedIn as checkIsLoggedIn, removeToken } from './api/client'

function App() {
  // checkIsLoggedInはトークンの有無をbooleanで返す
  const [isLoggedIn, setIsLoggedIn] = useState(checkIsLoggedIn())

  // ログアウト関数
  function handleLogout() {
    removeToken()
    setIsLoggedIn(false)
  }

  if(!isLoggedIn){
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <div>
      <h1>ダッシュボード</h1>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  )
}

export default App
