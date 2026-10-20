
import { useLocation, Link } from 'react-router-dom'

function RecommendationResultPage() {
  const location = useLocation()
  const results = location.state?.results || []

  if (results.length === 0) {
    return (
      <section className="featured-section">
        <div className="section-heading">
          <h1>🐱 ผลการแนะนำสายพันธุ์แมว</h1>
          <p>กรุณาตอบแบบสอบถามก่อน เพื่อค้นหาแมวที่เหมาะกับคุณ</p>
          <Link to="/recommendation">เริ่มทำแบบสอบถาม</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="featured-section">
      <div className="section-heading">
        <p className="section-label">YOUR MATCH</p>
        <h1>🐱 สายพันธุ์แมวที่เหมาะกับคุณ</h1>
        <p>ผลลัพธ์จากคำตอบในแบบสอบถามของคุณ</p>
      </div>

      <div className="breed-list">
        {results.map((breed, index) => {
          const imageFile = breed.image_thumbnail
            ? `${breed.image_thumbnail}.webp`
            : `cat_${breed.breed_id}_thumb.webp.webp`

          return (
            <article className="breed-card" key={breed.breed_id}>
              <img
                src={`/images/image_thumbnail/${imageFile}`}
                alt={breed.name_en || 'Cat breed'}
                className="breed-card-image"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />

              <div className="breed-card-content">
                <p>อันดับ {index + 1}</p>
                <h3>{breed.name_th || breed.name_en}</h3>
                <p>{breed.name_en}</p>
                <p>{breed.personality || 'ยังไม่มีข้อมูลนิสัย'}</p>
                <p>
                  คะแนนความเหมาะสม: {breed.recommendationScore} คะแนน
                </p>
                <Link to={`/breeds/${breed.breed_id}`}>
                  ดูรายละเอียด
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <div className="section-heading">
        <Link to="/recommendation">ทำแบบสอบถามอีกครั้ง</Link>
      </div>
    </section>
  )
}

export default RecommendationResultPage
