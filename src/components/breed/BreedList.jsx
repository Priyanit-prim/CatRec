
import BreedCard from './BreedCard'

function BreedList({ breeds }) {
  if (!breeds || breeds.length === 0) {
    return <p className="empty-message">ไม่พบข้อมูลสายพันธุ์แมว</p>
  }

  return (
    <div className="breed-grid">
      {breeds.map((breed) => (
        <BreedCard key={breed.breed_id} breed={breed} />
      ))}
    </div>
  )
}

export default BreedList
