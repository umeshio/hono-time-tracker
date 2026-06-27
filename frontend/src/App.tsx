import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AnalysisPage from './pages/AnalysisPage'
import './App.css'
import { isLoggedIn as checkIsLoggedIn, removeToken } from './api/client'

function App() {
  // checkIsLoggedInはトークンの有無をbooleanで返す
  const [isLoggedIn, setIsLoggedIn] = useState(checkIsLoggedIn())

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  function handleLogout() {
    removeToken()
    setIsLoggedIn(false)
  }

  return (
    <div>
      <nav>
        <Link to="/">記録</Link>
        <Link to="/analysis">分析</Link>
        <button onClick={handleLogout}>ログアウト</button>
      </nav>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </div>
  )
}

export default App
