
import { get, ref } from 'firebase/database'
import { database } from './firebase'

export async function getAllBreeds() {
  const snapshot = await get(ref(database, 'breeds'))

  if (!snapshot.exists()) {
    return []
  }

  return Object.values(snapshot.val())
}

export async function getBreedById(breedId) {
  const snapshot = await get(ref(database, `breeds/${breedId}`))

  if (!snapshot.exists()) {
    return null
  }

  return snapshot.val()
}
