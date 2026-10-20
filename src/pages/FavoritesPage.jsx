
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { getFavorites } from '../services/favoriteService'
import { getAllBreeds } from '../services/breedService'
import BreedList from '../components/breed/BreedList'

function FavoritesPage() {
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [breeds, setBreeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthChecked(true)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!authChecked) return

    async function loadFavorites() {
      setLoading(true)
      setError('')

      if (!user) {
        setBreeds([])
        setLoading(false)
        return
      }

      try {
        const [favoriteIds, allBreeds] = await Promise.all([
          getFavorites(user.uid),
          getAllBreeds(),
        ])

        const favoriteSet = new Set(favoriteIds.map(String))
        setBreeds(
          allBreeds.filter((breed) =>
            favoriteSet.has(String(breed.breed_id)),
          ),
        )
      } catch (err) {
        console.error('โหลดรายการโปรดไม่สำเร็จ:', err)
        setError('ไม่สามารถโหลดรายการโปรดได้ กรุณาลองใหม่')
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [user, authChecked])

  return (
    <section className="featured-section">
      <div className="section-heading">
        <p className="section-label">MY COLLECTION</p>
        <h1>♡ รายการโปรดของฉัน</h1>
        <p>สายพันธุ์แมวที่คุณบันทึกไว้</p>
      </div>

      {!authChecked || loading ? (
        <p>กำลังโหลดรายการโปรด...</p>
      ) : !user ? (
        <div className="empty-message">
          <p>กรุณาเข้าสู่ระบบเพื่อดูรายการโปรด</p>
          <Link to="/login">เข้าสู่ระบบ</Link>
        </div>
      ) : error ? (
        <p className="empty-message">{error}</p>
      ) : breeds.length === 0 ? (
        <div className="empty-message">
          <p>ยังไม่มีสายพันธุ์แมวในรายการโปรด</p>
          <Link to="/">ไปเลือกสายพันธุ์แมว</Link>
        </div>
      ) : (
        <BreedList breeds={breeds} />
      )}
    </section>
  )
}

export default FavoritesPage
