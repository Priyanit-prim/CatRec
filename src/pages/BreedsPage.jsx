
import { useEffect, useState } from 'react'
import SearchBar from '../components/common/SearchBar'
import BreedList from '../components/breed/BreedList'
import { getAllBreeds } from '../services/breedService'

function BreedsPage() {
  const [search, setSearch] = useState('')
  const [breeds, setBreeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 9

  useEffect(() => {
    async function loadBreeds() {
      try {
        const data = await getAllBreeds()
        setBreeds(data)
      } catch (err) {
        console.error('โหลดข้อมูลสายพันธุ์แมวไม่สำเร็จ:', err)
        setError('ไม่สามารถโหลดข้อมูลแมวได้ กรุณาตรวจสอบ Firebase')
      } finally {
        setLoading(false)
      }
    }

    loadBreeds()
  }, [])

  const filteredBreeds = breeds.filter((breed) =>
    `${breed.name_th || ''} ${breed.name_en || ''}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  )

  const totalPages = Math.ceil(filteredBreeds.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentBreeds = filteredBreeds.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <main className="breeds-page">
      <section className="featured-section">
        <div className="section-heading">
          <p className="section-label">DISCOVER CATS</p>
          <h1>สายพันธุ์แมวทั้งหมด</h1>
          <p>ค้นหาข้อมูลลักษณะ นิสัย และการดูแลแมวแต่ละสายพันธุ์</p>
        </div>

        <SearchBar
          search={search}
          setSearch={(value) => {
            setSearch(value)
            setCurrentPage(1)
          }}
          onSearch={() => setCurrentPage(1)}
        />

        {loading ? (
          <p>กำลังโหลดข้อมูลแมว...</p>
        ) : error ? (
          <p className="empty-message">{error}</p>
        ) : filteredBreeds.length === 0 ? (
          <p className="empty-message">ไม่พบสายพันธุ์แมวที่ค้นหา</p>
        ) : (
          <>
            <BreedList breeds={currentBreeds} />

            <div className="pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
              >
                ← ก่อนหน้า
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  type="button"
                  key={index + 1}
                  className={currentPage === index + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
              >
                ถัดไป →
              </button>
            </div>

            <p className="pagination-info">
              แสดง {startIndex + 1}–{Math.min(
                startIndex + itemsPerPage,
                filteredBreeds.length
              )} จาก {filteredBreeds.length} สายพันธุ์
            </p>
          </>
        )}
      </section>
    </main>
  )
}

export default BreedsPage
