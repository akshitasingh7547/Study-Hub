import React, { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Library,
  Lightbulb,
  PenLine,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'
import { jeeMainSyllabus } from '../data/studyHubData'

const storageKey = 'studyHub.examMission'

const examProfiles = {
  'JEE Main': {
    icon: 'Rocket',
    targetDate: '2027-01-20',
    subjects: jeeMainSyllabus,
    resources: ['NCERT + PYQ ladder', 'NTA practice papers', 'Formula sprint sheets'],
    scoreGoal: 220,
  },
  'JEE Advanced': {
    icon: 'Brain',
    targetDate: '2027-05-23',
    subjects: jeeMainSyllabus,
    resources: ['Advanced problem sets', 'Topic-wise PYQs', 'Mixed concept drills'],
    scoreGoal: 180,
  },
  NEET: {
    icon: 'Medical',
    targetDate: '2027-05-02',
    subjects: {
      Physics: jeeMainSyllabus.Physics,
      Chemistry: jeeMainSyllabus.Chemistry,
      Biology: [
        'Diversity in Living World',
        'Structural Organisation',
        'Cell Structure and Function',
        'Plant Physiology',
        'Human Physiology',
        'Reproduction',
        'Genetics and Evolution',
        'Biology and Human Welfare',
        'Biotechnology',
        'Ecology and Environment',
      ],
    },
    resources: ['NCERT line-by-line review', 'Diagram memory sheets', 'Full biology revision packs'],
    scoreGoal: 650,
  },
  UPSC: {
    icon: 'Capitol',
    targetDate: '2027-06-06',
    subjects: {
      'General Studies': ['History', 'Geography', 'Polity', 'Economy', 'Environment', 'Science and Technology'],
      'Current Affairs': ['Monthly magazines', 'Government schemes', 'International relations', 'Editorial notes'],
      CSAT: ['Comprehension', 'Reasoning', 'Quantitative aptitude', 'Decision making'],
    },
    resources: ['NCERT foundation', 'Newspaper notes', 'Mains answer writing bank'],
    scoreGoal: 110,
  },
  CAT: {
    icon: 'Chart',
    targetDate: '2026-11-29',
    subjects: {
      VARC: ['Reading Comprehension', 'Para Jumbles', 'Summary', 'Odd Sentence Out'],
      DILR: ['Arrangements', 'Games and Tournaments', 'Charts', 'Caselets'],
      Quant: ['Arithmetic', 'Algebra', 'Geometry', 'Number System', 'Modern Math'],
    },
    resources: ['Sectional mocks', 'RC habit tracker', 'DILR set archive'],
    scoreGoal: 95,
  },
  CUET: {
    icon: 'Briefcase',
    targetDate: '2027-05-15',
    subjects: {
      Language: ['Reading comprehension', 'Vocabulary', 'Grammar', 'Writing skills'],
      Domain: ['Physics', 'Chemistry', 'Math', 'Biology', 'Economics', 'Business Studies'],
      'General Test': ['Current affairs', 'Logical reasoning', 'Quantitative aptitude', 'General knowledge'],
    },
    resources: ['Domain notes', 'Vocabulary bank', 'Timed general test drills'],
    scoreGoal: 700,
  },
  SAT: {
    icon: 'Graduation',
    targetDate: '2026-12-05',
    subjects: {
      'Reading and Writing': ['Information and Ideas', 'Craft and Structure', 'Expression of Ideas', 'Standard English'],
      Math: ['Algebra', 'Advanced Math', 'Problem Solving', 'Geometry and Trigonometry'],
    },
    resources: ['Bluebook practice', 'Error pattern journal', 'Desmos strategy notes'],
    scoreGoal: 1450,
  },
}

const defaultMistakes = [
  { id: 1, chapter: 'Rotational Motion', tag: 'Concept', note: 'Confused torque direction in rolling motion.', fixed: false },
  { id: 2, chapter: 'Organic Chemistry', tag: 'Silly', note: 'Missed reagent condition while rushing.', fixed: false },
]

const defaultMockScores = [58, 64, 71, 76, 82]

const getDaysLeft = (targetDate) => {
  const today = new Date()
  const target = new Date(`${targetDate}T00:00:00`)
  const diff = target.getTime() - today.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil(diff / 86400000))
}

const getChapterKey = (exam, subject, chapter) => `${exam}:${subject}:${chapter}`

