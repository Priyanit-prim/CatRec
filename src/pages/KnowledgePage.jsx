
import { Link } from 'react-router-dom'

const topics = [
  {
    icon: '🥣',
    title: 'การให้อาหารแมว',
    description:
      'เลือกอาหารให้เหมาะกับช่วงวัย จัดเตรียมน้ำสะอาดไว้เสมอ และให้อาหารในปริมาณที่เหมาะสม',
    tips: [
      'เลือกอาหารที่เหมาะกับวัยของแมว',
      'มีน้ำสะอาดให้แมวดื่มตลอดเวลา',
      'หลีกเลี่ยงอาหารที่เป็นอันตรายต่อแมว',
    ],
  },
  {
    icon: '🧼',
    title: 'การดูแลสุขภาพและความสะอาด',
    description:
      'ดูแลกระบะทราย แปรงขน และสังเกตความผิดปกติของแมวเป็นประจำ',
    tips: [
      'ทำความสะอาดกระบะทรายสม่ำเสมอ',
      'แปรงขนตามลักษณะขนของแต่ละสายพันธุ์',
      'พาไปตรวจสุขภาพและฉีดวัคซีนตามคำแนะนำสัตวแพทย์',
    ],
  },
  {
    icon: '🏠',
    title: 'การเตรียมบ้านให้เหมาะกับแมว',
    description:
      'จัดพื้นที่พักผ่อนและพื้นที่เล่นที่ปลอดภัย เพื่อให้แมวได้ใช้ชีวิตอย่างสบายใจ',
    tips: [
      'จัดที่นอนในบริเวณสงบ',
      'มีที่ลับเล็บและของเล่นที่เหมาะสม',
      'เก็บสายไฟและสิ่งของอันตรายให้พ้นจากแมว',
    ],
  },
  {
    icon: '🐾',
    title: 'การเข้าใจพฤติกรรมแมว',
    description:
      'แมวแต่ละตัวมีบุคลิกต่างกัน การสังเกตภาษากายช่วยให้เข้าใจความต้องการของแมวได้ดีขึ้น',
    tips: [
      'ให้แมวมีเวลาปรับตัวกับสถานที่ใหม่',
      'เล่นกับแมวอย่างสม่ำเสมอ',
      'ไม่บังคับเมื่อแมวต้องการพื้นที่ส่วนตัว',
    ],
  },
]

function KnowledgePage() {
  return (
    <main className="knowledge-page">
      <section className="knowledge-hero">
        <p className="section-label">CAT CARE GUIDE</p>
        <h1>ความรู้เกี่ยวกับแมว</h1>
        <p>
          รวมคำแนะนำเบื้องต้นสำหรับการดูแลเพื่อนตัวน้อย
          ให้มีสุขภาพดีและมีความสุข
        </p>
      </section>

      <section className="knowledge-grid">
        {topics.map((topic) => (
          <article className="knowledge-card" key={topic.title}>
            <div className="knowledge-icon">{topic.icon}</div>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>

            <h3>คำแนะนำ</h3>
            <ul>
              {topic.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <div className="knowledge-footer">
        <p>อยากรู้จักแมวแต่ละสายพันธุ์เพิ่มเติมไหม?</p>
        <Link to="/breeds">ดูสายพันธุ์แมว →</Link>
      </div>
    </main>
  )
}

export default KnowledgePage
