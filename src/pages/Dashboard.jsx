import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock3, Target, Trophy, BookOpen, ArrowRight, Briefcase } from 'lucide-react'
import { jeeMainSyllabus, skillAreas } from '../data/studyHubData'

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback
  } catch {
    return fallback
  }
}

const getWeeklyCards = (weeklyBoard = {}) => {
  return Object.entries(weeklyBoard).flatMap(([day, sessions]) => {
    return Object.entries(sessions || {}).flatMap(([session, cards]) => {
      return (cards || []).map((card) => ({
        ...card,
        day,
        session,
      }))
    })
  })
}

const toLocalDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const Dashboard = () => {
  const [now, setNow] = useState(new Date())
  const [studyHall, setStudyHall] = useState({ todos: [] })
  const [planner, setPlanner] = useState({ events: [], timetable: [] })
  const [skills, setSkills] = useState({ progress: {} })
  const [jeeProgress, setJeeProgress] = useState({})

  const refreshData = () => {
    setStudyHall(readJson('studyHub.studyHall', { todos: [] }))
    setPlanner(readJson('studyHub.planner', { events: [], timetable: [] }))
    setSkills(readJson('studyHub.skills', { progress: {} }))
    setJeeProgress(readJson('studyHub.jeePrep', {}))
  }

  useEffect(() => {
    refreshData()
    const timer = setInterval(() => setNow(new Date()), 1000)
    window.addEventListener('studyHubProgressUpdated', refreshData)
    window.addEventListener('studyHubPlannerUpdated', refreshData)
    return () => {
      clearInterval(timer)
      window.removeEventListener('studyHubProgressUpdated', refreshData)
      window.removeEventListener('studyHubPlannerUpdated', refreshData)
    }
  }, [])

  const studyStats = useMemo(() => {
    const todos = studyHall.todos || []
    const completed = todos.filter((todo) => todo.completed).length
    return {
      completed,
      total: todos.length,
      percent: todos.length ? Math.round((completed / todos.length) * 100) : 0,
    }
  }, [studyHall])

  const skillStats = useMemo(() => {
    const total = skillAreas.reduce((sum, area) => sum + area.tracks.length, 0)
    const completed = skillAreas.reduce((sum, area) => {
      return sum + area.tracks.filter((track) => skills.progress?.[`${area.title}:${track}`]).length
    }, 0)
    return {
      completed,
      total,
      percent: total ? Math.round((completed / total) * 100) : 0,
    }
  }, [skills])

  const jeeStats = useMemo(() => {
    const subjects = Object.keys(jeeMainSyllabus)
    const total = subjects.reduce((sum, subject) => sum + jeeMainSyllabus[subject].length, 0)
    const completed = subjects.reduce((sum, subject) => {
      return sum + jeeMainSyllabus[subject].filter((chapter) => jeeProgress[`${subject}:${chapter}`]).length
    }, 0)
    return {
      completed,
      total,
      percent: total ? Math.round((completed / total) * 100) : 0,
    }
  }, [jeeProgress])

  const todayIso = toLocalDate(now)
  const todayEvents = (planner.events || []).filter((event) => event.date === todayIso)
  const upcomingEvents = (planner.events || []).filter((event) => event.date >= todayIso).slice(0, 5)
  const weeklyCards = getWeeklyCards(planner.weeklyBoard)
  const filledTimetable = weeklyCards.length
    ? weeklyCards
    : (planner.timetable || []).filter((block) => block.task || block.details)
  const displayTimetable = filledTimetable.length ? filledTimetable : planner.timetable || []

  const today = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const stats = [
    { title: 'Study Hall', value: `${studyStats.percent}%`, sub: `${studyStats.completed}/${studyStats.total} tasks`, icon: Clock3, color: 'bg-blue-500' },
    { title: 'Skills', value: `${skillStats.percent}%`, sub: `${skillStats.completed}/${skillStats.total} tracks`, icon: Trophy, color: 'bg-green-600' },
    { title: 'JEE Main', value: `${jeeStats.percent}%`, sub: `${jeeStats.completed}/${jeeStats.total} units`, icon: Target, color: 'bg-orange-500' },
    { title: 'Events Today', value: todayEvents.length, sub: `${upcomingEvents.length} upcoming`, icon: CalendarDays, color: 'bg-purple-600' },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slytherin-700 via-slytherin-800 to-slytherin-900 text-white shadow-xl p-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold mb-3">Welcome back, Akshita.</h1>
            <p className="text-slytherin-100 text-lg">This dashboard starts empty and grows only when you add real study data.</p>
            <p className="mt-4 text-slytherin-200 max-w-2xl leading-7">
              Add events in Calendar, fill your timetable, complete Study Hall tasks, and mark JEE units as done.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 min-w-[260px]">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays size={20} />
              <h3 className="font-semibold">Today</h3>
            </div>
            <p className="text-lg">{today}</p>
            <div className="mt-6 flex items-center gap-3">
              <Clock3 />
              <p className="text-2xl font-bold">{now.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="text-slate-500 text-sm">{card.title}</p>
                <h2 className="text-3xl font-bold mt-2 text-slate-800">{card.value}</h2>
                <p className="text-sm text-slate-500 mt-1">{card.sub}</p>
              </div>
              <div className={`${card.color} p-4 rounded-2xl text-white`}>
                <card.icon size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Target className="text-slytherin-600" />
              <h2 className="text-2xl font-bold text-slate-800">Today's Mission</h2>
            </div>
            <Link to="/calendar" className="text-slytherin-700 font-bold inline-flex items-center gap-2">
              Edit calendar <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {todayEvents.length === 0 && filledTimetable.length === 0 ? (
              <div className="p-5 rounded-xl bg-slate-50 text-slate-600">
                No missions yet. Add calendar events or timetable blocks in Calendar and Timetable.
              </div>
            ) : (
              <>
                {todayEvents.map((event) => (
                  <div key={event.id} className="p-4 rounded-xl bg-slytherin-50 border-l-4 border-slytherin-600">
                    <p className="font-bold text-slytherin-900">{event.title}</p>
                    <p className="text-sm text-slytherin-600">{event.type} - {event.subject}</p>
                  </div>
                ))}
                {filledTimetable.slice(0, 6).map((block) => (
                  <div key={block.cardId || block.id} className="p-4 rounded-xl bg-slate-50">
                    <p className="font-bold text-slate-800">{block.day ? `${block.day}: ${block.title}` : `${block.block}: ${block.task || 'No task title'}`}</p>
                    <p className="text-sm text-slate-500">{block.day ? block.session : block.details || 'No details added'}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slytherin-900 mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-slytherin-600">No events saved yet.</p>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-slytherin-50 rounded-lg">
                  <p className="font-bold text-slytherin-900">{event.title}</p>
                  <p className="text-xs text-slytherin-600">{event.date} - {event.type}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slytherin-900 mb-6">Timetable Blocks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayTimetable.length === 0 ? (
              <p className="text-slytherin-600">Open Calendar and Timetable to create your 8 blocks.</p>
            ) : (
              displayTimetable.map((block) => (
                <div key={block.cardId || block.id} className="p-4 rounded-xl bg-slytherin-50">
                  <p className="font-bold text-slytherin-900">{block.day ? `${block.day} - ${block.title}` : block.block}</p>
                  <p className="text-sm text-slytherin-600">{block.day ? block.session : block.task || 'Empty block'}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slytherin-900 mb-6">Skills and JEE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillAreas.map((area) => (
              <Link key={area.title} to={area.route} className="p-4 rounded-xl bg-slate-50 hover:bg-slytherin-50 transition">
                <div className="flex items-start gap-3">
                  <Briefcase className="text-slytherin-700 mt-1" size={20} />
                  <div>
                    <p className="font-bold text-slytherin-900">{area.title}</p>
                    <p className="text-sm text-slate-600">{area.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-slytherin-700" />
            <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Link to="/study-hall" className="bg-slytherin-700 hover:bg-slytherin-800 text-white rounded-xl p-5 transition font-semibold text-center">
            Start Study
          </Link>
          <Link to="/calendar" className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-5 transition font-semibold text-center">
            Calendar
          </Link>
          <Link to="/coding" className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-5 transition font-semibold text-center">
            Coding Hub
          </Link>
          <Link to="/jee-prep" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 transition font-semibold text-center">
            JEE Prep
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
