import { useEffect, useState } from "react"
import { api, removeToken } from "../api/client"

type Client = {
  id: string
  name: string
  isPrivate: boolean
}

type TaskCategory = {
  id: string
  name: string
}

type CurrentLog = {
  TimeLog: {
    id: string
    description: string
    startTime: string
    endTime: string | null
  }
  Client: Client
} | null

type Props = {
  onLogout: () => void
}

export default function DashboardPage({ onLogout }: Props) {
	const [clients, setClients] = useState<Client[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [currentLog, setCurrentLog] = useState<CurrentLog>(null)

  const [clientId, setClientId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

	useEffect(() => {
    loadInitialData()
  }, [])

	// ログインアカウントのデータをロードする
	async function loadInitialData() {
		try {
      const [clientsRes, categoriesRes, currentLogRes] = await Promise.all([
        api.get('/api/clients'),
        api.get('/api/categories'),
        api.get('/api/logs/current'),
      ])
      setClients(clientsRes)
      setCategories(categoriesRes)
      setCurrentLog(currentLogRes)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'データ取得に失敗しました')
    }
	}

	// タイマーをスタートする
	async function handleStart() {
    setError('')
    try {
      await api.post('/api/logs/start', { clientId, taskCategoryId: categoryId, description })
      const currentLogRes = await api.get('/api/logs/current')
      setCurrentLog(currentLogRes)
    } catch (e) {
      setError(e instanceof Error ? e.message : '計測開始に失敗しました')
    }
  }

	// タイマーを止める
  async function handleStop() {
    if (!currentLog) return
    setError('')
    try {
      await api.patch(`/api/logs/${currentLog.TimeLog.id}/stop`)
      setCurrentLog(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : '計測停止に失敗しました')
    }
  }

	// ログアウト
  function handleLogout() {
    removeToken()
    onLogout()
  }

  return (
    <div>
      <h1>ダッシュボード</h1>
      <button onClick={handleLogout}>ログアウト</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {currentLog ? (
        <div>
          <p>計測中: {currentLog.Client.name} - {currentLog.TimeLog.description}</p>
          <p>開始: {currentLog.TimeLog.startTime}</p>
          <button onClick={handleStop}>停止</button>
        </div>
      ) : (
        <div>
          <select value={clientId} onChange={e => setClientId(e.target.value)}>
            <option value="">クライアントを選択</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">カテゴリを選択</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="作業内容"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <button onClick={handleStart} disabled={!clientId || !categoryId}>開始</button>
        </div>
      )}
    </div>
  )
}