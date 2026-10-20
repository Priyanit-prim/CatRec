
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'
import { auth } from '../services/firebase'

function ChangePasswordPage() {
  const user = auth.currentUser
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!user || !user.email) {
      setError('กรุณาเข้าสู่ระบบก่อนเปลี่ยนรหัสผ่าน')
      return
    }

    if (newPassword.length < 6) {
      setError('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน')
      return
    }

    if (currentPassword === newPassword) {
      setError('กรุณาตั้งรหัสผ่านใหม่ที่แตกต่างจากรหัสผ่านเดิม')
      return
    }

    setLoading(true)

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      )

      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage('เปลี่ยนรหัสผ่านสำเร็จแล้ว')
    } catch (err) {
      console.error(err)

      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-login-credentials'
      ) {
        setError('รหัสผ่านเดิมไม่ถูกต้อง')
      } else if (err.code === 'auth/weak-password') {
        setError('รหัสผ่านใหม่ไม่ปลอดภัยเพียงพอ')
      } else if (err.code === 'auth/requires-recent-login') {
        setError('กรุณาออกจากระบบแล้วเข้าสู่ระบบใหม่ ก่อนเปลี่ยนรหัสผ่าน')
      } else {
        setError('เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <h1>เปลี่ยนรหัสผ่าน</h1>
          <p>กรุณาเข้าสู่ระบบก่อนใช้งาน</p>
          <Link to="/login">เข้าสู่ระบบ</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>เปลี่ยนรหัสผ่าน</h1>
        <p className="auth-description">
          บัญชี {user.email}
        </p>

        <label htmlFor="current-password">รหัสผ่านเดิม</label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <label htmlFor="new-password">รหัสผ่านใหม่</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label htmlFor="confirm-password">ยืนยันรหัสผ่านใหม่</label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
        </button>

        <button
          type="button"
          className="forgot-password-button"
          onClick={() => navigate('/')}
        >
          กลับหน้าหลัก
        </button>
      </form>
    </section>
  )
}

export default ChangePasswordPage
