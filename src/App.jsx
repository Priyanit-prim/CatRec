
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import BreedsPage from './pages/BreedsPage'
import BreedDetailPage from './pages/BreedDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RecommendationPage from './pages/RecommendationPage'
import RecommendationResultPage from './pages/RecommendationResultPage'
import FavoritesPage from './pages/FavoritesPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import QuizHistoryPage from './pages/QuizHistoryPage'
import KnowledgePage from './pages/KnowledgePage'
import SatisfactionSurveyPage from './pages/SatisfactionSurveyPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  const [search, setSearch] = useState('')

  return (
    <BrowserRouter>
      <Header />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                search={search}
                setSearch={setSearch}
              />
            }
          />

          <Route
            path="/knowledge"
            element={<KnowledgePage />}
          />

          <Route
            path="/recommendation"
            element={<RecommendationPage />}
          />

          <Route
            path="/recommendation/result"
            element={<RecommendationResultPage />}
          />

          <Route
            path="/favorites"
            element={<FavoritesPage />}
          />

          <Route
            path="/quiz-history"
            element={<QuizHistoryPage />}
          />

          <Route
            path="/change-password"
            element={<ChangePasswordPage />}
          />

          <Route
            path="/breeds"
            element={<BreedsPage />}
          />

          <Route
            path="/breeds/:id"
            element={<BreedDetailPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/satisfaction-survey"
            element={<SatisfactionSurveyPage />}
          />

          <Route
            path="/admin"
            element={<AdminPage />}
          />

          <Route
            path="*"
            element={
              <section className="auth-page">
                <div className="auth-card">
                  <h1>ไม่พบหน้าที่ต้องการ</h1>
                  <a href="/">กลับหน้าหลัก</a>
                </div>
              </section>
            }
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  )
}

export default App
