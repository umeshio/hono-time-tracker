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

type LogEntry = {
  TimeLog: {
    id: string
    description: string
    startTime: string
    endTime: string | null
  }
  Client: Client
  TaskCategory: TaskCategory
}

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
  const [newClientName, setNewClientName] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([])

	useEffect(() => {
    loadInitialData()
  }, [])

	// ログインアカウントのデータをロードする
	async function loadInitialData() {
		try {
      const [clientsRes, categoriesRes, currentLogRes, logsRes] = await Promise.all([
        api.get('/api/clients'),
        api.get('/api/categories'),
        api.get('/api/logs/current'),
        api.get('/api/logs'),
      ])
      setClients(clientsRes)
      setCategories(categoriesRes)
      setCurrentLog(currentLogRes)
      setLogs(logsRes)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'データ取得に失敗しました')
    }
	}

  // クライアントを新規登録する
  async function handleAddClient() {
    setError('')
    try {
      await api.post('/api/clients', {name: newClientName, isPrivate: false})
      setNewClientName('')
      const clientsRes = await api.get('/api/clients')
      setClients(clientsRes)
    } catch(e) {
      setError(e instanceof Error ? e.message : 'クライアント登録に失敗しました')
    }
  }

  // カテゴリを新規登録する
  async function handleAddCategory() {
    setError('')
    try {
      await api.post('/api/categories', { name: newCategoryName })
      setNewCategoryName('')
      const categoriesRes = await api.get('/api/categories')
      setCategories(categoriesRes)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'カテゴリ登録に失敗しました')
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
      const logsRes = await api.get('/api/logs')
      setLogs(logsRes)
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

      <div>
        <input
          type="text"
          placeholder="新しいクライアント名"
          value={newClientName}
          onChange={e => setNewClientName(e.target.value)}
        />
        <button onClick={handleAddClient} disabled={!newClientName}>クライアント追加</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="新しいカテゴリ名"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
        />
        <button onClick={handleAddCategory} disabled={!newCategoryName}>カテゴリ追加</button>
      </div>

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

      <h2>履歴</h2>
      <ul>
        {logs.map(log => (
          <li key={log.TimeLog.id}>
            {log.Client.name} / {log.TaskCategory.name} - {log.TimeLog.description}
            （{log.TimeLog.startTime} 〜 {log.TimeLog.endTime ?? '計測中'}）
          </li>
        ))}
      </ul>
    </div>
  )
}