const buildMentorReply = (prompt, chapter, weakChapters, selectedExam) => {
  if (!prompt.trim()) return 'Ask The Archivist what to explain, generate, plan, or diagnose.'
  const focus = weakChapters[0]?.chapter || chapter
  if (/plan|schedule|revision/i.test(prompt)) {
    return `Start with ${focus}, then do a timed mixed drill, then review mistakes. For ${selectedExam}, keep one short revision loop today and one mock-analysis loop this week.`
  }
  if (/mistake|wrong|why/i.test(prompt)) {
    return `Your first suspect is prerequisite weakness around ${focus}. Re-solve 5 easy questions, 5 medium questions, then write one line for every error before attempting hard problems.`
  }
  if (/generate|questions|problems/i.test(prompt)) {
    return `Generated drill idea: 10 concept checks, 10 previous-year style questions, and 5 challenge questions from ${chapter}. Mark each as Concept, Calculation, Silly, or Time.`
  }
  return `For ${chapter}, learn the core idea visually, solve two examples slowly, then do a 25-minute practice sprint. I would connect this to ${focus} before moving ahead.`
}

const JeePrep = () => {
  const [state, setState] = useState(() => ({
    selectedExam: 'JEE Main',
    selectedSubject: 'Physics',
    selectedChapter: 'Kinematics',
    progress: {},
    mastery: {},
    targetDates: {},
    missions: {
      study: false,
      pyq: false,
      mock: false,
      journal: false,
    },
    mockScores: defaultMockScores,
    mistakes: defaultMistakes,
    mentorPrompt: '',
  }))
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setState((current) => ({ ...current, ...JSON.parse(saved) }))
    }
    setHasLoaded(true)
  }, [])

  useEffect(() => {
    if (!hasLoaded) return
    localStorage.setItem(storageKey, JSON.stringify(state))
    window.dispatchEvent(new Event('studyHubProgressUpdated'))
  }, [state, hasLoaded])

  const selectedProfile = examProfiles[state.selectedExam]
  const subjects = Object.keys(selectedProfile.subjects)
  const chapters = selectedProfile.subjects[state.selectedSubject] || []
  const selectedChapter = chapters.includes(state.selectedChapter) ? state.selectedChapter : chapters[0]
  const targetDate = state.targetDates[state.selectedExam] || selectedProfile.targetDate
  const daysLeft = getDaysLeft(targetDate)

  const stats = useMemo(() => {
    return subjects.map((subject) => {
      const total = selectedProfile.subjects[subject].length
      const done = selectedProfile.subjects[subject].filter((chapter) => state.progress[getChapterKey(state.selectedExam, subject, chapter)]).length
      const masteryTotal = selectedProfile.subjects[subject].reduce((sum, chapter) => {
        return sum + Number(state.mastery[getChapterKey(state.selectedExam, subject, chapter)] || 0)
      }, 0)
      return {
        subject,
        total,
        done,
        percent: total ? Math.round((done / total) * 100) : 0,
        mastery: total ? Math.round(masteryTotal / total) : 0,
      }
    })
  }, [selectedProfile, state.mastery, state.progress, state.selectedExam, subjects])

  const overall = useMemo(() => {
    const total = stats.reduce((sum, item) => sum + item.total, 0)
    const done = stats.reduce((sum, item) => sum + item.done, 0)
    return total ? Math.round((done / total) * 100) : 0
  }, [stats])

  const weakChapters = useMemo(() => {
    return subjects.flatMap((subject) => selectedProfile.subjects[subject].map((chapter) => ({
      subject,
      chapter,
      mastery: Number(state.mastery[getChapterKey(state.selectedExam, subject, chapter)] || 0),
    }))).sort((a, b) => a.mastery - b.mastery).slice(0, 5)
  }, [selectedProfile, state.mastery, state.selectedExam, subjects])

  const latestMock = state.mockScores[state.mockScores.length - 1] || 0
  const previousMock = state.mockScores[state.mockScores.length - 2] || latestMock
  const mockDelta = latestMock - previousMock
  const missionCount = Object.values(state.missions).filter(Boolean).length
  const chapterKey = getChapterKey(state.selectedExam, state.selectedSubject, selectedChapter)
  const currentMastery = Number(state.mastery[chapterKey] || 0)
  const mentorReply = buildMentorReply(state.mentorPrompt, selectedChapter, weakChapters, state.selectedExam)

  const patchState = (patch) => setState((current) => ({ ...current, ...patch }))

  const selectExam = (exam) => {
    const firstSubject = Object.keys(examProfiles[exam].subjects)[0]
    patchState({
      selectedExam: exam,
      selectedSubject: firstSubject,
      selectedChapter: examProfiles[exam].subjects[firstSubject][0],
    })
  }

  const selectSubject = (subject) => {
    patchState({ selectedSubject: subject, selectedChapter: selectedProfile.subjects[subject][0] })
  }

  const toggleChapterDone = () => {
    patchState({ progress: { ...state.progress, [chapterKey]: !state.progress[chapterKey] } })
  }

  const updateMastery = (value) => {
    patchState({ mastery: { ...state.mastery, [chapterKey]: Number(value) } })
  }

  const addMockScore = () => {
    const nextScore = Math.min(selectedProfile.scoreGoal, Math.max(0, latestMock + 4))
    patchState({ mockScores: [...state.mockScores.slice(-5), nextScore] })
  }

  const addMistake = () => {
    patchState({
      mistakes: [
        { id: Date.now(), chapter: selectedChapter, tag: 'Concept', note: `Review ${selectedChapter} before the next mock.`, fixed: false },
        ...state.mistakes,
      ],
    })
  }

  const toggleMistake = (id) => {
    patchState({ mistakes: state.mistakes.map((mistake) => mistake.id === id ? { ...mistake, fixed: !mistake.fixed } : mistake) })
  }

  return (
    <div className="min-h-screen bg-[#081310] text-[#f5e6c8] animate-fadeIn">
      <section className="border-b border-[#d4af37]/20 bg-[#081310] px-6 py-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#d4af37]">Competitive Exam Hub</p>
              <h1 className="mt-2 text-4xl font-bold text-white">Command Chamber</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#f5e6c8]/75">
                Everything needed to plan, learn, practice, revise, analyze, and research an exam from one focused workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(examProfiles).map((exam) => (
                <button
                  key={exam}
                  onClick={() => selectExam(exam)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${state.selectedExam === exam ? 'border-[#d4af37] bg-[#d4af37] text-[#081310]' : 'border-white/10 bg-white/5 text-[#f5e6c8] hover:bg-white/10'}`}
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric icon={Calendar} label="Days Left" value={daysLeft} detail="Based on your editable target date" />
            <Metric icon={BookOpen} label="Syllabus" value={`${overall}%`} detail="Completed chapters across subjects" />
            <Metric icon={BarChart3} label="Mock Trend" value={`${latestMock}`} detail={`${mockDelta >= 0 ? '+' : ''}${mockDelta} from last mock`} />
            <Metric icon={Flame} label="Daily Missions" value={`${missionCount}/4`} detail="Study, PYQs, mock, and review" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 px-6 py-8 lg:px-10 xl:grid-cols-[1.3fr_0.7fr]">
        <main className="space-y-6">
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-white"><Target size={22} /> Mission Dashboard</h2>
                <p className="mt-1 text-sm text-[#f5e6c8]/70">Set the exam date, track subjects, and let weak chapters decide the next mission.</p>
              </div>
              <label className="text-sm text-[#f5e6c8]/75">
                Target date
                <input
                  type="date"
                  value={targetDate}
                  onChange={(event) => patchState({ targetDates: { ...state.targetDates, [state.selectedExam]: event.target.value } })}
                  className="ml-3 rounded-lg border border-white/10 bg-[#0d1d18] px-3 py-2 text-white outline-none"
                />
              </label>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              {stats.map((item) => (
                <button
                  key={item.subject}
                  onClick={() => selectSubject(item.subject)}
                  className={`rounded-lg border p-4 text-left ${state.selectedSubject === item.subject ? 'border-[#d4af37] bg-[#123524]' : 'border-white/10 bg-[#0d1d18] hover:bg-[#123524]/80'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">{item.subject}</h3>
                    <span className="text-sm text-[#d4af37]">{item.done}/{item.total}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/30">
                    <div className="h-full bg-[#d4af37]" style={{ width: `${item.percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-[#f5e6c8]/65">Mastery average: {item.mastery}%</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Syllabus Navigator</h2>
                <p className="mt-1 text-sm text-[#f5e6c8]/70">Choose a subject and open a chapter workspace.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button key={subject} onClick={() => selectSubject(subject)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${state.selectedSubject === subject ? 'bg-[#d4af37] text-[#081310]' : 'bg-white/10 text-[#f5e6c8]'}`}>
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {chapters.map((chapter) => {
                const key = getChapterKey(state.selectedExam, state.selectedSubject, chapter)
                const done = Boolean(state.progress[key])
                const mastery = Number(state.mastery[key] || 0)
                return (
                  <button
                    key={chapter}
                    onClick={() => patchState({ selectedChapter: chapter })}
                    className={`rounded-lg border p-4 text-left ${selectedChapter === chapter ? 'border-[#d4af37] bg-[#123524]' : 'border-white/10 bg-[#0d1d18] hover:bg-[#123524]/70'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-white">{chapter}</span>
                      {done && <CheckCircle2 size={18} className="text-[#d4af37]" />}
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/30">
                      <div className="h-full bg-emerald-400" style={{ width: `${mastery}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-[#f5e6c8]/65">Mastery {mastery}%</p>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-lg border border-[#d4af37]/30 bg-[#0d1d18] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-[#d4af37]">Chapter Workspace</p>
                <h2 className="mt-1 text-2xl font-bold text-white">{selectedChapter}</h2>
                <p className="mt-1 text-sm text-[#f5e6c8]/70">Lecture, notes, formula sheet, PYQs, DPPs, mistakes, challenges, and tutor prompts stay together.</p>
              </div>
              <button onClick={toggleChapterDone} className={`rounded-lg px-4 py-2 text-sm font-bold ${state.progress[chapterKey] ? 'bg-emerald-500 text-[#081310]' : 'bg-[#d4af37] text-[#081310]'}`}>
                {state.progress[chapterKey] ? 'Completed' : 'Mark Complete'}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {['Best playlist', 'Notes', 'Formula sheet', 'PYQs', 'DPPs', 'Mock questions', 'Common mistakes', 'AI tutor'].map((item) => (
                <button key={item} className="rounded-lg border border-white/10 bg-white/5 px-3 py-4 text-sm font-semibold text-[#f5e6c8] hover:border-[#d4af37]/60">
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[0.7fr_1fr]">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">Mastery percentage</span>
                  <span className="text-[#d4af37]">{currentMastery}%</span>
                </div>
                <input type="range" min="0" max="100" value={currentMastery} onChange={(event) => updateMastery(event.target.value)} className="mt-3 w-full accent-[#d4af37]" />
                <p className="mt-3 text-sm text-[#f5e6c8]/70">Difficulty rating: {currentMastery < 40 ? 'High' : currentMastery < 75 ? 'Medium' : 'Controlled'}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <h3 className="flex items-center gap-2 font-bold text-white"><Lightbulb size={18} /> AI recommendation</h3>
                <p className="mt-2 text-sm leading-6 text-[#f5e6c8]/75">
                  {currentMastery < 45 ? `Repair prerequisites before pushing harder in ${selectedChapter}.` : currentMastery < 80 ? `Do timed PYQs and add every miss to the mistake journal.` : `Switch to mixed revision so the chapter stays sharp under pressure.`}
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel icon={Clock} title="Smart Revision Engine">
              {['First revision: within 24 hours', 'Second revision: after 3 days', 'Monthly revision: mixed with weak chapters', 'Final revision: last 14 days before exam'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-white/5 p-3 text-sm text-[#f5e6c8]/80">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d4af37] text-xs font-bold text-[#081310]">{index + 1}</span>
                  {item}
                </div>
              ))}
            </Panel>

            <Panel icon={BarChart3} title="Performance Analytics">
              <div className="flex items-end gap-2 h-28">
                {state.mockScores.map((score, index) => (
                  <div key={`${score}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t bg-emerald-400" style={{ height: `${Math.max(12, score)}%` }} />
                    <span className="text-xs text-[#f5e6c8]/65">{score}</span>
                  </div>
                ))}
              </div>
              <button onClick={addMockScore} className="mt-4 rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-bold text-[#081310]">Add mock result</button>
            </Panel>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel icon={Trophy} title="Battle Arena">
              {Object.entries({ study: 'Complete one chapter block', pyq: 'Solve 20 PYQs', mock: 'Attempt timed practice', journal: 'Review mistake journal' }).map(([key, label]) => (
                <button key={key} onClick={() => patchState({ missions: { ...state.missions, [key]: !state.missions[key] } })} className={`flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm font-semibold ${state.missions[key] ? 'bg-emerald-500 text-[#081310]' : 'bg-white/5 text-[#f5e6c8]'}`}>
                  <CheckCircle2 size={18} /> {label}
                </button>
              ))}
              <p className="text-sm text-[#d4af37]">XP earned today: {missionCount * 50}</p>
            </Panel>

            <Panel icon={AlertTriangle} title="Mistake Journal">
              <button onClick={addMistake} className="rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-bold text-[#081310]">Log current chapter mistake</button>
              {state.mistakes.slice(0, 4).map((mistake) => (
                <button key={mistake.id} onClick={() => toggleMistake(mistake.id)} className={`w-full rounded-lg border p-3 text-left text-sm ${mistake.fixed ? 'border-emerald-400 bg-emerald-400/15' : 'border-white/10 bg-white/5'}`}>
                  <span className="font-bold text-white">{mistake.chapter}</span>
                  <span className="ml-2 rounded bg-black/30 px-2 py-1 text-xs text-[#d4af37]">{mistake.tag}</span>
                  <p className="mt-2 text-[#f5e6c8]/75">{mistake.note}</p>
                </button>
              ))}
            </Panel>
          </section>
        </main>

        <aside className="space-y-6">
          <Panel icon={Sparkles} title="The Archivist">
            <textarea
              value={state.mentorPrompt}
              onChange={(event) => patchState({ mentorPrompt: event.target.value })}
              placeholder="Ask for an explanation, 7-day plan, weak-topic diagnosis, or problem set."
              className="min-h-[96px] w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white outline-none placeholder:text-[#f5e6c8]/40"
            />
            <div className="rounded-lg border border-[#d4af37]/20 bg-[#d4af37]/10 p-3 text-sm leading-6 text-[#f5e6c8]/85">{mentorReply}</div>
          </Panel>

          <Panel icon={Brain} title="Knowledge Graph">
            <div className="space-y-3 text-sm">
              <GraphNode title={selectedChapter} items={['Prerequisite concept', 'Formula sheet', 'PYQs', 'Mistakes', 'Mock analysis']} />
              <GraphNode title="Weak links" items={weakChapters.slice(0, 3).map((item) => item.chapter)} muted />
            </div>
          </Panel>

          <Panel icon={Library} title="Resource Library">
            {selectedProfile.resources.map((resource) => (
              <div key={resource} className="rounded-lg bg-white/5 p-3 text-sm text-[#f5e6c8]/80">{resource}</div>
            ))}
            <div className="rounded-lg bg-white/5 p-3 text-sm text-[#f5e6c8]/80">Best free lecture for {selectedChapter}</div>
            <div className="rounded-lg bg-white/5 p-3 text-sm text-[#f5e6c8]/80">Practice sheet + formula PDF</div>
          </Panel>

          <Panel icon={PenLine} title="Strategy Room">
            {['Yearly roadmap', 'Monthly milestone', 'Weekly goals', 'Daily mission order', 'Subject priority'].map((item) => (
              <label key={item} className="flex items-center gap-3 rounded-lg bg-white/5 p-3 text-sm text-[#f5e6c8]/80">
                <input type="checkbox" className="accent-[#d4af37]" /> {item}
              </label>
            ))}
          </Panel>

          <Panel icon={BookOpen} title="Research Corner">
            {['Exam pattern updates', 'Syllabus changes', 'Cut-off trends', 'College notes', 'Counselling strategy'].map((item) => (
              <div key={item} className="rounded-lg bg-white/5 p-3 text-sm text-[#f5e6c8]/80">{item}</div>
            ))}
          </Panel>
        </aside>
      </div>
    </div>
  )
}

const Metric = ({ icon: Icon, label, value, detail }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-[#f5e6c8]/65">{label}</p>
        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      </div>
      <Icon className="text-[#d4af37]" size={28} />
    </div>
    <p className="mt-3 text-xs text-[#f5e6c8]/55">{detail}</p>
  </div>
)

const Panel = ({ icon: Icon, title, children }) => (
  <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white"><Icon size={20} className="text-[#d4af37]" /> {title}</h2>
    <div className="space-y-3">{children}</div>
  </section>
)

const GraphNode = ({ title, items, muted = false }) => (
  <div className={`rounded-lg border p-3 ${muted ? 'border-white/10 bg-black/20' : 'border-[#d4af37]/30 bg-[#123524]'}`}>
    <p className="font-bold text-white">{title}</p>
    <div className="mt-3 space-y-2 border-l border-[#d4af37]/40 pl-4">
      {items.map((item) => (
        <p key={item} className="text-[#f5e6c8]/75">{item}</p>
      ))}
    </div>
  </div>
)

export default JeePrep
