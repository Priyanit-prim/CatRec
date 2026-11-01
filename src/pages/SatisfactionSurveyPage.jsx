import { useState } from "react";
import { push, ref, serverTimestamp, set } from "firebase/database";
import { auth, database } from "../services/firebase";
import "../styles/SatisfactionSurveyPage.css";

const questions = [
  ["usability", "ความสะดวกในการใช้งานเว็บไซต์"],
  ["breed_information", "ความครบถ้วนของข้อมูลสายพันธุ์แมว"],
  ["interface", "ความเข้าใจง่ายของหน้าจอ"],
  ["recommendation", "ประโยชน์ของระบบแนะนำสายพันธุ์แมว"],
  ["overall_satisfaction", "ความพึงพอใจโดยรวม"],
];

const choices = [
  [5, "มากที่สุด"],
  [4, "มาก"],
  [3, "ปานกลาง"],
  [2, "น้อย"],
  [1, "น้อยที่สุด"],
];

export default function SatisfactionSurveyPage() {
  const [ratings, setRatings] = useState({});
  const [suggestion, setSuggestion] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (questions.some(([key]) => !ratings[key])) {
      setMessage("กรุณาตอบแบบประเมินให้ครบทุกข้อ");
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      setMessage("กรุณาเข้าสู่ระบบก่อนส่งแบบประเมิน");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const item = push(ref(database, "satisfaction_surveys"));

      await set(item, {
        ...ratings,
        suggestion: suggestion.trim(),
        user_id: currentUser.uid,
        user_email: currentUser.email || "",
        user_name: currentUser.displayName || "",
        created_at: serverTimestamp(),
      });

      setRatings({});
      setSuggestion("");
      setMessage("ขอบคุณค่ะ บันทึกแบบประเมินเรียบร้อยแล้ว");
    } catch (err) {
      console.error("บันทึกแบบประเมินไม่สำเร็จ:", err);
      setMessage(
        "บันทึกไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อ Firebase และสิทธิ์ Database Rules"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="survey-page">
      <section className="survey-card">
        <p className="survey-eyebrow">CATREC FEEDBACK</p>
        <h1>แบบประเมินความพึงพอใจ</h1>
        <p className="survey-intro">
          ความคิดเห็นของคุณช่วยให้เราปรับปรุงเว็บไซต์ CatRec ให้ดียิ่งขึ้น
        </p>
        <p className="survey-scale">
          ระดับคะแนน: 5 มากที่สุด · 4 มาก · 3 ปานกลาง · 2 น้อย · 1 น้อยที่สุด
        </p>

        <form onSubmit={submit}>
          {questions.map(([key, label], i) => (
            <fieldset className="survey-question" key={key}>
              <legend>
                {i + 1}. {label} <span>*</span>
              </legend>

              <div className="survey-options">
                {choices.map(([value, caption]) => (
                  <label key={value} className="survey-option">
                    <input
                      type="radio"
                      name={key}
                      value={value}
                      checked={ratings[key] === value}
                      onChange={() =>
                        setRatings((old) => ({ ...old, [key]: value }))
                      }
                    />
                    <span>
                      {value} — {caption}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <label className="survey-label" htmlFor="suggestion">
            ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)
          </label>

          <textarea
            id="suggestion"
            rows="4"
            maxLength="1000"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="อยากให้ CatRec ปรับปรุงอะไรเพิ่มเติม?"
          />

          {message && (
            <p className="survey-message" role="status">
              {message}
            </p>
          )}

          <button className="survey-submit" disabled={busy}>
            {busy ? "กำลังบันทึก..." : "ส่งแบบประเมิน"}
          </button>
        </form>
      </section>
    </main>
  );
}
