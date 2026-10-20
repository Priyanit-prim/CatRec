
import { useEffect, useState } from 'react'
import SearchBar from '../components/common/SearchBar'
import BreedList from '../components/breed/BreedList'
import { getAllBreeds } from '../services/breedService'

function HomePage() {
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
      .includes(search.toLowerCase().trim()),
  )

  const totalPages = Math.ceil(filteredBreeds.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentBreeds = filteredBreeds.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  function handleSearch() {
    setCurrentPage(1)
    document.getElementById('featured-breeds')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  function handleSearchChange(value) {
    setSearch(value)
    setCurrentPage(1)
  }

  function goToPage(page) {
    setCurrentPage(page)
    document.getElementById('featured-breeds')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">CAT BREED GUIDE</p>
          <h1>ค้นหาสายพันธุ์แมวที่ใช่สำหรับคุณ</h1>
          <p>
            เรียนรู้ลักษณะ นิสัย และการดูแลแมวแต่ละสายพันธุ์
            เพื่อเลือกเพื่อนตัวน้อยที่เหมาะกับคุณ
          </p>

          <SearchBar
            search={search}
            setSearch={handleSearchChange}
            onSearch={handleSearch}
          />
        </div>
      </section>

      <section id="featured-breeds" className="featured-section">
        <div className="section-heading">
          <p className="section-label">DISCOVER CATS</p>
          <h2>สายพันธุ์แมว</h2>
          <p>ข้อมูลสายพันธุ์แมวจากฐานข้อมูล CatRec</p>
        </div>

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
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← ก่อนหน้า
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  type="button"
                  key={index + 1}
                  className={
                    currentPage === index + 1 ? 'active' : ''
                  }
                  onClick={() => goToPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ถัดไป →
              </button>
            </div>

            <p className="pagination-info">
              แสดง {startIndex + 1}–{Math.min(
                startIndex + itemsPerPage,
                filteredBreeds.length,
              )} จาก {filteredBreeds.length} สายพันธุ์
            </p>
          </>
        )}
      </section>
    </main>
  )
}

export default HomePage
