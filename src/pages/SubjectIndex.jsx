import React, { useEffect, useMemo, useState } from 'react'
import { BookOpen, CheckCircle2, ChevronRight } from 'lucide-react'
import { class11Subjects } from '../data/studyHubData'

const storageKey = 'studyHub.subjects'

const colors = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-orange-500 to-orange-600',
  'from-green-500 to-green-600',
  'from-red-500 to-red-600',
  'from-cyan-500 to-cyan-600',
  'from-emerald-500 to-emerald-600',
]

const SubjectIndex = () => {
  const [selectedSubject, setSelectedSubject] = useState(0)
  const [progress, setProgress] = useState({})
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

  const subjectStats = useMemo(() => {
    return class11Subjects.map((subject) => {
      const done = subject.chapters.filter((chapter) => progress[`${subject.name}:${chapter}`]).length
      return {
        done,
        total: subject.chapters.length,
        percent: subject.chapters.length ? Math.round((done / subject.chapters.length) * 100) : 0,
      }
    })
  }, [progress])

  const toggleChapter = (subjectName, chapter) => {
    const key = `${subjectName}:${chapter}`
    setProgress({ ...progress, [key]: !progress[key] })
  }

  const subject = class11Subjects[selectedSubject]

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">Subject Index</h1>
        <p className="text-slytherin-600">Class 11 study index. Progress starts at 0 and updates as you finish chapters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {class11Subjects.map((item, index) => (
          <button
            key={item.name}
            onClick={() => setSelectedSubject(index)}
            className={`text-left bg-gradient-to-br ${colors[index % colors.length]} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">{item.name}</h3>
              <ChevronRight size={24} className={`transition-transform ${selectedSubject === index ? 'rotate-90' : ''}`} />
            </div>
            <p className="text-sm opacity-90">{subjectStats[index].done}/{subjectStats[index].total} chapters</p>
            <div className="h-2 bg-white/25 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-white" style={{ width: `${subjectStats[index].percent}%` }} />
            </div>
            <p className="font-bold mt-2">{subjectStats[index].percent}%</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 animate-slideIn">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-slytherin-700" />
          <h2 className="text-3xl font-bold text-slytherin-900">{subject.name} Chapters</h2>
        </div>

        <div className="space-y-3">
          {subject.chapters.map((chapter) => {
            const checked = Boolean(progress[`${subject.name}:${chapter}`])
            return (
              <button
                key={chapter}
                onClick={() => toggleChapter(subject.name, chapter)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg transition text-left ${
                  checked ? 'bg-slytherin-700 text-white' : 'bg-slytherin-50 text-slytherin-900 hover:bg-slytherin-100'
                }`}
              >
                <CheckCircle2 size={20} />
                <span className="flex-1 font-semibold">{chapter}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SubjectIndex
