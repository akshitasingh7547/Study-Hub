import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Target } from 'lucide-react'
import { jeeMainSyllabus } from '../data/studyHubData'

const storageKey = 'studyHub.jeePrep'

const JeePrep = () => {
  const [progress, setProgress] = useState({})
  const [selectedSubject, setSelectedSubject] = useState('Physics')
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setProgress(JSON.parse(saved))
    setHasLoaded(true)
  }, [])

  useEffect(() => {
    if (!hasLoaded) return
    localStorage.setItem(storageKey, JSON.stringify(progress))
    window.dispatchEvent(new Event('studyHubProgressUpdated'))
  }, [progress, hasLoaded])

  const subjects = Object.keys(jeeMainSyllabus)

  const stats = useMemo(() => {
    return subjects.map((subject) => {
      const total = jeeMainSyllabus[subject].length
      const done = jeeMainSyllabus[subject].filter((chapter) => progress[`${subject}:${chapter}`]).length
      return {
        subject,
        total,
        done,
        percent: total ? Math.round((done / total) * 100) : 0,
      }
    })
  }, [progress, subjects])

  const overall = useMemo(() => {
    const total = stats.reduce((sum, item) => sum + item.total, 0)
    const done = stats.reduce((sum, item) => sum + item.done, 0)
    return total ? Math.round((done / total) * 100) : 0
  }, [stats])

  const toggleChapter = (chapter) => {
    const key = `${selectedSubject}:${chapter}`
    setProgress({ ...progress, [key]: !progress[key] })
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">JEE Main Preparation</h1>
        <p className="text-slytherin-600">Track JEE Physics, Chemistry, and Mathematics from the syllabus.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slytherin-600 to-slytherin-800 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Overall JEE Progress</p>
          <p className="text-4xl font-bold">{overall}%</p>
          <p className="text-sm opacity-80 mt-2">Starts at 0 and updates when you finish units.</p>
        </div>

        {stats.map((item) => (
          <button
            key={item.subject}
            onClick={() => setSelectedSubject(item.subject)}
            className={`text-left rounded-xl shadow-lg p-6 transition ${
              selectedSubject === item.subject ? 'bg-slytherin-700 text-white' : 'bg-white text-slytherin-900 hover:bg-slytherin-50'
            }`}
          >
            <p className="text-sm opacity-80 mb-2">{item.done}/{item.total} units</p>
            <h2 className="text-2xl font-bold">{item.subject}</h2>
            <div className="h-2 bg-black/10 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-green-500" style={{ width: `${item.percent}%` }} />
            </div>
            <p className="font-bold mt-2">{item.percent}%</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="text-slytherin-700" />
          <h2 className="text-2xl font-bold text-slytherin-900">{selectedSubject} Units</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {jeeMainSyllabus[selectedSubject].map((chapter) => {
            const checked = Boolean(progress[`${selectedSubject}:${chapter}`])
            return (
              <button
                key={chapter}
                onClick={() => toggleChapter(chapter)}
                className={`flex items-center gap-3 text-left p-4 rounded-xl border transition ${
                  checked
                    ? 'bg-slytherin-700 text-white border-slytherin-700'
                    : 'bg-slytherin-50 text-slytherin-900 border-slytherin-100 hover:bg-slytherin-100'
                }`}
              >
                <CheckCircle2 size={22} />
                <span className="font-semibold">{chapter}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default JeePrep
