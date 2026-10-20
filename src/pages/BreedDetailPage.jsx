
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { getBreedById } from '../services/breedService'
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../services/favoriteService'
import { auth } from '../services/firebase'

function BreedDetailPage() {
  const { id } = useParams()
  const [breed, setBreed] = useState(null)
  const [user, setUser] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    async function loadBreed() {
      setLoading(true)
      setError('')

      try {
        const data = await getBreedById(id)
        setBreed(data)
      } catch (err) {
        console.error('โหลดข้อมูลแมวไม่สำเร็จ:', err)
        setError('ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบ Firebase')
      } finally {
        setLoading(false)
      }
    }

    loadBreed()
  }, [id])

  useEffect(() => {
    async function checkFavorite() {
      if (!user || !breed) {
        setIsFavorite(false)
        return
      }

      try {
        const favoriteIds = await getFavorites(user.uid)
        setIsFavorite(
          favoriteIds.some(
            (favoriteId) => String(favoriteId) === String(breed.breed_id)
          )
        )
      } catch (err) {
        console.error('ตรวจสอบรายการโปรดไม่สำเร็จ:', err)
      }
    }

    checkFavorite()
  }, [user, breed])

  async function handleFavorite() {
    if (!user) {
      setMessage('กรุณาเข้าสู่ระบบก่อนเพิ่มรายการโปรด')
      return
    }

    if (!breed || favoriteLoading) return

    setFavoriteLoading(true)
    setMessage('')

    try {
      if (isFavorite) {
        await removeFavorite(user.uid, breed.breed_id)
        setIsFavorite(false)
        setMessage('นำออกจากรายการโปรดแล้ว')
      } else {
        await addFavorite(user.uid, breed.breed_id)
        setIsFavorite(true)
        setMessage('เพิ่มในรายการโปรดแล้ว')
      }
    } catch (err) {
      console.error('บันทึกรายการโปรดไม่สำเร็จ:', err)
      setMessage('บันทึกไม่สำเร็จ กรุณาตรวจสอบ Firebase Rules')
    } finally {
      setFavoriteLoading(false)
    }
  }

  if (loading) return <p>กำลังโหลดข้อมูลแมว...</p>
  if (error) return <p>{error}</p>

  if (!breed) {
    return (
      <section>
        <h2>ไม่พบข้อมูลสายพันธุ์แมว</h2>
        <Link to="/">กลับหน้าหลัก</Link>
      </section>
    )
  }

  return (
    <section className="breed-detail">
      <Link to="/">← กลับหน้าหลัก</Link>

      <h1>{breed.name_th || breed.name_en}</h1>
      <p className="breed-name-en">{breed.name_en}</p>

      <img
        src={`/images/image_thumbnail/${
          breed.image_thumbnail
            ? `${breed.image_thumbnail}.webp`
            : `cat_${breed.breed_id}_thumb.webp.webp`
        }`}
        alt={breed.name_en || 'Cat breed'}
        className="breed-detail-image"
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />

      <div className="favorite-action">
        <button
          type="button"
          onClick={handleFavorite}
          disabled={favoriteLoading}
          className="favorite-button"
        >
          {favoriteLoading
            ? 'กำลังบันทึก...'
            : isFavorite
              ? '♥ นำออกจากรายการโปรด'
              : '♡ เพิ่มในรายการโปรด'}
        </button>

        {message && <p role="status">{message}</p>}
      </div>

      <div className="breed-detail-info">
        <h2>ข้อมูลสายพันธุ์</h2>
        <p><strong>ประวัติสายพันธุ์:</strong> {breed.history || 'ยังไม่มีข้อมูล'}</p>
        <p><strong>นิสัย:</strong> {breed.personality || 'ยังไม่มีข้อมูล'}</p>
        <p><strong>ประเภทขน:</strong> {breed.category || 'ยังไม่มีข้อมูล'}</p>
        <p><strong>ระดับกิจกรรม:</strong> {breed.activity_level || 'ยังไม่มีข้อมูล'}</p>
        <p><strong>การดูแลขน:</strong> {breed.grooming_level || 'ยังไม่มีข้อมูล'}</p>
        <p><strong>โภชนาการ:</strong> {breed.nutrition || 'ยังไม่มีข้อมูล'}</p>
        <p><strong>สุขภาพที่ควรใส่ใจ:</strong> {breed.health_risks || 'ยังไม่มีข้อมูล'}</p>
        <p><strong>ความเสี่ยงด้านภูมิแพ้:</strong> {breed.allergy_risk || 'ยังไม่มีข้อมูล'}</p>
      </div>
    </section>
  )
}

export default BreedDetailPage
