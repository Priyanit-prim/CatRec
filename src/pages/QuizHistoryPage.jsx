
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { get, ref } from 'firebase/database'
import { Link } from 'react-router-dom'
import { auth, database } from '../services/firebase'

function QuizHistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let unsubscribeAuth

    async function loadHistory(user) {
      if (!user) {
        if (active) {
          setHistory([])
          setLoading(false)
        }
        return
      }

      try {
        const snapshot = await get(
          ref(database, `quiz_results/${user.uid}`)
        )

        if (!active) return

        if (snapshot.exists()) {
          const data = snapshot.val()

          const records = Object.entries(data)
            .map(([id, item]) => ({ id, ...item }))
            .filter((item) => item.recommended_breeds)
            .sort(
              (a, b) =>
                new Date(b.created_at || 0) -
                new Date(a.created_at || 0)
            )

          setHistory(records)
        } else {
          setHistory([])
        }
      } catch (err) {
        console.error('โหลดประวัติไม่สำเร็จ:', err)
        if (active) {
          setError('โหลดประวัติไม่สำเร็จ กรุณาลองใหม่')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setLoading(true)
      setError('')
      loadHistory(user)
    })

    return () => {
      active = false
      unsubscribeAuth?.()
    }
  }, [])

  function formatDate(dateString) {
    if (!dateString) return 'ไม่ระบุวันที่'

    const date = new Date(dateString)

    if (Number.isNaN(date.getTime())) return dateString

    return date.toLocaleString('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  return (
    <main className="quiz-history-page">
      <div className="quiz-history-container">
        <h1>📋 ประวัติแบบทดสอบ</h1>
        <p>ดูผลการแนะนำสายพันธุ์แมวที่คุณเคยทำไว้</p>

        {loading ? (
          <p>กำลังโหลดประวัติ...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : history.length === 0 ? (
          <div className="quiz-history-empty">
            <p>ยังไม่มีประวัติแบบทดสอบ</p>
            <Link to="/recommendation">
              เริ่มทำแบบทดสอบ
            </Link>
          </div>
        ) : (
          <div className="quiz-history-list">
            {history.map((item) => (
              <article className="quiz-history-card" key={item.id}>
                <h2>ผลการแนะนำสายพันธุ์แมว</h2>

                <p className="quiz-history-date">
                  วันที่ทำ: {formatDate(item.created_at)}
                </p>

                <h3>สายพันธุ์ที่แนะนำ</h3>

                <ol>
                  {item.recommended_breeds.map((breed, index) => (
                    <li key={breed.breed_id || `${item.id}-${index}`}>
                      {breed.name_th || breed.name_en || breed.breed_id}
                      {breed.name_th && breed.name_en
                        ? ` (${breed.name_en})`
                        : ''}
                    </li>
                  ))}
                </ol>

                <details>
                  <summary>ดูคำตอบแบบทดสอบ</summary>
                  <ul>
                    <li>ที่อยู่อาศัย: {item.answers?.living || '-'}</li>
                    <li>กิจกรรม: {item.answers?.activity || '-'}</li>
                    <li>การดูแลขน: {item.answers?.grooming || '-'}</li>
                    <li>นิสัย: {item.answers?.personality || '-'}</li>
                  </ul>
                </details>
              </article>
            ))}
          </div>
        )}

        <Link className="quiz-history-back" to="/">
          ← กลับหน้าหลัก
        </Link>
      </div>
    </main>
  )
}

export default QuizHistoryPage
