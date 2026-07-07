import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import SubjectIndex from './pages/SubjectIndex'
import StudyHall from './pages/StudyHall'
import ExamHall from './pages/ExamHall'
import Planner from './pages/Planner'
import CalendarPage from './pages/CalendarPage'
import Library from './pages/Library'
import FreeCourses from './pages/FreeCourses'
import CareerVault from './pages/CareerVault'
import Analytics from './pages/Analytics'
import NotebookLM from './pages/NotebookLM'
import StockMarket from './pages/StockMarket'
import SkillPage from './pages/SkillPage'
import SkillsTracker from './pages/SkillsTracker'
import JeePrep from './pages/JeePrep'
import Achievements from './pages/Achievements'
import ZodiacPage from './pages/ZodiacPage'
import Auth from './pages/Auth'
import UserMenu from './components/UserMenu'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Auth />
  }

  return (
      <div className="flex min-h-screen bg-slytherin-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
          {/* Top Bar */}
          <div className="bg-white shadow-sm sticky top-0 z-40 px-8 py-4 flex justify-end">
            <UserMenu user={user} onLogout={handleLogout} />
          </div>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subjects" element={<SubjectIndex />} />
            <Route path="/study-hall" element={<StudyHall />} />
            <Route path="/exam-hall" element={<ExamHall />} />
            <Route path="/jee-prep" element={<JeePrep />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/library" element={<Library />} />
            <Route path="/free-courses" element={<FreeCourses />} />
            <Route path="/career" element={<CareerVault />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notebooklm" element={<NotebookLM />} />
            <Route path="/coding" element={<SkillPage areaTitle="Coding Hub" />} />
            <Route path="/english-fluency" element={<SkillPage areaTitle="English Fluency Academy" />} />
            <Route path="/writing-skills" element={<SkillPage areaTitle="Writing Skills" />} />
            <Route path="/skills" element={<SkillsTracker />} />
            <Route path="/stock-market" element={<StockMarket />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/zodiac" element={<ZodiacPage />} />
            <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </main>
      </div>
  )
}

export default App
