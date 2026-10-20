
import {
  get,
  ref,
  push,
  set,
  remove,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database'
import { database } from './firebase'

// ดึงรายการโปรดของผู้ใช้
export async function getFavorites(userId) {
  const favoritesQuery = query(
    ref(database, 'favorites'),
    orderByChild('user_id'),
    equalTo(userId)
  )

  const snapshot = await get(favoritesQuery)

  if (!snapshot.exists()) return []

  return Object.values(snapshot.val()).map(
    (item) => item.breed_id
  )
}

// เพิ่มสายพันธุ์ในรายการโปรด
export async function addFavorite(userId, breedId) {
  const favoriteIds = await getFavorites(userId)

  if (favoriteIds.some((id) => String(id) === String(breedId))) {
    return
  }

  const newFavoriteRef = push(ref(database, 'favorites'))

  await set(newFavoriteRef, {
    favorite_id: newFavoriteRef.key,
    user_id: userId,
    breed_id: breedId,
    created_at: new Date().toISOString().slice(0, 10),
  })
}

// ลบสายพันธุ์ออกจากรายการโปรด
export async function removeFavorite(userId, breedId) {
  const favoritesQuery = query(
    ref(database, 'favorites'),
    orderByChild('user_id'),
    equalTo(userId)
  )

  const snapshot = await get(favoritesQuery)

  if (!snapshot.exists()) return

  const favorites = snapshot.val()

  for (const [key, item] of Object.entries(favorites)) {
    if (String(item.breed_id) === String(breedId)) {
      await remove(ref(database, `favorites/${key}`))
    }
  }
}
