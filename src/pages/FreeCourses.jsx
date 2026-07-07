import React, { useEffect, useState } from 'react'
import { ExternalLink, GraduationCap } from 'lucide-react'
import { freeCourses } from '../data/learningDatabase'

const storageKey = 'studyHub.freeCourses'

const FreeCourses = () => {
  const [completed, setCompleted] = useState({})
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setCompleted(JSON.parse(saved))
    setHasLoaded(true)
  }, [])

  useEffect(() => {
    if (!hasLoaded) return
    localStorage.setItem(storageKey, JSON.stringify(completed))
  }, [completed, hasLoaded])

  const doneCount = Object.values(completed).filter(Boolean).length
  const progress = Math.round((doneCount / freeCourses.length) * 100)

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">Free Courses</h1>
        <p className="text-slytherin-600">University and company courses for coding, AI, and career growth.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slytherin-900">Course Progress</h2>
            <p className="text-slytherin-600">{doneCount} of {freeCourses.length} courses marked completed.</p>
          </div>
          <p className="text-4xl font-bold text-slytherin-700">{progress}%</p>
        </div>
        <div className="h-4 bg-slytherin-100 rounded-full overflow-hidden">
          <div className="h-full bg-slytherin-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {freeCourses.map((course) => (
          <div key={course.title} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 mb-3">
                  {course.provider}
                </span>
                <h3 className="font-bold text-xl text-slytherin-900">{course.title}</h3>
              </div>
              <GraduationCap className="text-slytherin-500" />
            </div>

            <div className="space-y-2 text-sm text-slytherin-600 mb-5">
              <p><span className="font-bold text-slytherin-900">Hours:</span> {course.hours}</p>
              <p><span className="font-bold text-slytherin-900">Level:</span> {course.level}</p>
              <p><span className="font-bold text-slytherin-900">Certificate:</span> {course.certificate}</p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 font-bold text-slytherin-700">
                <input
                  type="checkbox"
                  checked={Boolean(completed[course.title])}
                  onChange={(e) => setCompleted({ ...completed, [course.title]: e.target.checked })}
                  className="w-5 h-5 accent-green-600"
                />
                Completed
              </label>
              <a
                href={course.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slytherin-600 text-white font-bold rounded-lg hover:bg-slytherin-700 transition"
              >
                Open
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FreeCourses
