import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { auth } from '../../services/firebase'

const ADMIN_UID = 'sAa18PVZFTXWiTZtrIIm59bJ8982'

function Header() {
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setCheckingAuth(false)
    })

    return unsubscribe
  }, [])

  async function handleLogout() {
    try {
      await signOut(auth)
      window.location.href = '/'
    } catch (error) {
      console.error('ออกจากระบบไม่สำเร็จ:', error)
      alert('ออกจากระบบไม่สำเร็จ กรุณาลองใหม่')
    }
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-icon">🐱</span>
        <span>CatRec</span>
      </Link>

      <nav className="main-nav">
        <Link to="/">หน้าแรก</Link>
        <Link to="/breeds">สายพันธุ์แมว</Link>
        <Link to="/recommendation">แนะนำสายพันธุ์</Link>
        <Link to="/knowledge">ความรู้เกี่ยวกับแมว</Link>
        <Link to="/satisfaction-survey">
          📝 แบบสอบถามความพึงพอใจ
        </Link>
        <Link to="/favorites">♡ รายการโปรด</Link>
      </nav>

      <div className="account-nav">
        {!checkingAuth && (
          user ? (
            <>
              <span className="user-greeting">
                สวัสดี, {user.displayName || user.email}
              </span>

              {user.uid === ADMIN_UID && (
  <Link to="/admin">
    📊 ผลประเมินความพึงพอใจ
  </Link>
)}

              <Link to="/quiz-history">
                📋 ประวัติแบบทดสอบ
              </Link>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link to="/login">เข้าสู่ระบบ</Link>
              <Link className="register-link" to="/register">
                สมัครสมาชิก
              </Link>
            </>
          )
        )}
      </div>
    </header>
  )
}

export default Header
