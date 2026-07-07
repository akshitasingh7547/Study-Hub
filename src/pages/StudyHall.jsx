import React, { useEffect, useMemo, useState } from 'react'
import { Play, Pause, RotateCcw, CheckCircle2, Trash2, Timer, BookOpen, Sparkles } from 'lucide-react'
import { studyMethods } from '../data/learningDatabase'

const defaultTasks = [
  { id: 1, text: 'Review Physics formulas', completed: false },
  { id: 2, text: 'Solve 20 JEE Maths questions', completed: false },
  { id: 3, text: 'Revise Chemistry weak points', completed: false },
]

const storageKey = 'studyHub.studyHall'

const StudyHall = () => {
  const [timeLeft, setTimeLeft] = useState(1500)
  const [isRunning, setIsRunning] = useState(false)
  const [todos, setTodos] = useState(defaultTasks)
  const [newTodo, setNewTodo] = useState('')
  const [selectedMethod, setSelectedMethod] = useState(studyMethods[0])
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const parsed = JSON.parse(saved)
      setTodos(parsed.todos?.length ? parsed.todos : defaultTasks)
    }
    setHasLoaded(true)
  }, [])

  useEffect(() => {
    if (!hasLoaded) return
    localStorage.setItem(storageKey, JSON.stringify({ todos }))
    window.dispatchEvent(new Event('studyHubProgressUpdated'))
  }, [todos, hasLoaded])

  useEffect(() => {
    let interval
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((time) => time - 1), 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const completedCount = todos.filter((todo) => todo.completed).length
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formatTime = (val) => String(val).padStart(2, '0')

  const progressMessage = useMemo(() => {
    if (progress === 100) return 'Perfect. Study Hall cleared for today.'
    if (progress >= 70) return 'Strong progress. Finish the remaining tasks.'
    if (progress >= 35) return 'Good start. Keep the study chain moving.'
    return 'Pick one task and begin. Momentum comes after starting.'
  }, [progress])

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">Study Hall</h1>
        <p className="text-slytherin-600">Timer, study methods, and live progress that updates as you study.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        <div className="bg-gradient-to-br from-slytherin-600 to-slytherin-800 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-lg font-semibold mb-6 opacity-90 flex items-center justify-center gap-2">
            <Timer size={20} />
            Focus Timer
          </h2>
          <div className="bg-white bg-opacity-10 rounded-xl p-8 mb-6 backdrop-blur">
            <p className="text-6xl font-bold font-mono mb-4">
              {formatTime(minutes)}:{formatTime(seconds)}
            </p>
            <p className="text-sm opacity-75">Choose a method, start a session, finish a task.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[25, 45, 60].map((minute) => (
              <button
                key={minute}
                onClick={() => {
                  setIsRunning(false)
                  setTimeLeft(minute * 60)
                }}
                className="py-2 bg-white bg-opacity-15 rounded-lg hover:bg-opacity-25"
              >
                {minute}m
              </button>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slytherin-700 font-bold rounded-lg hover:bg-opacity-90 transition"
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                setIsRunning(false)
                setTimeLeft(1500)
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-20 text-white font-bold rounded-lg hover:bg-opacity-30 transition"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slytherin-900">Today&apos;s Study Progress</h2>
              <p className="text-slytherin-600">{progressMessage}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-slytherin-700">{progress}%</p>
              <p className="text-sm text-slytherin-500">{completedCount}/{todos.length} done</p>
            </div>
          </div>

          <div className="h-4 bg-slytherin-100 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-slytherin-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="Add a study task..."
              className="flex-1 px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
            />
            <button
              onClick={handleAddTodo}
              className="px-6 py-2 bg-slytherin-600 text-white font-bold rounded-lg hover:bg-slytherin-700 transition"
            >
              Add
            </button>
          </div>

          <div className="space-y-3">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-4 p-4 bg-slytherin-50 rounded-lg hover:bg-slytherin-100 transition group">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`transition ${todo.completed ? 'text-slytherin-600' : 'text-slytherin-300'}`}
                >
                  <CheckCircle2 size={24} />
                </button>
                <p className={`flex-1 font-semibold ${todo.completed ? 'text-slytherin-400 line-through' : 'text-slytherin-900'}`}>
                  {todo.text}
                </p>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-slytherin-700" />
            <h2 className="text-2xl font-bold text-slytherin-900">Study Methods</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyMethods.map((method) => (
              <button
                key={method.title}
                onClick={() => setSelectedMethod(method)}
                className={`text-left rounded-xl p-5 border transition ${
                  selectedMethod.title === method.title
                    ? 'bg-slytherin-700 text-white border-slytherin-700'
                    : 'bg-slytherin-50 text-slytherin-900 border-slytherin-100 hover:bg-slytherin-100'
                }`}
              >
                <p className="font-bold">{method.title}</p>
                <p className={`text-sm mt-1 ${selectedMethod.title === method.title ? 'text-slytherin-100' : 'text-slytherin-600'}`}>
                  {method.bestFor}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-yellow-500" />
            <h2 className="text-xl font-bold text-slytherin-900">{selectedMethod.title}</h2>
          </div>
          <div className="space-y-4 text-slytherin-700">
            <p><span className="font-bold">Difficulty:</span> {selectedMethod.difficulty}</p>
            <p><span className="font-bold">Best for:</span> {selectedMethod.bestFor}</p>
            <p><span className="font-bold">How it works:</span> {selectedMethod.howItWorks}</p>
            <p><span className="font-bold">When to use:</span> {selectedMethod.whenToUse}</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
              <p className="font-bold text-yellow-800">Example</p>
              <p className="text-yellow-900">{selectedMethod.example}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyHall
