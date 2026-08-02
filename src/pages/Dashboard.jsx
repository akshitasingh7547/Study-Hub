import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Circle, CheckCircle2, Clock3, Plus } from 'lucide-react'

const storageKey = 'studyHub.monthCommandCenter'
const weeklyKey = 'studyHub.weeklyTasks'
const timetableKey = 'studyHub.timetable'

const readCommandCenter = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey))
    return saved || {}
  } catch {
    return {}
  }
}

const readWeekly = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(weeklyKey))
    if (saved && Array.isArray(saved)) return saved
    // default weekly tasks
    return [
      { id: 'w-1', title: 'Finish JEE physics problems', module: 'jee', done: false },
      { id: 'w-2', title: 'Complete HSC notes', module: 'hsc', done: false },
      { id: 'w-3', title: 'Python practice 3x', module: 'coding', done: false },
      { id: 'w-4', title: 'Market journal entry', module: 'markets', done: false },
      { id: 'w-5', title: 'Attend 1 practical / submission', module: 'hsc', done: false },
    ]
  } catch {
    return []
  }
}

const Dashboard = () => {
  const [command, setCommand] = useState(readCommandCenter)
  const [weekly, setWeekly] = useState(readWeekly)
  const [timetable, setTimetable] = useState(() => localStorage.getItem(timetableKey) || '')

  useEffect(() => {
    localStorage.setItem(weeklyKey, JSON.stringify(weekly))
  }, [weekly])

  useEffect(() => {
    localStorage.setItem(timetableKey, timetable)
  }, [timetable])

  const todayTasks = (command.tasks || []).filter((t) => t.day === 'Today')
  const top4 = todayTasks.slice(0, 4)
  const nextTask = (command.tasks || []).find((t) => !t.done) || null

  const weeklyStats = useMemo(() => {
    const total = weekly.length || 0
    const done = weekly.filter((w) => w.done).length
    const percent = total ? Math.round((done / total) * 100) : 0
    return { total, done, percent }
  }, [weekly])

  const toggleWeekly = (id) => {
    setWeekly((cur) => cur.map((w) => (w.id === id ? { ...w, done: !w.done } : w)))
    window.dispatchEvent(new Event('weeklyTasksUpdated'))
  }

  return (
    <div className="min-h-screen p-6 bg-black text-gray-100">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400 flex items-center gap-2"><CalendarDays /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            <h1 className="text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>Today’s Mission</h1>
          </div>

          <div className="w-56 bg-gray-900/60 p-3 rounded-md">
            <p className="text-xs text-gray-400">Reward progress</p>
            <div className="w-full h-3 bg-gray-800 rounded mt-2 overflow-hidden">
              <div className="h-full bg-yellow-500" style={{ width: `${weeklyStats.percent}%` }} />
            </div>
            <p className="mt-2 text-sm font-semibold">{weeklyStats.done}/{weeklyStats.total} weekly tasks done ({weeklyStats.percent}%)</p>
            <Link to="/rewards" className="mt-3 inline-block text-sm text-yellow-400 hover:underline">Open rewards</Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/60 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-3">Today — Top tasks</h2>
            {top4.length === 0 ? (
              <p className="text-gray-400">No tasks for today. Add one below.</p>
            ) : (
              <ul className="space-y-2">
                {top4.map((task) => (
                  <li key={task.id} className={`flex items-center justify-between p-3 rounded ${task.done ? 'opacity-60 line-through text-gray-500' : 'bg-gray-800/40'}`}>
                    <div className="flex items-center gap-3">
                      <button onClick={() => {
                        setCommand((c) => ({ ...c, tasks: c.tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t) }))
                      }}>
                        {task.done ? <CheckCircle2 /> : <Circle />}
                      </button>

                      <div>
                        <div className="font-semibold">{task.title}</div>
                        <div className="text-xs text-gray-400">{task.lane} • {task.priority}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{task.day}</div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4">
              <Link to="/study-hall" className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded font-semibold">Start Focus Session</Link>
            </div>
          </div>

          <div className="bg-gray-900/60 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-3">Timetable (today)</h2>
            <textarea value={timetable} onChange={(e) => setTimetable(e.target.value)} placeholder="Add time blocks: 8:00-9:30 Physics" className="w-full min-h-[180px] bg-transparent border border-gray-800 p-3 rounded text-sm" />

            <div className="mt-4">
              <h3 className="text-sm font-semibold">Next task</h3>
              {nextTask ? (
                <div className="mt-2 p-3 bg-gray-800/40 rounded">
                  <div className="font-semibold">{nextTask.title}</div>
                  <div className="text-xs text-gray-400">{nextTask.lane} • {nextTask.priority}</div>
                </div>
              ) : (
                <p className="text-gray-400">No upcoming tasks.</p>
              )}
            </div>
          </div>
        </section>

        <section className="bg-gray-900/60 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Weekly Tasks (quick)</h3>
            <Link to="/weekly-tasks" className="text-sm text-yellow-400 hover:underline">Open full</Link>
          </div>

          <div className="mt-3 grid gap-2">
            {weekly.slice(0,4).map((w) => (
              <button key={w.id} onClick={() => toggleWeekly(w.id)} className={`flex items-center gap-3 p-3 rounded ${w.done ? 'bg-green-700/30' : 'bg-gray-800/30'}`}>
                {w.done ? <CheckCircle2 /> : <Circle />}
                <div className="text-sm text-left">{w.title}<div className="text-xs text-gray-400">{w.module}</div></div>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

export default Dashboard
