import React, { useEffect, useMemo, useState } from 'react'
import { Play, Pause, RotateCcw, CheckCircle2, Trash2, Timer, BookOpen, Sparkles } from 'lucide-react'
import BreakSearch from '../components/BreakSearch'

const STORAGE_KEY = 'studyHub.studyHallV2'
const CHAPTERS_KEY = 'studyHub.chapterPlans'

const defaultTasks = [
  { id: 1, text: 'Review Physics formulas', completed: false },
  { id: 2, text: 'Solve 20 JEE Maths questions', completed: false },
  { id: 3, text: 'Revise Chemistry weak points', completed: false },
]

const defaultChapters = [
  { id: 'c1', title: 'Matrices', state: 'start-next', plan: [ { id: 's1', text: 'Watch video', done: false }, { id: 's2', text: 'Read NCERT', done: false }, { id: 's3', text: 'Solve examples', done: false } ] },
  { id: 'c2', title: 'Gravitation', state: 'learning', plan: [ { id: 's1', text: 'Read theory', done: true }, { id: 's2', text: 'Solve PYQs', done: false } ] },
]

const StudyHall = () => {
  const [mode, setMode] = useState('pomodoro')
  const STUDY_MODES = {
    pomodoro: { name: '🍅 Pomodoro', focus: 25 * 60, break: 5 * 60 },
    deep: { name: '🧠 Deep Focus', focus: 50 * 60, break: 10 * 60 },
    quick: { name: '⚡ Quick Revision', focus: 15 * 60, break: 3 * 60 },
  }

  const [isBreak, setIsBreak] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(STUDY_MODES.pomodoro.focus)
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return defaultTasks
      const parsed = JSON.parse(raw)
      return parsed.todos?.length ? parsed.todos : defaultTasks
    } catch { return defaultTasks }
  })
  const [newTodo, setNewTodo] = useState('')

  const [chapters, setChapters] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHAPTERS_KEY)) || defaultChapters } catch { return defaultChapters }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos }))
    window.dispatchEvent(new Event('studyHubProgressUpdated'))
  }, [todos])

  useEffect(() => {
    localStorage.setItem(CHAPTERS_KEY, JSON.stringify(chapters))
  }, [chapters])

  useEffect(() => {
    let interval
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    }

    if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      if (!isBreak) {
        // finished focus -> to break
        setIsBreak(true)
        setTimeLeft(STUDY_MODES[mode].break)
        // small notification (modal handled inline)
      } else {
        // finished break -> ready for next focus
        setIsBreak(false)
        setTimeLeft(STUDY_MODES[mode].focus)
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, mode])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const format = (v) => String(v).padStart(2, '0')

  const addTodo = () => {
    if (!newTodo.trim()) return
    setTodos((cur) => [...cur, { id: Date.now(), text: newTodo.trim(), completed: false }])
    setNewTodo('')
  }

  const toggleTodo = (id) => setTodos((cur) => cur.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  const deleteTodo = (id) => setTodos((cur) => cur.filter(t => t.id !== id))

  // Chapter functions
  const setChapterState = (chapterId, nextState) => setChapters((cur) => cur.map(c => c.id === chapterId ? { ...c, state: nextState } : c))

  const togglePlanStep = (chapterId, stepId) => {
    setChapters((cur) => cur.map(c => {
      if (c.id !== chapterId) return c
      return { ...c, plan: c.plan.map(s => s.id === stepId ? { ...s, done: !s.done } : s) }
    }))
  }

  const addPlanStep = (chapterId, text) => {
    if (!text.trim()) return
    setChapters((cur) => cur.map(c => c.id === chapterId ? { ...c, plan: [...c.plan, { id: `s-${Date.now()}`, text: text.trim(), done: false }] } : c))
  }

  const moveStep = (chapterId, stepId, dir) => {
    setChapters((cur) => cur.map(c => {
      if (c.id !== chapterId) return c
      const idx = c.plan.findIndex(s => s.id === stepId)
      if (idx === -1) return c
      const next = [...c.plan]
      const swap = idx + dir
      if (swap < 0 || swap >= next.length) return c
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return { ...c, plan: next }
    }))
  }

  const chapterProgress = useMemo(() => {
    return chapters.map(c => ({ id: c.id, title: c.title, percent: c.plan.length ? Math.round((c.plan.filter(s => s.done).length / c.plan.length) * 100) : 0 }))
  }, [chapters])

  return (
    <div className="p-8 min-h-screen bg-black text-gray-100 page-study-hall">
      <div className="mb-6">
        <h1 style={{ fontFamily: 'Cinzel, serif' }} className="text-3xl font-bold">Study Hall</h1>
        <p className="text-gray-400">Timer, chapter plans, and focused progress. Chapter states: Start Next, Learning, Familiar, Complete.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 bg-gray-900/60 p-6 rounded card-dark">
          <h2 className="font-semibold mb-3">Focus Timer</h2>
          <div className="bg-gray-800/40 p-4 rounded text-center mb-4">
            <div className="text-5xl font-mono font-bold">{format(minutes)}:{format(seconds)}</div>
            <div className="text-sm text-gray-400 mt-2">{isBreak ? 'Break' : 'Focus'} • {STUDY_MODES[mode].name}</div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.entries(STUDY_MODES).map(([key, v]) => (
              <button key={key} onClick={() => { setMode(key); setIsRunning(false); setIsBreak(false); setTimeLeft(v.focus) }} className={`py-2 rounded ${mode===key ? 'bg-yellow-500 text-black' : 'bg-white bg-opacity-15'}`}>
                {v.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2 justify-center mb-3">
            <button onClick={() => setIsRunning(!isRunning)} className="px-4 py-2 bg-yellow-500 text-black rounded font-semibold">{isRunning ? <><Pause /> Pause</> : <><Play /> Start</>}</button>
            <button onClick={() => { setIsRunning(false); setIsBreak(false); setTimeLeft(STUDY_MODES[mode].focus) }} className="px-4 py-2 bg-gray-800/30 rounded">Reset</button>
          </div>

          {isBreak && (
            <div className="mt-4 bg-gray-800/30 p-3 rounded">
              <p className="font-semibold">Break Activity</p>
              <p className="text-xs text-gray-400">Use break to refresh — quick research suggestions:</p>
              <BreakSearch />
            </div>
          )}
        </div>

        <div className="xl:col-span-2 bg-gray-900/60 p-6 rounded">
          <h2 className="font-semibold mb-3">Today's Study Tasks</h2>

          <div className="mb-4">
            <div className="flex gap-2">
              <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a study task..." className="flex-1 p-2 bg-transparent border border-gray-800 rounded" />
              <button onClick={addTodo} className="px-4 py-2 bg-yellow-500 text-black rounded">Add</button>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {todos.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded bg-gray-800/30">
                <button onClick={() => toggleTodo(t.id)} className="text-green-400"><CheckCircle2 /></button>
                <div className={`flex-1 ${t.completed ? 'line-through text-gray-500' : ''}`}>{t.text}</div>
                <button onClick={() => deleteTodo(t.id)} className="text-red-500"><Trash2 /></button>
              </div>
            ))}
          </div>

          <h3 className="font-semibold mb-3">Chapters & Plans</h3>
          <div className="grid gap-4">
            {chapters.map((c) => (
              <div key={c.id} className="bg-gray-800/30 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold">{c.title}</div>
                    <div className="text-xs text-gray-400">State: <strong>{c.state}</strong></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setChapterState(c.id, 'start-next')} className="px-2 py-1 bg-gray-700 rounded text-xs">Start Next</button>
                    <button onClick={() => setChapterState(c.id, 'learning')} className="px-2 py-1 bg-gray-700 rounded text-xs">Learning</button>
                    <button onClick={() => setChapterState(c.id, 'familiar')} className="px-2 py-1 bg-gray-700 rounded text-xs">Familiar</button>
                    <button onClick={() => setChapterState(c.id, 'complete')} className="px-2 py-1 bg-gray-700 rounded text-xs">Complete</button>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-xs text-gray-400 mb-1">Plan</div>
                  <div className="space-y-2">
                    {c.plan.map((s, idx) => (
                      <div key={s.id} className="flex items-center gap-2 p-2 bg-gray-700/20 rounded">
                        <input type="checkbox" checked={s.done} onChange={() => togglePlanStep(c.id, s.id)} />
                        <div className={`${s.done ? 'line-through text-gray-500' : ''} flex-1`}>{s.text}</div>
                        <div className="flex gap-1">
                          <button onClick={() => moveStep(c.id, s.id, -1)} className="text-xs px-2 py-1 bg-gray-700 rounded">↑</button>
                          <button onClick={() => moveStep(c.id, s.id, 1)} className="text-xs px-2 py-1 bg-gray-700 rounded">↓</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <AddPlanStep chapterId={c.id} onAdd={(text) => addPlanStep(c.id, text)} />
                </div>

                <div className="text-xs text-gray-400">Progress: {chapterProgress.find(p => p.id === c.id)?.percent || 0}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const AddPlanStep = ({ chapterId, onAdd }) => {
  const [val, setVal] = useState('')
  return (
    <div className="mt-2 flex gap-2">
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Add step (Watch video, Read NCERT...)" className="flex-1 p-2 bg-transparent border border-gray-800 rounded text-sm" />
      <button onClick={() => { onAdd(val); setVal('') }} className="px-3 py-1 bg-gray-700 rounded">Add</button>
    </div>
  )
}

export default StudyHall
