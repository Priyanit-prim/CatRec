
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllBreeds } from '../services/breedService'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { saveQuizResult } from '../services/quizService'

const questions = [
  {
    key: 'living',
    number: '01',
    title: 'คุณอาศัยอยู่แบบไหน?',
    description: 'เลือกพื้นที่ที่คุณจะใช้ชีวิตร่วมกับน้องแมว',
    options: [
      { value: 'apartment', icon: '🏢', title: 'หอพัก / อพาร์ตเมนต์', detail: 'พื้นที่ค่อนข้างจำกัด' },
      { value: 'house', icon: '🏡', title: 'บ้านที่มีพื้นที่', detail: 'มีพื้นที่ให้น้องเดินเล่น' },
    ],
  },
  {
    key: 'activity',
    number: '02',
    title: 'คุณชอบแมวแบบไหน?',
    description: 'คุณอยากใช้เวลาร่วมกับน้องแบบใด',
    options: [
      { value: 'active', icon: '🎾', title: 'ขี้เล่น กระตือรือร้น', detail: 'ชอบสำรวจและทำกิจกรรม' },
      { value: 'calm', icon: '🌙', title: 'สงบ สบาย ๆ', detail: 'ชอบพักผ่อนในบรรยากาศสงบ' },
    ],
  },
  {
    key: 'grooming',
    number: '03',
    title: 'คุณสะดวกดูแลขนแค่ไหน?',
    description: 'เลือกตามเวลาที่คุณมีในแต่ละวัน',
    options: [
      { value: 'easy', icon: '✨', title: 'ดูแลง่าย', detail: 'ต้องการใช้เวลาดูแลขนน้อย' },
      { value: 'care', icon: '🪮', title: 'ดูแลได้เป็นประจำ', detail: 'มีเวลาแปรงขนและดูแลน้อง' },
    ],
  },
  {
    key: 'personality',
    number: '04',
    title: 'คุณชอบนิสัยแมวแบบไหน?',
    description: 'เพื่อนตัวน้อยในแบบที่คุณชอบ',
    options: [
      { value: 'friendly', icon: '💗', title: 'เป็นมิตรและขี้อ้อน', detail: 'ชอบใช้เวลาอยู่กับเจ้าของ' },
      { value: 'independent', icon: '🐾', title: 'รักอิสระ', detail: 'ชอบมีพื้นที่ส่วนตัว' },
    ],
  },
]

function RecommendationPage() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null)
    })

    return () => unsubscribe()
  }, [])

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    living: '',
    activity: '',
    grooming: '',
    personality: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const question = questions[step]
  const progress = ((step + 1) / questions.length) * 100

  function chooseAnswer(value) {
    setAnswers((prev) => ({ ...prev, [question.key]: value }))
    setError('')
  }

  async function handleSubmit() {
    if (step < questions.length - 1) {
      if (!answers[question.key]) {
        setError('กรุณาเลือกคำตอบก่อนนะคะ 💗')
        return
      }

      setStep((prev) => prev + 1)
      setError('')
      return
    }

    if (!answers[question.key]) {
      setError('กรุณาเลือกคำตอบก่อนนะคะ 💗')
      return
    }

    setLoading(true)
    setError('')

    try {
      const breeds = await getAllBreeds()

      const results = breeds.map((breed) => {
        let score = 0

        const activity = String(breed.activity_level || '')
        const grooming = String(breed.grooming_level || '')
        const personality = String(breed.personality || '')

        // เปรียบเทียบระดับกิจกรรม
        if (
          answers.activity === 'active' &&
          /high|สูง|มาก|active/i.test(activity)
        ) score++

        if (
          answers.activity === 'calm' &&
          /low|ต่ำ|น้อย|calm/i.test(activity)
        ) score++

        // เปรียบเทียบการดูแลขน
        if (
          answers.grooming === 'easy' &&
          /low|ต่ำ|น้อย|easy/i.test(grooming)
        ) score++

        if (
          answers.grooming === 'care' &&
          /high|สูง|มาก|regular/i.test(grooming)
        ) score++

        // เปรียบเทียบนิสัย
        if (
          answers.personality === 'friendly' &&
          /friendly|affectionate|เป็นมิตร|ขี้อ้อน/i.test(personality)
        ) score++

        if (
          answers.personality === 'independent' &&
          /independent|อิสระ|รักอิสระ/i.test(personality)
        ) score++

        return { ...breed, recommendationScore: score }
      })

      results.sort(
        (a, b) => b.recommendationScore - a.recommendationScore
      )

      const topResults = results.slice(0, 3)

      // บันทึกผลเฉพาะผู้ที่เข้าสู่ระบบ
      if (userId) {
        await saveQuizResult(userId, answers, topResults)
      }

      navigate('/recommendation/result', {
        state: { results: topResults, answers },
      })
    } catch (err) {
      console.error('แนะนำสายพันธุ์แมวไม่สำเร็จ:', err)
      setError('โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="quiz-page">
      <div className="quiz-card">
        <div className="quiz-brand">
          <span className="quiz-brand-icon">🐱</span>
          <span>CATREC PERSONALITY QUIZ</span>
        </div>

        <h1>แมวแบบไหนที่เหมาะกับคุณ?</h1>
        <p className="quiz-intro">
          มาค้นหาเพื่อนตัวน้อยที่เข้ากับไลฟ์สไตล์ของคุณกัน 💗
        </p>

        <div className="quiz-progress-info">
          <span>คำถามที่ {step + 1} จาก {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div
          className="quiz-progress-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="quiz-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="quiz-question">
          <span className="quiz-question-number">
            QUESTION {question.number}
          </span>

          <h2>{question.title}</h2>
          <p>{question.description}</p>
        </div>

        <div className="quiz-options">
          {question.options.map((option) => {
            const selected = answers[question.key] === option.value

            return (
              <button
                type="button"
                key={option.value}
                className={`quiz-option ${selected ? 'selected' : ''}`}
                onClick={() => chooseAnswer(option.value)}
                aria-pressed={selected}
              >
                <span className="quiz-option-icon">{option.icon}</span>

                <span className="quiz-option-text">
                  <strong>{option.title}</strong>
                  <small>{option.detail}</small>
                </span>

                <span className="quiz-option-check">
                  {selected ? '✓' : ''}
                </span>
              </button>
            )
          })}
        </div>

        {error && (
          <p className="quiz-error" role="alert">
            {error}
          </p>
        )}

        <div className="quiz-actions">
          {step > 0 ? (
            <button
              type="button"
              className="quiz-back-button"
              onClick={() => {
                setStep((prev) => prev - 1)
                setError('')
              }}
              disabled={loading}
            >
              ← ย้อนกลับ
            </button>
          ) : (
            <button
              type="button"
              className="quiz-back-button"
              onClick={() => navigate('/')}
            >
              ← หน้าหลัก
            </button>
          )}

          <button
            type="button"
            className="quiz-next-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? 'กำลังค้นหา...'
              : step === questions.length - 1
                ? 'ค้นหาแมวที่ใช่ ✨'
                : 'ข้อต่อไป →'}
          </button>
        </div>

        <p className="quiz-footer">
          🐾 ทุกคำตอบจะช่วยค้นหาเพื่อนตัวน้อยที่เหมาะกับคุณ
        </p>
      </div>
    </section>
  )
}

export default RecommendationPage
