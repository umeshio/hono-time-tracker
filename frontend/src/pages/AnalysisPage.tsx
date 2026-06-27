import { useEffect, useState } from "react"
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

// クライアントごとに「リターン種類別の合計」と「合計作業時間」を集計する
function buildSummary(logs: LogEntry[]) {
  const map = new Map<string, { clientName: string; totalsByValueType: Record<string, number>; totalMinutes: number }>()

  for (const log of logs) {
    const { Client, TimeLog } = log
    if (!map.has(Client.id)) {
      map.set(Client.id, { clientName: Client.name, totalsByValueType: {}, totalMinutes: 0 })
    }
    const summary = map.get(Client.id)!

    summary.totalsByValueType[TimeLog.valueType] =
      (summary.totalsByValueType[TimeLog.valueType] ?? 0) + TimeLog.amount

    if (TimeLog.endTime) {
      const start = new Date(TimeLog.startTime.replace(' ', 'T') + 'Z')
      const end = new Date(TimeLog.endTime)
      summary.totalMinutes += (end.getTime() - start.getTime()) / 1000 / 60
    }
  }

  return Array.from(map.entries()).map(([clientId, s]) => ({ clientId, ...s }))
}

export default function AnalysisPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs() {
    try {
      const logsRes = await api.get('/api/logs')
      setLogs(logsRes)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'データ取得に失敗しました')
    }
  }

  const summary = buildSummary(logs)

  return (
    <div>
      <h1>分析</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>集計（クライアント別）</h2>
      <ul>
        {summary.map(s => (
          <li key={s.clientId}>
            {s.clientName}：
            {Object.entries(s.totalsByValueType)
              .map(([type, total]) => `${type} ${total}`)
              .join(' / ')}
            （合計作業時間: {Math.round(s.totalMinutes)}分）
          </li>
        ))}
      </ul>

      <h2>全履歴</h2>
      <ul>
        {logs.map(log => (
          <li key={log.TimeLog.id}>
            {log.Client.name} / {log.TaskCategory.name} - {log.TimeLog.description}
            （{log.TimeLog.startTime} 〜 {log.TimeLog.endTime ?? '計測中'}） {log.TimeLog.valueType} {log.TimeLog.amount}
          </li>
        ))}
      </ul>
    </div>
  )
}