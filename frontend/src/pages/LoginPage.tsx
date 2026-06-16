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
		<div className={styles.container}>
			<h1 className={styles.title}>Time Tracker</h1>
			<h2 className={styles.subtitle}>
				{isSignup ? 'アカウント作成' : 'ログイン'}
			</h2>
			<form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>メールアドレス</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>パスワード</label>
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
        className={styles.toggleButton}
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup ? 'ログインに戻る' : 'アカウントを作成する'}
      </button>
		</div>
	)
}

