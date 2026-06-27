import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../api/client"

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
    valueType: string
    amount: number
  }
  Client: Client
} | null

type LogEntry = {
  TimeLog: {
    id: string
    description: string
    startTime: string
    endTime: string | null
    valueType: string
    amount: number
  }
  Client: Client
  TaskCategory: TaskCategory
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [currentLog, setCurrentLog] = useState<CurrentLog>(null)
  const [valueType, setValueType] = useState('')
  const [amount, setAmount] = useState('')

  const [clientId, setClientId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [newClientName, setNewClientName] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([])

  const [editingClientId, setEditingClientId] = useState<string | null>(null)
  const [editingClientName, setEditingClientName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')

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
      await api.post('/api/clients', { name: newClientName, isPrivate: false })
      setNewClientName('')
      const clientsRes = await api.get('/api/clients')
      setClients(clientsRes)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'クライアント登録に失敗しました')
    }
  }

  //クライアント変更
  async function handleUpdateClient(id: string) {
    setError('')
    try {
      await api.patch(`/api/clients/${id}`, { name: editingClientName })
      setEditingClientId(null)
      const clientsRes = await api.get('/api/clients')
      setClients(clientsRes)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'クライアント更新に失敗しました')
    }
  }

  //クライアント削除
  async function handleDeleteClient(id: string) {
    if (!window.confirm('本当に削除しますか？関連のタイムログは残りますがクライアント自体は戻せません')) return
    setError('')
    try {
      await api.delete(`/api/clients/${id}`)
      const clientsRes = await api.get('/api/clients')
      setClients(clientsRes)
      const logsRes = await api.get('/api/logs')
      setLogs(logsRes)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'クライアント削除に失敗しました')
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

  // カテゴリを変更
  async function handleUpdateCategory(id: string) {
    setError('')
    try {
      await api.patch(`/api/categories/${id}`, { name: editingCategoryName })
      setEditingCategoryId(null)
      const categoriesRes = await api.get('/api/categories')
      setCategories(categoriesRes)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'カテゴリ更新に失敗しました')
    }
  }
  
  // カテゴリを削除
  async function handleDeleteCategory(id: string) {
    if (!window.confirm('本当に削除しますか？関連のタイムログは残りますがカテゴリ自体は戻せません')) return
    setError('')
    try {
      await api.delete(`/api/categories/${id}`)
      const categoriesRes = await api.get('/api/categories')
      setCategories(categoriesRes)
      const logsRes = await api.get('/api/logs')
      setLogs(logsRes)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'カテゴリ削除に失敗しました')
    }
  }
  

  // タイマーをスタートする
  async function handleStart() {
    setError('')
    try {
      await api.post('/api/logs/start', {
        clientId,
        taskCategoryId: categoryId,
        description,
        valueType,
        amount: Number(amount),
      })
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

  // 過去の同一案件を参照
  const sameComboLogs = logs.filter(
    log => log.Client.id === clientId && log.TaskCategory.id === categoryId
  )

  return (
    <div>
      <h1>ダッシュボード</h1>

      <div>
        <input
          type="text"
          placeholder="新しいクライアント名"
          value={newClientName}
          onChange={e => setNewClientName(e.target.value)}
        />
        <button onClick={handleAddClient} disabled={!newClientName}>クライアント追加</button>
      </div>

      <ul>
        {clients.map(c => (
          <li key={c.id}>
            {editingClientId === c.id ? (
              <>
                <input value={editingClientName} onChange={e => setEditingClientName(e.target.value)} />
                <button onClick={() => handleUpdateClient(c.id)}>保存</button>
                <button onClick={() => setEditingClientId(null)}>キャンセル</button>
              </>
            ) : (
              <>
                {c.name}
                <button onClick={() => { setEditingClientId(c.id); setEditingClientName(c.name) }}>編集</button>
                <button onClick={() => handleDeleteClient(c.id)}>削除</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <div>
        <input
          type="text"
          placeholder="新しいカテゴリ名"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
        />
        <button onClick={handleAddCategory} disabled={!newCategoryName}>カテゴリ追加</button>
      </div>

      <ul>
        {categories.map(c => (
          <li key={c.id}>
            {editingCategoryId === c.id ? (
              <>
                <input value={editingCategoryName} onChange={e => setEditingCategoryName(e.target.value)} />
                <button onClick={() => handleUpdateCategory(c.id)}>保存</button>
                <button onClick={() => setEditingCategoryId(null)}>キャンセル</button>
              </>
            ) : (
              <>
                {c.name}
                <button onClick={() => { setEditingCategoryId(c.id); setEditingCategoryName(c.name) }}>編集</button>
                <button onClick={() => handleDeleteCategory(c.id)}>削除</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {currentLog ? (
        <div>
          <p>計測中: {currentLog.Client.name} - {currentLog.TimeLog.description}</p>
          <p>開始: {currentLog.TimeLog.startTime}</p>
          <p>リターン: {currentLog.TimeLog.valueType} {currentLog.TimeLog.amount}</p>
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

          {clientId && categoryId && (
            <div>
              <p>過去の同一案件（参考）</p>
              {sameComboLogs.length === 0 ? (
                <p>過去の記録はありません</p>
              ) : (
                <ul>
                  {sameComboLogs.map(log => (
                    <li key={log.TimeLog.id}>
                      {log.TimeLog.startTime}：{log.TimeLog.valueType} {log.TimeLog.amount}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <input
            type="text"
            placeholder="作業内容"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <select value={valueType} onChange={e => setValueType(e.target.value)}>
            <option value="">リターンの種類を選択</option>
            <option value="現金">現金</option>
            <option value="スタンプ">スタンプ</option>
          </select>

          <input
            type="number"
            placeholder="金額・量"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <button
            onClick={handleStart}
            disabled={!clientId || !categoryId || !valueType || !amount}
          >
            開始
          </button>
        </div>
      )}

      <h2>最近の履歴（直近5件）</h2>
      <ul>
        {logs.slice(0, 5).map(log => (
          <li key={log.TimeLog.id}>
            {log.Client.name} / {log.TaskCategory.name} - {log.TimeLog.description}
            （{log.TimeLog.startTime} 〜 {log.TimeLog.endTime ?? '計測中'}） {log.TimeLog.valueType} {log.TimeLog.amount}
          </li>
        ))}
      </ul>
      <Link to="/analysis">すべての履歴・集計を見る →</Link>
    </div>
  )
}