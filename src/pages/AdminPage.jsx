
import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { onValue, ref } from 'firebase/database'
import { auth, database } from '../services/firebase'

const ADMIN_UID = 'sAa18PVZFTXWiTZtrIIm59bJ8982'

const questions = [
  { key: 'usability', label: 'ความสะดวกในการใช้งานเว็บไซต์' },
  { key: 'breed_information', label: 'ความครบถ้วนของข้อมูลสายพันธุ์แมว' },
  { key: 'interface', label: 'ความเข้าใจง่ายของหน้าจอ' },
  { key: 'recommendation', label: 'ประโยชน์ของระบบแนะนำสายพันธุ์แมว' },
  { key: 'overall_satisfaction', label: 'ความพึงพอใจโดยรวม' },
]

function getAverage(surveys, key) {
  const scores = surveys
    .map((survey) => Number(survey[key]))
    .filter((score) => Number.isFinite(score) && score >= 1 && score <= 5)

  if (scores.length === 0) return null

  return scores.reduce((sum, score) => sum + score, 0) / scores.length
}

function AdminPage() {
  const [user, setUser] = useState(undefined)
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (user === undefined) return

    if (!user || user.uid !== ADMIN_UID) {
      setLoading(false)
      return
    }

    const surveyRef = ref(database, 'satisfaction_surveys')

    const unsubscribe = onValue(
      surveyRef,
      (snapshot) => {
        const data = snapshot.val() || {}

        const list = Object.entries(data).map(([id, item]) => ({
          id,
          ...item,
        }))

        list.sort(
          (a, b) => Number(b.created_at || 0) - Number(a.created_at || 0)
        )

        setSurveys(list)
        setError('')
        setLoading(false)
      },
      (err) => {
        console.error('อ่านข้อมูลแบบสอบถามไม่สำเร็จ:', err)
        setError('อ่านข้อมูลไม่ได้ กรุณาตรวจสอบ Firebase Database Rules')
        setLoading(false)
      }
    )

    return unsubscribe
  }, [user])

  const averages = useMemo(
    () =>
      questions.map((question) => ({
        ...question,
        average: getAverage(surveys, question.key),
      })),
    [surveys]
  )

  const respondentCount = useMemo(
    () =>
      new Set(
        surveys
          .map((survey) => survey.user_id)
          .filter(Boolean)
      ).size,
    [surveys]
  )

  if (user === undefined) {
    return <main className="survey-page">กำลังตรวจสอบบัญชี...</main>
  }

  if (!user) {
    return (
      <main className="survey-page">
        <section className="survey-card">
          <h1>หน้าแอดมิน</h1>
          <p>กรุณาเข้าสู่ระบบก่อนเข้าหน้านี้</p>
          <a href="/login">เข้าสู่ระบบ</a>
          <p><a href="/">กลับหน้าหลัก</a></p>
        </section>
      </main>
    )
  }

  if (user.uid !== ADMIN_UID) {
    return (
      <main className="survey-page">
        <section className="survey-card">
          <h1>หน้าแอดมิน</h1>
          <p role="alert">บัญชีนี้ไม่มีสิทธิ์เข้าถึงหน้าแอดมิน</p>
          <a href="/">กลับหน้าหลัก</a>
        </section>
      </main>
    )
  }

  if (loading) {
    return <main className="survey-page">กำลังโหลดข้อมูล...</main>
  }

  const cardStyle = {
    border: '1px solid #eadde5',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px',
    background: '#fff',
  }

  const headingStyle = {
    color: '#8b4568',
    marginBottom: '12px',
  }

  return (
    <main className="survey-page">
      <section
        className="survey-card"
        style={{ maxWidth: '1000px', width: '100%' }}
      >
        <h1>จัดการแบบสอบถามความพึงพอใจ</h1>

        {error && (
          <p role="alert" style={{ color: '#b42318' }}>
            {error}
          </p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '20px',
          }}
        >
          <div style={cardStyle}>
            <p>แบบสอบถามทั้งหมด</p>
            <h2 style={headingStyle}>{surveys.length} รายการ</h2>
          </div>

          <div style={cardStyle}>
            <p>บัญชีที่ตอบแบบประเมิน</p>
            <h2 style={headingStyle}>{respondentCount} บัญชี</h2>
          </div>

          <div style={cardStyle}>
            <p>คะแนนเฉลี่ยความพึงพอใจโดยรวม</p>
            <h2 style={headingStyle}>
              {averages[4].average === null
                ? '-'
                : `${averages[4].average.toFixed(2)} / 5`}
            </h2>
          </div>
        </div>

        <article style={cardStyle}>
          <h2 style={headingStyle}>คะแนนเฉลี่ยแต่ละหัวข้อ</h2>
          <p style={{ fontSize: '13px', color: '#666' }}>
            คะแนนเต็ม 5 คะแนน คำนวณจากคำตอบที่มีอยู่จริงใน Firebase
          </p>

          {averages.map((item) => (
            <div key={item.key} style={{ marginTop: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '6px',
                }}
              >
                <span>{item.label}</span>
                <strong>
                  {item.average === null
                    ? '-'
                    : `${item.average.toFixed(2)} / 5`}
                </strong>
              </div>

              <div
                style={{
                  height: '14px',
                  background: '#f1e7ed',
                  borderRadius: '20px',
                  overflow: 'hidden',
                }}
                role="img"
                aria-label={`${item.label}: ${
                  item.average === null
                    ? 'ไม่มีข้อมูล'
                    : `${item.average.toFixed(2)} จาก 5 คะแนน`
                }`}
              >
                <div
                  style={{
                    width: `${item.average === null ? 0 : (item.average / 5) * 100}%`,
                    height: '100%',
                    background: '#c76b98',
                    borderRadius: '20px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </article>

        <h2 style={{ marginTop: '28px' }}>รายการแบบประเมิน</h2>

        {surveys.length === 0 && !error && (
          <p>ยังไม่มีข้อมูลแบบสอบถาม</p>
        )}

        {surveys.map((survey, index) => (
          <article key={survey.id} style={cardStyle}>
            <h3>แบบสอบถามที่ {index + 1}</h3>

            <p>
              <strong>ผู้ตอบ:</strong>{' '}
              {survey.user_name ||
                survey.user_email ||
                'ไม่พบชื่อบัญชี'}
            </p>

            {survey.user_email && survey.user_name && (
              <p>
                <strong>อีเมล:</strong> {survey.user_email}
              </p>
            )}

            <p>
              <strong>UID:</strong> {survey.user_id || 'ไม่มีข้อมูล'}
            </p>

            <p>
              <strong>วันที่ส่ง:</strong>{' '}
              {survey.created_at
                ? new Date(survey.created_at).toLocaleString('th-TH')
                : '-'}
            </p>

            {questions.map((question) => (
              <p key={question.key}>
                {question.label}: {survey[question.key] ?? '-'} / 5
              </p>
            ))}

            <p>
              <strong>ข้อเสนอแนะ:</strong>{' '}
              {survey.suggestion || '-'}
            </p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default AdminPage
