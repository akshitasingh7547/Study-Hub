import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import SubjectIndex from './pages/SubjectIndex'
import StudyHall from './pages/StudyHall'
import ExamHall from './pages/ExamHall'
import AssignmentStudio from "./pages/AssignmentStudio";
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
import Auth from './pages/Auth'
import UserMenu from './components/UserMenu'
import Atmosphere from './Atmosphere'
import FloatingGuide from './components/FloatingGuide'

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
  <>
    <Atmosphere />
    <FloatingGuide />

    <div className="flex min-h-screen bg-[#070807]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-72' : 'ml-20'
        }`}
      >
        <div className="sticky top-0 z-40 flex justify-end border-b border-amber-300/15 bg-[#0b0d0b]/90 px-8 py-4 shadow-lg shadow-black/20 backdrop-blur">
          <UserMenu user={user} onLogout={handleLogout} />
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subjects" element={<SubjectIndex />} />
          <Route path="/study-hall" element={<StudyHall />} />
          <Route path="/exam-hall" element={<ExamHall />} />
          <Route path="/assignment-studio" element={<AssignmentStudio />} />
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
          <Route path="/youtube" element={<SkillPage areaTitle="YouTube Automation Studio" />} />
          <Route path="/skills" element={<SkillsTracker />} />
          <Route path="/stock-market" element={<StockMarket />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  </>
)
}

export default App
