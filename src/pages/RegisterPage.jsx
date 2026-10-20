
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../services/firebase'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )

      await updateProfile(result.user, {
        displayName: name,
      })

      window.location.href = '/'
    } catch (err) {
      console.error(err)

      if (err.code === 'auth/email-already-in-use') {
        setError('อีเมลนี้ถูกสมัครไปแล้ว')
      } else if (err.code === 'auth/weak-password') {
        setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      } else if (err.code === 'auth/invalid-email') {
        setError('รูปแบบอีเมลไม่ถูกต้อง')
      } else {
        setError('สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>สมัครสมาชิก</h1>
        <p>เข้าร่วม CatRec เพื่อค้นพบเพื่อนตัวน้อย 🐱</p>

        <label htmlFor="register-name">ชื่อที่แสดง</label>
        <input
          id="register-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="กรอกชื่อของคุณ"
          required
        />

        <label htmlFor="register-email">อีเมล</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="กรอกอีเมล"
          required
        />

        <label htmlFor="register-password">รหัสผ่าน</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="อย่างน้อย 6 ตัวอักษร"
          minLength={6}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
        </button>

        <p>
          มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </p>
        <Link to="/">← กลับหน้าหลัก</Link>
      </form>
    </section>
  )
}

export default RegisterPage
