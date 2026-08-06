import React, { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  FlaskConical,
  Flame,
  Library,
  Lightbulb,
  LineChart,
  PenLine,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'
import { jeeMainSyllabus } from '../data/studyHubData'

const storageKey = 'studyHub.iitBombayMission'

const subjects = jeeMainSyllabus

const focusHouses = [
  { id: 'physics', title: 'Mechanics Tower', subject: 'Physics', accent: '#77d6ff' },
  { id: 'chemistry', title: 'Alchemy Lab', subject: 'Chemistry', accent: '#c8ff8c' },
  { id: 'math', title: 'Arithmancy Hall', subject: 'Mathematics', accent: '#f4c95d' },
  { id: 'ai', title: 'Inventor Wing', subject: 'AI Engineer', accent: '#c084fc' },
  { id: 'quant', title: 'Quant Observatory', subject: 'Quant Analyst', accent: '#fb7185' },
]

const masteryPaths = [
  {
    title: 'JEE Main Scorecraft',
    items: ['NCERT command', 'formula recall', 'single-concept speed', 'NTA PYQs', 'mock analysis', 'percentile strategy'],
  },
  {
    title: 'JEE Advanced Depth',
    items: ['multi-concept problems', 'proof-style thinking', 'integer traps', 'paragraph sets', 'time allocation', 'partial marking strategy'],
  },
  {
    title: 'IIT Bombay CSE Buffer',
    items: ['top-rank discipline', 'near-perfect Math', 'strong Physics intuition', 'Chemistry accuracy', 'errorless easy questions', 'calm exam temperament'],
  },
  {
    title: 'AI Engineer Foundation',
    items: ['Python', 'linear algebra', 'probability', 'calculus', 'data structures', 'machine learning basics'],
  },
  {
    title: 'Quant Analyst Foundation',
    items: ['probability', 'statistics', 'calculus', 'linear algebra', 'mental math', 'markets and risk'],
  },
]

const defaultMistakes = [
  { id: 1, chapter: 'Rotational Motion', tag: 'Concept', note: 'Torque direction and rolling constraint need a second pass.', fixed: false },
  { id: 2, chapter: 'Chemical Equilibrium', tag: 'Calculation', note: 'Recheck approximation steps before substituting values.', fixed: false },
]

const defaultMockScores = [118, 142, 166, 184, 203]
const mainTarget = 250
const advancedTarget = 190

const getDaysLeft = (targetDate) => {
  const today = new Date()
  const target = new Date(`${targetDate}T00:00:00`)
  const diff = target.getTime() - today.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil(diff / 86400000))
}

const getChapterKey = (subject, chapter) => `${subject}:${chapter}`

const buildMentorReply = (prompt, chapter, weakChapters) => {
  if (!prompt.trim()) return 'Ask The Oracle for a chapter plan, weak-topic diagnosis, mock strategy, AI roadmap, or quant roadmap.'
  const focus = weakChapters[0]?.chapter || chapter
  if (/iit|bombay|cse|rank/i.test(prompt)) {
    return `Treat IIT Bombay CSE as a precision mission: protect easy marks, make Math your weapon, and keep Chemistry accuracy high. Today, repair ${focus} before adding harder problems.`
  }
  if (/ai|machine|engineer|python/i.test(prompt)) {
    return 'AI Engineer path: Python daily, data structures twice a week, linear algebra on weekends, and one ML mini-project after JEE basics are stable.'
  }
  if (/quant|trading|analyst|market/i.test(prompt)) {
    return 'Quant path: probability, statistics, calculus, linear algebra, mental math, and clean Python notebooks. JEE Math is already your strongest launchpad.'
  }
  if (/plan|schedule|revision/i.test(prompt)) {
    return `Plan: 90 minutes concept repair in ${focus}, 60 minutes PYQs, 30 minutes mistake journal, then one timed mixed set. Repeat this loop before every mock.`
  }
  if (/mistake|wrong|why/i.test(prompt)) {
    return `Your mistake pattern probably starts before the final step. Re-solve ${focus} from easy to hard and tag each error as Concept, Calculation, Silly, or Time.`
  }
  if (/generate|questions|problems/i.test(prompt)) {
    return `Generated drill: 10 JEE Main speed questions, 8 Advanced multi-concept questions, and 2 ranker-level traps from ${chapter}. Review every miss immediately.`
  }
  return `For ${chapter}, do a concept map first, solve examples slowly, then switch to timed PYQs. If accuracy drops below 75%, return to theory before speed practice.`
}

