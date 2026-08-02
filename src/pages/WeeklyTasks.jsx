import React, { useEffect, useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { Link } from 'react-router-dom'

const weeklyKey = 'studyHub.weeklyTasks'
const explorationKey = 'studyHub.exploration'

const readWeekly = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(weeklyKey))
    if (saved && Array.isArray(saved)) return saved
    return []
  } catch { return [] }
}

const readExploration = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(explorationKey))
    if (saved && Array.isArray(saved)) return saved
    return [
      { id: 'e-1', title: 'Maharashtra Nature Park' },
      { id: 'e-2', title: 'IIT / Tech Campus Visit' },
      { id: 'e-3', title: 'Science Museum' },
    ]
  } catch { return [] }
}

const WeeklyTasks = () => {
  const [weekly, setWeekly] = useState(readWeekly)
  const [explore, setExplore] = useState(readExploration)
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    localStorage.setItem(weeklyKey, JSON.stringify(weekly))
  }, [weekly])

  useEffect(() => {
    localStorage.setItem(explorationKey, JSON.stringify(explore))
  }, [explore])

  const toggle = (id) => setWeekly((cur) => cur.map(w => w.id === id ? { ...w, done: !w.done } : w))
  const add = () => {
    if (!newTask.trim()) return
    setWeekly((cur) => [{ id: `w-${Date.now()}`, title: newTask.trim(), module: 'general', done: false }, ...cur])
    setNewTask('')
  }

  const allDone = weekly.length > 0 && weekly.every(w => w.done)

  return (
    <div className="p-8 min-h-screen bg-black text-gray-100">
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 style={{ fontFamily: 'Cinzel, serif' }} className="text-3xl font-bold">Weekly Tasks</h1>
          <p className="text-gray-400">Complete these to unlock Exploration and rewards.</p>
        </header>

        <section className="bg-gray-900/60 p-4 rounded">
          <div className="mb-3 flex gap-2">
            <input value={newTask} onChange={(e) => setNewTask(e.target.value)} className="flex-1 p-2 bg-transparent border border-gray-800 rounded" placeholder="Add a weekly task..." />
            <button onClick={add} className="px-4 py-2 bg-yellow-500 text-black rounded">Add</button>
          </div>

          <div className="space-y-2">
            {weekly.length === 0 ? <p className="text-gray-400">No weekly tasks yet.</p> : weekly.map(w => (
              <div key={w.id} className="flex items-center gap-3 p-3 rounded bg-gray-800/30">
                <button onClick={() => toggle(w.id)}>{w.done ? <CheckCircle2 /> : <Circle />}</button>
                <div>
                  <div className="font-semibold">{w.title}</div>
                  <div className="text-xs text-gray-400">{w.module}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-sm">Exploration unlock status: <strong className="text-yellow-400">{allDone ? 'Unlocked' : 'Locked'}</strong></p>
            <Link to="/rewards" className="inline-block mt-2 text-yellow-400 hover:underline">Open Rewards / Exploration</Link>
          </div>
        </section>

        <section className="bg-gray-900/60 p-4 rounded">
          <h2 className="font-semibold">Exploration list (editable)</h2>
          <p className="text-xs text-gray-400">Add places you want to visit once unlocked.</p>

          <div className="mt-3 space-y-2">
            {explore.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
                <div>{item.title}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default WeeklyTasks
