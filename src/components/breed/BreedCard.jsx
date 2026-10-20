
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../services/firebase'
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../../services/favoriteService'

function BreedCard({ breed }) {
  const [user, setUser] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const imageFile = breed.image_thumbnail
    ? `${breed.image_thumbnail}.webp`
    : `cat_${breed.breed_id}_thumb.webp.webp`

  const imagePath = `/images/image_thumbnail/${imageFile}`

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    let active = true

    async function checkFavorite() {
      if (!user) {
        setIsFavorite(false)
        return
      }

      try {
        const ids = await getFavorites(user.uid)
        if (active) {
          setIsFavorite(
            ids.some((id) => String(id) === String(breed.breed_id))
          )
        }
      } catch (error) {
        console.error('ตรวจสอบรายการโปรดไม่สำเร็จ:', error)
      }
    }

    checkFavorite()

    return () => {
      active = false
    }
  }, [user, breed.breed_id])

  async function handleFavorite() {
    if (!user) {
      setMessage('กรุณาเข้าสู่ระบบก่อนเพิ่มรายการโปรด')
      return
    }

    if (saving) return

    setSaving(true)
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
    } catch (error) {
      console.error('บันทึกรายการโปรดไม่สำเร็จ:', error)
      setMessage('บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="breed-card">
      <div className="breed-card-image-wrapper">
        <img
          src={imagePath}
          alt={breed.name_en || 'Cat breed'}
          className="breed-card-image"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />

        <button
          type="button"
          className={`card-favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={handleFavorite}
          disabled={saving}
          aria-label={isFavorite ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
          title={isFavorite ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <div className="breed-card-content">
        <h3>{breed.name_th || breed.name_en}</h3>
        <p>{breed.name_en}</p>
        <p>{breed.personality || 'ยังไม่มีข้อมูลนิสัย'}</p>

        <Link to={`/breeds/${breed.breed_id}`}>
          ดูรายละเอียด
        </Link>

        {message && <p className="favorite-message" role="status">{message}</p>}
      </div>
    </article>
  )
}

export default BreedCard
