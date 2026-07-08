import React from 'react'
import { Plus, Trash2, Clock } from 'lucide-react'

const storageKey = 'studyHub.examHall'

const toLocalDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const ExamHall = () => {
  const [tests, setTests] = React.useState([])
  const [hasLoaded, setHasLoaded] = React.useState(false)
  const [showForm, setShowForm] = React.useState(false)
  const [newTest, setNewTest] = React.useState({
    name: '',
    category: 'Practice Test',
    score: '',
    total: '',
  })
const [timerTime, setTimerTime] = React.useState(3600)
const [showResult, setShowResult] = React.useState(false)
const [resultData, setResultData] = React.useState(null)

  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setTests(JSON.parse(saved))
    setHasLoaded(true)
  }, [])

  React.useEffect(() => {
    if (!hasLoaded) return
    localStorage.setItem(storageKey, JSON.stringify(tests))
    window.dispatchEvent(new Event('studyHubProgressUpdated'))
  }, [tests, hasLoaded])

  const getReward = (score, total) => {
  const percentage = (score / total) * 100

  if (percentage === 100) {
    return {
      title: "🏆 PERFECT SCORE!",
      points: 100,
      badge: "🥇 Gold Badge",
      message: "Outstanding! You aced the exam!"
    }
  }

  if (percentage >= 90) {
    return {
      title: "🥇 Excellent!",
      points: 80,
      badge: "⭐ Excellence",
      message: "Amazing performance!"
    }
  }

  if (percentage >= 80) {
    return {
      title: "🥈 Great Work!",
      points: 60,
      badge: "👏 Well Done",
      message: "You're improving consistently!"
    }
  }

  if (percentage >= 70) {
    return {
      title: "🥉 Nice Progress!",
      points: 40,
      badge: "📚 Keep Going",
      message: "You're on the right track!"
    }
  }

  return {
    title: "💚 Never Give Up!",
    points: 20,
    badge: "🔥 Consistency",
    message: "Every exam makes you stronger."
  }
}

  const handleAddTest = () => {
    if (newTest.name && newTest.score && newTest.total) {
      setTests([...tests, {
        id: Date.now(),
        ...newTest,
        score: parseInt(newTest.score),
        total: parseInt(newTest.total),
        date: toLocalDate(new Date())
      }])
      setNewTest({ name: '', category: 'Practice Test', score: '', total: '' })
      setShowForm(false)
    }
  }

  const handleDeleteTest = (id) => {
    setTests(tests.filter(test => test.id !== id))
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const categories = ['Practice Test', 'Class Test', 'Term Exam', 'Mock Exam']

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">Exam Hall 🏆</h1>
        <p className="text-slytherin-600">Track your test scores and practice exams</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-slytherin-600 to-slytherin-800 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Clock size={20} />
            Exam Timer
          </h2>
          <div className="bg-white bg-opacity-10 rounded-xl p-8 mb-6 text-center backdrop-blur">
            <p className="text-5xl font-bold font-mono">{formatTime(timerTime)}</p>
          </div>
          <input
            type="number"
            value={timerTime / 60}
            onChange={(e) => setTimerTime(parseInt(e.target.value) * 60)}
            placeholder="Minutes"
            className="w-full px-4 py-2 mb-4 rounded-lg text-slytherin-900 focus:outline-none"
          />
          <button className="w-full px-6 py-2 bg-white text-slytherin-700 font-bold rounded-lg hover:bg-opacity-90 transition">
            Start Timer
          </button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slytherin-900">Test Results</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-slytherin-600 text-white font-bold rounded-lg hover:bg-slytherin-700 transition"
            >
              <Plus size={20} />
              Add Test
            </button>
          </div>

          {showForm && (
            <div className="bg-slytherin-50 rounded-lg p-6 mb-6 border-l-4 border-slytherin-600">
              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  value={newTest.name}
                  onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                  placeholder="Test name..."
                  className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
                />
                <select
                  value={newTest.category}
                  onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={newTest.score}
                    onChange={(e) => setNewTest({ ...newTest, score: e.target.value })}
                    placeholder="Score"
                    className="px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
                  />
                  <input
                    type="number"
                    value={newTest.total}
                    onChange={(e) => setNewTest({ ...newTest, total: e.target.value })}
                    placeholder="Out of"
                    className="px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
                  />
                </div>
              </div>
              <button
                onClick={handleAddTest}
                className="w-full px-4 py-2 bg-slytherin-600 text-white font-bold rounded-lg hover:bg-slytherin-700 transition"
              >
                Save Test
              </button>
            </div>
          )}

          <div className="space-y-3">
            {tests.map((test) => (
              <div key={test.id} className="flex items-center gap-4 p-4 bg-slytherin-50 rounded-lg hover:bg-slytherin-100 transition group">
                <div className="flex-1">
                  <p className="font-bold text-slytherin-900">{test.name}</p>
                  <div className="flex items-center gap-3 text-sm text-slytherin-600 mt-1">
                    <span className="px-2 py-1 bg-slytherin-200 rounded">{test.category}</span>
                    <span>{test.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slytherin-600">
                    {((test.score / test.total) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-slytherin-500">{test.score}/{test.total}</p>
                </div>
                <button
                  onClick={() => handleDeleteTest(test.id)}
                  className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamHall
