
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from '../services/firebase'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      window.location.href = '/'
    } catch (err) {
      console.error(err)
      setError('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword() {
    setError('')
    setMessage('')

    if (!email.trim()) {
      setError('กรุณากรอกอีเมลก่อนกดลืมรหัสผ่าน')
      return
    }

    setResetLoading(true)

    try {
      await sendPasswordResetEmail(auth, email.trim())
      setMessage('ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบอีเมล')
    } catch (err) {
      console.error(err)
      setError('ส่งอีเมลไม่สำเร็จ กรุณาตรวจสอบอีเมลแล้วลองใหม่')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>เข้าสู่ระบบ</h1>
        <p className="auth-description">
          ยินดีต้อนรับกลับสู่ CatRec 🐱
        </p>

        <label htmlFor="login-email">อีเมล</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="กรอกอีเมล"
          autoComplete="email"
          required
        />

        <label htmlFor="login-password">รหัสผ่าน</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="กรอกรหัสผ่าน"
          autoComplete="current-password"
          required
        />

        <button
          className="auth-submit"
          type="submit"
          disabled={loading || resetLoading}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>

        <div className="auth-messages">
          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}
        </div>

        <div className="auth-footer-links">
          <span>ยังไม่มีบัญชี?</span>
          <Link to="/register">สมัครสมาชิก</Link>
          <button
            type="button"
            className="forgot-password-button"
            onClick={handleResetPassword}
            disabled={loading || resetLoading}
          >
            {resetLoading ? 'กำลังส่ง...' : 'ลืมรหัสผ่าน?'}
          </button>
        </div>

        <Link className="back-home-link" to="/">
          ← กลับหน้าหลัก
        </Link>
      </form>
    </section>
  )
}

export default LoginPage
