
import { ref, push, set } from 'firebase/database'
import { database } from './firebase'

export async function saveQuizResult(userId, answers, results) {
  if (!userId) return

  const resultsRef = ref(database, `quiz_results/${userId}`)
  const newResultRef = push(resultsRef)

  await set(newResultRef, {
    answers,
    recommended_breeds: results.map((breed) => ({
      breed_id: breed.breed_id,
      name_en: breed.name_en || '',
      name_th: breed.name_th || '',
      score: breed.recommendationScore || 0,
    })),
    created_at: new Date().toISOString(),
  })
}