const JeePrep = () => {
  const [state, setState] = useState(() => ({
    selectedSubject: 'Physics',
    selectedChapter: 'Kinematics',
    focusHouse: 'physics',
    targetDates: {
      main: '2027-01-20',
      advanced: '2027-05-23',
    },
    progress: {},
    mastery: {},
    missions: {
      concept: false,
      pyq: false,
      advanced: false,
      mock: false,
      journal: false,
    },
    mockScores: defaultMockScores,
    mistakes: defaultMistakes,
    mentorPrompt: '',
    pathDone: {},
  }))
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setState((current) => ({ ...current, ...JSON.parse(saved) }))
    setHasLoaded(true)
  }, [])

  useEffect(() => {
    if (!hasLoaded) return
    localStorage.setItem(storageKey, JSON.stringify(state))
    window.dispatchEvent(new Event('studyHubProgressUpdated'))
  }, [state, hasLoaded])

  const subjectNames = Object.keys(subjects)
  const chapters = subjects[state.selectedSubject] || []
  const selectedChapter = chapters.includes(state.selectedChapter) ? state.selectedChapter : chapters[0]
  const chapterKey = getChapterKey(state.selectedSubject, selectedChapter)
  const currentMastery = Number(state.mastery[chapterKey] || 0)
  const mainDaysLeft = getDaysLeft(state.targetDates.main)
  const advancedDaysLeft = getDaysLeft(state.targetDates.advanced)

  const stats = useMemo(() => {
    return subjectNames.map((subject) => {
      const total = subjects[subject].length
      const done = subjects[subject].filter((chapter) => state.progress[getChapterKey(subject, chapter)]).length
      const masteryTotal = subjects[subject].reduce((sum, chapter) => sum + Number(state.mastery[getChapterKey(subject, chapter)] || 0), 0)
      return {
        subject,
        total,
        done,
        percent: total ? Math.round((done / total) * 100) : 0,
        mastery: total ? Math.round(masteryTotal / total) : 0,
      }
    })
  }, [state.mastery, state.progress, subjectNames])

  const overall = useMemo(() => {
    const total = stats.reduce((sum, item) => sum + item.total, 0)
    const done = stats.reduce((sum, item) => sum + item.done, 0)
    return total ? Math.round((done / total) * 100) : 0
  }, [stats])

  const weakChapters = useMemo(() => {
    return subjectNames.flatMap((subject) => subjects[subject].map((chapter) => ({
      subject,
      chapter,
      mastery: Number(state.mastery[getChapterKey(subject, chapter)] || 0),
    }))).sort((a, b) => a.mastery - b.mastery).slice(0, 5)
  }, [state.mastery, subjectNames])

  const latestMock = state.mockScores[state.mockScores.length - 1] || 0
  const previousMock = state.mockScores[state.mockScores.length - 2] || latestMock
  const mockDelta = latestMock - previousMock
  const missionCount = Object.values(state.missions).filter(Boolean).length
  const mentorReply = buildMentorReply(state.mentorPrompt, selectedChapter, weakChapters)
  const activeHouse = focusHouses.find((house) => house.id === state.focusHouse) || focusHouses[0]

  const patchState = (patch) => setState((current) => ({ ...current, ...patch }))

  const selectSubject = (subject) => {
    patchState({ selectedSubject: subject, selectedChapter: subjects[subject][0] })
  }

  const toggleChapterDone = () => {
    patchState({ progress: { ...state.progress, [chapterKey]: !state.progress[chapterKey] } })
  }

  const updateMastery = (value) => {
    patchState({ mastery: { ...state.mastery, [chapterKey]: Number(value) } })
  }

  const addMockScore = () => {
    const nextScore = Math.min(300, latestMock + 12)
    patchState({ mockScores: [...state.mockScores.slice(-5), nextScore] })
  }

  const addMistake = () => {
    patchState({
      mistakes: [
        { id: Date.now(), chapter: selectedChapter, tag: 'Concept', note: `Repair ${selectedChapter} before the next mock.`, fixed: false },
        ...state.mistakes,
      ],
    })
  }

  const toggleMistake = (id) => {
    patchState({ mistakes: state.mistakes.map((mistake) => mistake.id === id ? { ...mistake, fixed: !mistake.fixed } : mistake) })
  }

  const togglePathItem = (pathTitle, item) => {
    const key = `${pathTitle}:${item}`
    patchState({ pathDone: { ...state.pathDone, [key]: !state.pathDone[key] } })
  }

  return (
    <div className="min-h-screen bg-[#070807] text-[#f7ead0] animate-fadeIn">
      <section className="relative overflow-hidden border-b border-amber-300/15 bg-[radial-gradient(circle_at_top_left,rgba(244,201,93,0.16),transparent_34%),linear-gradient(135deg,#060706_0%,#10130f_48%,#1b140b_100%)] px-6 py-8 lg:px-10">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">IIT Bombay CSE Mission</p>
              <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">Scholar's Command Chamber</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#d8c7a0]">
                One focused mission: JEE Main, JEE Advanced, IIT Bombay Computer Science, then the long road toward AI engineering and quant analysis.
              </p>
            </div>

            <div className="rounded-lg border border-amber-300/20 bg-black/25 p-4">
              <div className="flex items-center gap-3">
                <Crown className="text-amber-300" />
                <div>
                  <p className="text-sm font-bold text-white">Sorting Crown Focus</p>
                  <p className="text-xs text-[#c8b88f]">Choose what today's castle energy protects.</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {focusHouses.map((house) => (
                  <button
                    key={house.id}
                    onClick={() => patchState({ focusHouse: house.id })}
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${state.focusHouse === house.id ? 'border-amber-300 bg-amber-300/15 text-white' : 'border-white/10 bg-white/5 text-[#d8c7a0] hover:bg-white/10'}`}
                  >
                    <span className="block font-bold" style={{ color: house.accent }}>{house.title}</span>
                    <span className="text-xs">{house.subject}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric icon={Calendar} label="JEE Main" value={`${mainDaysLeft} days`} detail="Target: 250+ score zone" />
            <Metric icon={Trophy} label="JEE Advanced" value={`${advancedDaysLeft} days`} detail="Target: top-rank buffer for CSE" />
            <Metric icon={BookOpen} label="Syllabus" value={`${overall}%`} detail="PCM completion across all chapters" />
            <Metric icon={Flame} label="Quest XP" value={`${missionCount * 60}`} detail={`${missionCount}/5 daily missions complete`} />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:px-10 xl:grid-cols-[1.25fr_0.75fr]">
        <main className="space-y-6">
          <section className="rounded-lg border border-amber-300/15 bg-white/[0.035] p-5 shadow-xl shadow-black/30">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-white"><Target size={22} /> Rank Mission Dashboard</h2>
                <p className="mt-1 text-sm text-[#c8b88f]">Track the two exams that matter and keep every subject tied to IIT Bombay CSE readiness.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <DateInput label="Main date" value={state.targetDates.main} onChange={(value) => patchState({ targetDates: { ...state.targetDates, main: value } })} />
                <DateInput label="Advanced date" value={state.targetDates.advanced} onChange={(value) => patchState({ targetDates: { ...state.targetDates, advanced: value } })} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              {stats.map((item) => (
                <button
                  key={item.subject}
                  onClick={() => selectSubject(item.subject)}
                  className={`rounded-lg border p-4 text-left ${state.selectedSubject === item.subject ? 'border-amber-300 bg-amber-300/10' : 'border-white/10 bg-black/25 hover:bg-white/5'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">{item.subject}</h3>
                    <span className="text-sm text-amber-300">{item.done}/{item.total}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/40">
                    <div className="h-full bg-amber-300" style={{ width: `${item.percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-[#c8b88f]">Mastery average: {item.mastery}%</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-amber-300/15 bg-white/[0.035] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Grand Library: PCM Grimoire</h2>
                <p className="mt-1 text-sm text-[#c8b88f]">Every chapter is a chamber. Mastery, PYQs, mistakes, and revision all stay attached.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjectNames.map((subject) => (
                  <button key={subject} onClick={() => selectSubject(subject)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${state.selectedSubject === subject ? 'bg-amber-300 text-black' : 'bg-white/10 text-[#f7ead0]'}`}>
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {chapters.map((chapter) => {
                const key = getChapterKey(state.selectedSubject, chapter)
                const done = Boolean(state.progress[key])
                const mastery = Number(state.mastery[key] || 0)
                return (
                  <button
                    key={chapter}
                    onClick={() => patchState({ selectedChapter: chapter })}
                    className={`rounded-lg border p-4 text-left ${selectedChapter === chapter ? 'border-amber-300 bg-[#1b140b]' : 'border-white/10 bg-black/25 hover:bg-white/5'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-white">{chapter}</span>
                      {done && <CheckCircle2 size={18} className="text-amber-300" />}
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/40">
                      <div className="h-full bg-[#77d6ff]" style={{ width: `${mastery}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-[#c8b88f]">Mastery {mastery}%</p>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-lg border border-amber-300/25 bg-[#0f100d] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Active Chamber</p>
                <h2 className="mt-1 text-2xl font-bold text-white">{selectedChapter}</h2>
                <p className="mt-1 text-sm text-[#c8b88f]">Main speed, Advanced depth, formula recall, PYQs, error repair, and revision all in one place.</p>
              </div>
              <button onClick={toggleChapterDone} className={`rounded-lg px-4 py-2 text-sm font-bold ${state.progress[chapterKey] ? 'bg-[#77d6ff] text-black' : 'bg-amber-300 text-black'}`}>
                {state.progress[chapterKey] ? 'Mastered' : 'Mark Mastered'}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {['NCERT base', 'Formula sheet', 'JEE Main PYQs', 'Advanced problems', 'Timed DPP', 'Mock review', 'Error patterns', 'Ask Oracle'].map((item) => (
                <button key={item} className="rounded-lg border border-white/10 bg-white/5 px-3 py-4 text-sm font-semibold text-[#f7ead0] hover:border-amber-300/60">
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[0.7fr_1fr]">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">Mastery percentage</span>
                  <span className="text-amber-300">{currentMastery}%</span>
                </div>
                <input type="range" min="0" max="100" value={currentMastery} onChange={(event) => updateMastery(event.target.value)} className="mt-3 w-full accent-amber-300" />
                <p className="mt-3 text-sm text-[#c8b88f]">Difficulty status: {currentMastery < 40 ? 'Danger chamber' : currentMastery < 75 ? 'Needs dueling practice' : 'Ready for mixed tests'}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <h3 className="flex items-center gap-2 font-bold text-white"><Lightbulb size={18} /> Oracle recommendation</h3>
                <p className="mt-2 text-sm leading-6 text-[#d8c7a0]">
                  {currentMastery < 45 ? `Repair prerequisites before Advanced-level work in ${selectedChapter}.` : currentMastery < 80 ? 'Do timed PYQs and add every miss to the mistake journal.' : 'Switch to mixed Main + Advanced revision so the chapter survives pressure.'}
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel icon={Clock} title="Revision Spell Engine">
              {['First recall: same day', 'Second recall: after 3 days', 'Third recall: after 10 days', 'Monthly mixed revision', 'Final 45-day rank sprint'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-white/5 p-3 text-sm text-[#d8c7a0]">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-300 text-xs font-bold text-black">{index + 1}</span>
                  {item}
                </div>
              ))}
            </Panel>

            <Panel icon={LineChart} title="Mock Test Observatory">
              <div className="flex h-28 items-end gap-2">
                {state.mockScores.map((score, index) => {
                  const height = Math.max(12, Math.min(100, Math.round((score / 300) * 100)))
                  return (
                    <div key={`${score}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t bg-amber-300" style={{ height: `${height}%` }} />
                      <span className="text-xs text-[#c8b88f]">{score}</span>
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#c8b88f]">
                <span>Main target: {mainTarget}+</span>
                <span>Advanced target: {advancedTarget}+</span>
                <span>Latest: {latestMock}</span>
                <span>Trend: {mockDelta >= 0 ? '+' : ''}{mockDelta}</span>
              </div>
              <button onClick={addMockScore} className="rounded-lg bg-amber-300 px-4 py-2 text-sm font-bold text-black">Add mock result</button>
            </Panel>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel icon={Trophy} title="Daily Duel Arena">
              {Object.entries({ concept: 'One concept chamber', pyq: '35 JEE Main PYQs', advanced: '8 Advanced problems', mock: 'Timed mixed set', journal: 'Mistake repair log' }).map(([key, label]) => (
                <button key={key} onClick={() => patchState({ missions: { ...state.missions, [key]: !state.missions[key] } })} className={`flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm font-semibold ${state.missions[key] ? 'bg-amber-300 text-black' : 'bg-white/5 text-[#f7ead0]'}`}>
                  <CheckCircle2 size={18} /> {label}
                </button>
              ))}
              <p className="text-sm text-amber-300">House points earned today: {missionCount * 60}</p>
            </Panel>

            <Panel icon={AlertTriangle} title="Mistake Pensieve">
              <button onClick={addMistake} className="rounded-lg bg-amber-300 px-4 py-2 text-sm font-bold text-black">Log current chapter mistake</button>
              {state.mistakes.slice(0, 4).map((mistake) => (
                <button key={mistake.id} onClick={() => toggleMistake(mistake.id)} className={`w-full rounded-lg border p-3 text-left text-sm ${mistake.fixed ? 'border-[#77d6ff] bg-[#77d6ff]/10' : 'border-white/10 bg-white/5'}`}>
                  <span className="font-bold text-white">{mistake.chapter}</span>
                  <span className="ml-2 rounded bg-black/30 px-2 py-1 text-xs text-amber-300">{mistake.tag}</span>
                  <p className="mt-2 text-[#d8c7a0]">{mistake.note}</p>
                </button>
              ))}
            </Panel>
          </section>
        </main>

        <aside className="space-y-6">
          <Panel icon={Crown} title="Sorting Crown Verdict">
            <div className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-4">
              <p className="text-sm text-[#c8b88f]">Current focus</p>
              <p className="mt-1 text-xl font-bold text-white" style={{ color: activeHouse.accent }}>{activeHouse.title}</p>
              <p className="mt-2 text-sm text-[#d8c7a0]">Protect this lane today before opening extra distractions.</p>
            </div>
          </Panel>

          <Panel icon={Sparkles} title="The Oracle">
            <textarea
              value={state.mentorPrompt}
              onChange={(event) => patchState({ mentorPrompt: event.target.value })}
              placeholder="Ask: IIT Bombay plan, AI roadmap, quant roadmap, weak-topic diagnosis..."
              className="min-h-[96px] w-full rounded-lg border border-white/10 bg-black/25 p-3 text-sm text-white outline-none placeholder:text-[#8e7b55]"
            />
            <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-3 text-sm leading-6 text-[#d8c7a0]">{mentorReply}</div>
          </Panel>

          <Panel icon={Brain} title="Knowledge Graph">
            <GraphNode title={selectedChapter} items={['Prerequisites', 'Formula sheet', 'Main PYQs', 'Advanced traps', 'Mistakes', 'Mock data']} />
            <GraphNode title="Weak chambers" items={weakChapters.slice(0, 3).map((item) => item.chapter)} muted />
          </Panel>

          <Panel icon={FlaskConical} title="Mastery Paths">
            {masteryPaths.map((path) => (
              <div key={path.title} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="font-bold text-white">{path.title}</p>
                <div className="mt-3 grid gap-2">
                  {path.items.map((item) => {
                    const key = `${path.title}:${item}`
                    return (
                      <button key={item} onClick={() => togglePathItem(path.title, item)} className={`rounded-lg px-3 py-2 text-left text-xs ${state.pathDone[key] ? 'bg-amber-300 text-black' : 'bg-white/5 text-[#d8c7a0]'}`}>
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </Panel>

          <Panel icon={Library} title="Restricted Library">
            {['NCERT line-by-line for Chemistry', 'Cengage or equivalent problem ladder', 'Previous 15 years PYQs', 'Mock analysis ledger', 'Formula recall cards', 'Python + ML notebook vault', 'Probability and statistics notes'].map((resource) => (
              <div key={resource} className="rounded-lg bg-white/5 p-3 text-sm text-[#d8c7a0]">{resource}</div>
            ))}
          </Panel>

          <Panel icon={PenLine} title="Strategy Room">
            {['Monthly rank sprint', 'Weekly mock review', 'Daily 3-subject rotation', 'Sleep and recovery guardrail', 'No-backlog rule'].map((item) => (
              <label key={item} className="flex items-center gap-3 rounded-lg bg-white/5 p-3 text-sm text-[#d8c7a0]">
                <input type="checkbox" className="accent-amber-300" /> {item}
              </label>
            ))}
          </Panel>
        </aside>
      </div>
    </div>
  )
}

const DateInput = ({ label, value, onChange }) => (
  <label className="text-xs text-[#c8b88f]">
    {label}
    <input
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 block w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
    />
  </label>
)

const Metric = ({ icon: Icon, label, value, detail }) => (
  <div className="rounded-lg border border-amber-300/15 bg-white/[0.055] p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-[#c8b88f]">{label}</p>
        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      </div>
      <Icon className="text-amber-300" size={28} />
    </div>
    <p className="mt-3 text-xs text-[#9a8b69]">{detail}</p>
  </div>
)

const Panel = ({ icon: Icon, title, children }) => (
  <section className="rounded-lg border border-amber-300/15 bg-white/[0.035] p-5">
    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white"><Icon size={20} className="text-amber-300" /> {title}</h2>
    <div className="space-y-3">{children}</div>
  </section>
)

const GraphNode = ({ title, items, muted = false }) => (
  <div className={`rounded-lg border p-3 ${muted ? 'border-white/10 bg-black/20' : 'border-amber-300/25 bg-[#1b140b]'}`}>
    <p className="font-bold text-white">{title}</p>
    <div className="mt-3 space-y-2 border-l border-amber-300/40 pl-4">
      {items.map((item) => (
        <p key={item} className="text-sm text-[#d8c7a0]">{item}</p>
      ))}
    </div>
  </div>
)

export default JeePrep
