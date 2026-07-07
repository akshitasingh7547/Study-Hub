import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Languages,
  PenLine,
  Target,
  TrendingUp,
} from 'lucide-react'
import { skillAreas } from '../data/studyHubData'

const storageKey = 'studyHub.skills'

const areaIcons = {
  'Coding Hub': Code2,
  'English Fluency Academy': Languages,
  'Writing Skills': PenLine,
  'Share Market': TrendingUp,
  'Future Profession': BriefcaseBusiness,
  'JEE Exam Preparation': Target,
}

const priorityGroups = [
  {
    title: 'Build',
    items: ['Coding Hub', 'JEE Exam Preparation'],
  },
  {
    title: 'Communicate',
    items: ['English Fluency Academy', 'Writing Skills'],
  },
  {
    title: 'Career and Money',
    items: ['Share Market', 'Future Profession'],
  },
]

const SkillsTracker = () => {
  const [progress, setProgress] = useState({})

  useEffect(() => {
    const updateProgress = () => {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return setProgress({})
      setProgress(JSON.parse(saved).progress || {})
    }

    updateProgress()
    window.addEventListener('studyHubProgressUpdated', updateProgress)
    return () => window.removeEventListener('studyHubProgressUpdated', updateProgress)
  }, [])

  const getAreaProgress = (area) => {
    const done = area.tracks.filter((track) => progress[`${area.title}:${track}`]).length
    const percent = area.tracks.length ? Math.round((done / area.tracks.length) * 100) : 0
    return { done, percent }
  }

  const totalProgress = useMemo(() => {
    const total = skillAreas.reduce((sum, area) => sum + area.tracks.length, 0)
    const done = skillAreas.reduce((sum, area) => {
      return sum + area.tracks.filter((track) => progress[`${area.title}:${track}`]).length
    }, 0)
    return total ? Math.round((done / total) * 100) : 0
  }, [progress])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slytherin-50 via-emerald-50 to-slate-100 p-8 animate-fadeIn">
      <div className="mb-8 rounded-2xl bg-slate-950 text-white p-8 shadow-xl border border-emerald-800">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300 font-bold mb-3">Slytherin Skills Vault</p>
            <h1 className="text-4xl font-bold mb-3">Skills</h1>
            <p className="text-slate-300 max-w-3xl">
              One organized home for coding, share market, fluent English, writing, future profession, and JEE growth.
            </p>
          </div>
          <div className="rounded-xl bg-emerald-950/70 border border-emerald-700 p-5 min-w-[180px]">
            <p className="text-sm text-emerald-200 mb-1">Overall progress</p>
            <p className="text-4xl font-bold text-emerald-300">{totalProgress}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-emerald-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slytherin-900">Growth meter</h2>
            <p className="text-slytherin-600">This starts at 0 and grows only when you mark tracks complete.</p>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <BookOpenCheck size={22} />
            <span>{totalProgress}% complete</span>
          </div>
        </div>
        <div className="h-4 bg-slytherin-100 rounded-full overflow-hidden">
          <div className="h-full bg-slytherin-600 transition-all duration-500" style={{ width: `${totalProgress}%` }} />
        </div>
      </div>

      <div className="space-y-8">
        {priorityGroups.map((group) => (
          <section key={group.title}>
            <div className="flex items-center gap-3 mb-4">
              <Award className="text-emerald-700" />
              <h2 className="text-2xl font-bold text-slytherin-900">{group.title}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {skillAreas
                .filter((area) => group.items.includes(area.title))
                .map((area) => {
                  const { done, percent } = getAreaProgress(area)
                  const Icon = areaIcons[area.title] || Award

                  return (
                    <Link
                      key={area.title}
                      to={area.route}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border border-emerald-100 hover:border-emerald-400"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-xl bg-slate-900 text-emerald-300 flex items-center justify-center shrink-0">
                            <Icon size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-slytherin-900">{area.title}</h3>
                            <p className="text-sm text-slytherin-600 mt-2">{area.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="text-slytherin-500 shrink-0" />
                      </div>

                      <div className="flex justify-between text-sm font-bold text-slytherin-700 mb-2">
                        <span>{done}/{area.tracks.length} done</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-2 bg-slytherin-100 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-slytherin-600" style={{ width: `${percent}%` }} />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {area.tracks.slice(0, 5).map((track) => {
                          const checked = Boolean(progress[`${area.title}:${track}`])
                          return (
                            <span
                              key={track}
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                                checked
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {checked && <CheckCircle2 size={13} />}
                              {track}
                            </span>
                          )
                        })}
                      </div>
                    </Link>
                  )
                })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 bg-slate-950 text-white rounded-xl shadow-lg p-6 border border-emerald-800">
        <h2 className="text-2xl font-bold mb-4">Skill study index</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            'Pick one track',
            'Study or practice',
            'Save notes and mark progress',
          ].map((step, index) => (
            <div key={step} className="rounded-lg bg-slate-900 border border-slate-800 p-4">
              <p className="text-emerald-300 font-bold mb-1">Step {index + 1}</p>
              <p className="text-slate-200">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkillsTracker
