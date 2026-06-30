import { useState } from "react";
import { api, saveToken } from "../api/client";
import styles from './LoginPage.module.css'

type Props = {
	onLogin: () => void
}

export default function LoginPage({onLogin}:Props) {
	const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
	const [isSignup, setIsSignup] = useState(false)
	const [error, setError] = useState('')

	async function handleSubmit(e: React.SubmitEvent){
		e.preventDefault()
		setError('')
		try {
			if(isSignup) {
				await api.post('/api/auth/signup', { email, password })
			}
			const res = await api.post('/api/auth/login', { email, password })
			saveToken(res.token)
			onLogin()
		} catch (e) {
			setError(e instanceof Error ? e.message : 'エラーが発生しました')
		}
	}

	return(
		<div className="max-w-100 mx-auto mt-28 mb-28 p-10 bg-surface rounded-xl">
			<h1 className="text-3xl font-bold text-bg text-center mb-3 tracking-wider">Time Tracker</h1>
			<h2 className="text-center text-bg font-medium mb-3">
				{isSignup ? 'アカウント作成' : 'ログイン'}
			</h2>
			<form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className="text-bg text-sm">メールアドレス</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className="text-bg text-sm">パスワード</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitButton}>
          {isSignup ? '登録してログイン' : 'ログイン'}
        </button>
      </form>
      <button
        className="text-xs text-text text-center w-fit mx-auto block mt-2"
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup ? 'ログインに戻る' : 'アカウントを作成する'}
      </button>
		</div>
	)
}

