import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Code2,
  Compass,
  Dumbbell,
  GraduationCap,
  LineChart,
  PenLine,
  Plus,
  Save,
  Target,
  Trash2,
  Trophy,
} from 'lucide-react'

const storageKey = 'studyHub.monthCommandCenter'

const focusLanes = [
  {
    id: 'jee',
    title: 'JEE Preparation',
    subtitle: 'Physics, Chemistry, Maths practice and revision',
    icon: Target,
    color: 'bg-orange-500',
    route: '/jee-prep',
  },
  {
    id: 'hsc',
    title: 'HSC Studies',
    subtitle: 'Board subjects, assignments, tests and notes',
    icon: GraduationCap,
    color: 'bg-blue-600',
    route: '/subjects',
  },
  {
    id: 'math-english',
    title: 'Math and English',
    subtitle: 'Problem solving, vocabulary, writing and fluency',
    icon: BookOpen,
    color: 'bg-emerald-600',
    route: '/english-fluency',
  },
  {
    id: 'coding',
    title: 'Coding Skills',
    subtitle: 'Python, SQL, web scraping and project work',
    icon: Code2,
    color: 'bg-slate-800',
    route: '/coding',
  },
  {
    id: 'markets',
    title: 'Markets and Finance',
    subtitle: 'Trends, profit and loss, short-term and long-term ideas',
    icon: LineChart,
    color: 'bg-teal-600',
    route: '/stock-market',
  },
  {
    id: 'career',
    title: 'AI Engineer and Quant Analyst',
    subtitle: 'Portfolio, projects, research and career roadmap',
    icon: Briefcase,
    color: 'bg-violet-600',
    route: '/career',
  },
  {
    id: 'youtube',
    title: 'YouTube Channel',
    subtitle: 'Ideas, scripts, filming, editing and publishing',
    icon: PenLine,
    color: 'bg-red-600',
    route: '/notebooklm',
  },
  {
    id: 'explore-compete',
    title: 'Explore and Compete',
    subtitle: 'Nature, tech, sports, debates and olympiads',
    icon: Compass,
    color: 'bg-lime-600',
    route: '/achievements',
  },
]

const defaultHabits = [
  { id: 'deep-work', label: 'Two deep work blocks', done: false },
  { id: 'revision', label: 'Revision before sleep', done: false },
  { id: 'practice', label: 'Timed practice set', done: false },
  { id: 'english', label: 'English reading or writing', done: false },
  { id: 'health', label: 'Movement or sport', done: false },
]

const weekRhythm = [
  { day: 'Mon', primary: 'JEE concepts', secondary: 'Python practice' },
  { day: 'Tue', primary: 'HSC writing', secondary: 'English fluency' },
  { day: 'Wed', primary: 'Math drill', secondary: 'SQL or scraping' },
  { day: 'Thu', primary: 'JEE test review', secondary: 'Market notes' },
  { day: 'Fri', primary: 'Career project', secondary: 'YouTube script' },
  { day: 'Sat', primary: 'Mock test', secondary: 'Competition prep' },
  { day: 'Sun', primary: 'Weekly reset', secondary: 'Nature or tech exploration' },
]

const makeInitialState = () => ({
  monthTheme: 'Build calm consistency for JEE, HSC, skills and future goals.',
  monthTarget: 'Finish the month with visible proof: solved papers, notes, code commits, market journal entries and one published/edited video.',
  dailyAnchor: 'Study first, then skill-building, then creative or exploratory work.',
  lanes: focusLanes.reduce((acc, lane) => {
    acc[lane.id] = {
      target: lane.subtitle,
      planned: lane.id === 'jee' || lane.id === 'hsc' ? 24 : 12,
      completed: 0,
    }
    return acc
  }, {}),
  tasks: [
    { id: 'task-jee-physics', title: 'Solve one JEE Physics problem set', lane: 'jee', priority: 'High', day: 'Today', done: false },
    { id: 'task-hsc-notes', title: 'Revise one HSC chapter and write summary notes', lane: 'hsc', priority: 'High', day: 'Today', done: false },
    { id: 'task-coding-python', title: 'Practice Python for 45 minutes', lane: 'coding', priority: 'Medium', day: 'This week', done: false },
    { id: 'task-market-journal', title: 'Write one market trend observation', lane: 'markets', priority: 'Medium', day: 'This week', done: false },
  ],
  habits: defaultHabits,
  marketJournal: 'Track: index trend, one stock idea, reason for entry, risk, exit plan, what I learned.',
  contentPipeline: 'Ideas: study-with-me, JEE self-study routine, coding notes, nature/tech exploration, monthly reset.',
  reflection: 'What deserves my attention this month? What can wait? What would make future me proud?',
})

const readCommandCenter = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey))
    return saved ? { ...makeInitialState(), ...saved } : makeInitialState()
  } catch {
    return makeInitialState()
  }
}

const getMonthLabel = () => {
  return new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

const Dashboard = () => {
  const [command, setCommand] = useState(readCommandCenter)
  const [newTask, setNewTask] = useState({ title: '', lane: 'jee', priority: 'High', day: 'Today' })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(command))
  }, [command])

  const stats = useMemo(() => {
    const taskTotal = command.tasks.length
    const taskDone = command.tasks.filter((task) => task.done).length
    const habitTotal = command.habits.length
    const habitDone = command.habits.filter((habit) => habit.done).length
    const plannedSessions = Object.values(command.lanes).reduce((sum, lane) => sum + Number(lane.planned || 0), 0)
    const completedSessions = Object.values(command.lanes).reduce((sum, lane) => sum + Number(lane.completed || 0), 0)
    const taskPercent = taskTotal ? Math.round((taskDone / taskTotal) * 100) : 0
    const habitPercent = habitTotal ? Math.round((habitDone / habitTotal) * 100) : 0
    const sessionPercent = plannedSessions ? Math.min(100, Math.round((completedSessions / plannedSessions) * 100)) : 0
    const overall = Math.round((taskPercent + habitPercent + sessionPercent) / 3)

    return {
      taskDone,
      taskTotal,
      habitDone,
      habitTotal,
      completedSessions,
      plannedSessions,
      taskPercent,
      habitPercent,
      sessionPercent,
      overall,
    }
  }, [command])

  const todayTasks = command.tasks.filter((task) => task.day === 'Today')
  const openTasks = command.tasks.filter((task) => !task.done)

  const updateField = (field, value) => {
    setCommand((current) => ({ ...current, [field]: value }))
  }

  const updateLane = (laneId, field, value) => {
    setCommand((current) => ({
      ...current,
      lanes: {
        ...current.lanes,
        [laneId]: {
          ...current.lanes[laneId],
          [field]: value,
        },
      },
    }))
  }

  const incrementLane = (laneId, change) => {
    setCommand((current) => {
      const lane = current.lanes[laneId]
      const nextCompleted = Math.max(0, Math.min(Number(lane.planned || 0), Number(lane.completed || 0) + change))
      return {
        ...current,
        lanes: {
          ...current.lanes,
          [laneId]: { ...lane, completed: nextCompleted },
        },
      }
    })
  }

  const toggleTask = (taskId) => {
    setCommand((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)),
    }))
  }

  const deleteTask = (taskId) => {
    setCommand((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== taskId) }))
  }

  const addTask = (event) => {
    event.preventDefault()
    const title = newTask.title.trim()
    if (!title) return

    setCommand((current) => ({
      ...current,
      tasks: [
        { ...newTask, id: `task-${Date.now()}`, title, done: false },
        ...current.tasks,
      ],
    }))
    setNewTask({ title: '', lane: newTask.lane, priority: newTask.priority, day: newTask.day })
  }

  const toggleHabit = (habitId) => {
    setCommand((current) => ({
      ...current,
      habits: current.habits.map((habit) => (habit.id === habitId ? { ...habit, done: !habit.done } : habit)),
    }))
  }

  const resetToday = () => {
    setCommand((current) => ({
      ...current,
      habits: current.habits.map((habit) => ({ ...habit, done: false })),
      tasks: current.tasks.map((task) => (task.day === 'Today' ? { ...task, done: false } : task)),
    }))
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 xl:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <section className="bg-slate-950 text-white p-6 sm:p-8 shadow-xl">
          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr] xl:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-2 text-sm font-semibold text-emerald-100">
                  <CalendarDays size={16} /> {getMonthLabel()}
                </span>
                <span className="inline-flex items-center gap-2 bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950">
                  <Save size={16} /> Auto-saved
                </span>
              </div>
              <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
                Monthly command center for serious self-study.
              </h1>
              <textarea
                value={command.monthTheme}
                onChange={(event) => updateField('monthTheme', event.target.value)}
                className="mt-5 min-h-[92px] w-full resize-none bg-white/10 p-4 text-base leading-7 text-slate-100 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
              <div className="bg-white p-4 text-slate-950">
                <p className="text-sm font-semibold text-slate-500">Overall</p>
                <p className="mt-2 text-3xl font-bold">{stats.overall}%</p>
              </div>
              <div className="bg-white p-4 text-slate-950">
                <p className="text-sm font-semibold text-slate-500">Tasks</p>
                <p className="mt-2 text-3xl font-bold">{stats.taskDone}/{stats.taskTotal}</p>
              </div>
              <div className="bg-white p-4 text-slate-950">
                <p className="text-sm font-semibold text-slate-500">Habits</p>
                <p className="mt-2 text-3xl font-bold">{stats.habitDone}/{stats.habitTotal}</p>
              </div>
              <div className="bg-white p-4 text-slate-950">
                <p className="text-sm font-semibold text-slate-500">Sessions</p>
                <p className="mt-2 text-3xl font-bold">{stats.completedSessions}/{stats.plannedSessions}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_.9fr]">
          <div className="bg-white p-5 shadow-lg sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-emerald-700">This month</p>
                <h2 className="text-2xl font-bold text-slate-900">Main outcome</h2>
              </div>
              <div className="h-2 w-full bg-slate-200 sm:w-64">
                <div className="h-2 bg-emerald-600" style={{ width: `${stats.overall}%` }} />
              </div>
            </div>
            <textarea
              value={command.monthTarget}
              onChange={(event) => updateField('monthTarget', event.target.value)}
              className="min-h-[112px] w-full resize-none bg-slate-50 p-4 text-slate-700 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Link to="/planner" className="inline-flex items-center justify-center gap-2 bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800">
                <CalendarDays size={18} /> Weekly planner
              </Link>
              <Link to="/study-hall" className="inline-flex items-center justify-center gap-2 bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700">
                <Clock3 size={18} /> Study hall
              </Link>
              <Link to="/analytics" className="inline-flex items-center justify-center gap-2 bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">
                <BarChart3 size={18} /> Analytics
              </Link>
            </div>
          </div>

          <div className="bg-white p-5 shadow-lg sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase text-emerald-700">Daily anchor</p>
                <h2 className="text-2xl font-bold text-slate-900">Non-negotiable order</h2>
              </div>
              <Brain className="text-emerald-700" />
            </div>
            <textarea
              value={command.dailyAnchor}
              onChange={(event) => updateField('dailyAnchor', event.target.value)}
              className="min-h-[150px] w-full resize-none bg-slate-50 p-4 text-slate-700 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {focusLanes.map((lane) => {
            const laneData = command.lanes[lane.id]
            const percent = laneData.planned ? Math.min(100, Math.round((laneData.completed / laneData.planned) * 100)) : 0
            return (
              <div key={lane.id} className="bg-white p-5 shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`${lane.color} p-3 text-white`}>
                      <lane.icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{lane.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{lane.subtitle}</p>
                    </div>
                  </div>
                  <Link to={lane.route} className="text-sm font-bold text-emerald-700 hover:text-emerald-900">Open</Link>
                </div>

                <input
                  value={laneData.target}
                  onChange={(event) => updateLane(lane.id, 'target', event.target.value)}
                  className="mb-4 w-full bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500"
                />

                <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-600">
                  <span>{laneData.completed}/{laneData.planned} sessions</span>
                  <span>{percent}%</span>
                </div>
                <div className="h-2 bg-slate-200">
                  <div className="h-2 bg-emerald-600" style={{ width: `${percent}%` }} />
                </div>

                <div className="mt-4 grid grid-cols-[1fr_1fr_1.2fr] gap-2">
                  <button onClick={() => incrementLane(lane.id, -1)} className="bg-slate-100 px-3 py-2 font-bold text-slate-700 hover:bg-slate-200">-</button>
                  <button onClick={() => incrementLane(lane.id, 1)} className="bg-slate-900 px-3 py-2 font-bold text-white hover:bg-slate-800">Done</button>
                  <input
                    type="number"
                    min="0"
                    value={laneData.planned}
                    onChange={(event) => updateLane(lane.id, 'planned', Number(event.target.value))}
                    className="bg-slate-50 px-3 py-2 text-center font-bold text-slate-700 outline-none ring-1 ring-slate-200"
                  />
                </div>
              </div>
            )
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <div className="bg-white p-5 shadow-lg sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-emerald-700">Execution</p>
                <h2 className="text-2xl font-bold text-slate-900">Tasks that move the month</h2>
              </div>
              <button onClick={resetToday} className="inline-flex items-center justify-center gap-2 bg-slate-100 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-200">
                <Circle size={18} /> Reset today
              </button>
            </div>

            <form onSubmit={addTask} className="mb-5 grid gap-3 lg:grid-cols-[1fr_180px_130px_130px_auto]">
              <input
                value={newTask.title}
                onChange={(event) => setNewTask((task) => ({ ...task, title: event.target.value }))}
                placeholder="Add a concrete next action"
                className="bg-slate-50 px-3 py-3 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={newTask.lane}
                onChange={(event) => setNewTask((task) => ({ ...task, lane: event.target.value }))}
                className="bg-slate-50 px-3 py-3 outline-none ring-1 ring-slate-200"
              >
                {focusLanes.map((lane) => <option key={lane.id} value={lane.id}>{lane.title}</option>)}
              </select>
              <select
                value={newTask.priority}
                onChange={(event) => setNewTask((task) => ({ ...task, priority: event.target.value }))}
                className="bg-slate-50 px-3 py-3 outline-none ring-1 ring-slate-200"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select
                value={newTask.day}
                onChange={(event) => setNewTask((task) => ({ ...task, day: event.target.value }))}
                className="bg-slate-50 px-3 py-3 outline-none ring-1 ring-slate-200"
              >
                <option>Today</option>
                <option>This week</option>
                <option>This month</option>
              </select>
              <button className="inline-flex items-center justify-center gap-2 bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700">
                <Plus size={18} /> Add
              </button>
            </form>

            <div className="space-y-3">
              {openTasks.length === 0 ? (
                <div className="bg-emerald-50 p-4 font-semibold text-emerald-800">All listed tasks are complete.</div>
              ) : (
                command.tasks.map((task) => {
                  const lane = focusLanes.find((item) => item.id === task.lane) || focusLanes[0]
                  return (
                    <div key={task.id} className={`grid gap-3 bg-slate-50 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center ${task.done ? 'opacity-60' : ''}`}>
                      <button onClick={() => toggleTask(task.id)} className="text-emerald-700">
                        {task.done ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>
                      <div>
                        <p className={`font-bold text-slate-900 ${task.done ? 'line-through' : ''}`}>{task.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{lane.title} - {task.priority} - {task.day}</p>
                      </div>
                      <button onClick={() => deleteTask(task.id)} className="inline-flex items-center justify-center bg-white p-2 text-slate-500 ring-1 ring-slate-200 hover:text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 shadow-lg sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase text-emerald-700">Today</p>
                  <h2 className="text-2xl font-bold text-slate-900">Small wins</h2>
                </div>
                <Trophy className="text-amber-500" />
              </div>
              <div className="space-y-3">
                {command.habits.map((habit) => (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className="flex w-full items-center gap-3 bg-slate-50 p-3 text-left font-semibold text-slate-700 hover:bg-emerald-50"
                  >
                    {habit.done ? <CheckCircle2 className="text-emerald-600" size={22} /> : <Circle className="text-slate-400" size={22} />}
                    {habit.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 shadow-lg sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <Dumbbell className="text-emerald-700" />
                <h2 className="text-2xl font-bold text-slate-900">Today queue</h2>
              </div>
              <div className="space-y-3">
                {todayTasks.length === 0 ? (
                  <p className="text-slate-500">No tasks marked for today.</p>
                ) : (
                  todayTasks.map((task) => <p key={task.id} className="bg-slate-50 p-3 font-semibold text-slate-700">{task.title}</p>)
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="bg-white p-5 shadow-lg sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <CalendarDays className="text-emerald-700" />
              <h2 className="text-2xl font-bold text-slate-900">Weekly rhythm</h2>
            </div>
            <div className="space-y-3">
              {weekRhythm.map((item) => (
                <div key={item.day} className="grid grid-cols-[52px_1fr] gap-3 bg-slate-50 p-3">
                  <p className="font-bold text-slate-900">{item.day}</p>
                  <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">{item.primary}</span> plus {item.secondary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 shadow-lg sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <LineChart className="text-emerald-700" />
              <h2 className="text-2xl font-bold text-slate-900">Market journal</h2>
            </div>
            <textarea
              value={command.marketJournal}
              onChange={(event) => updateField('marketJournal', event.target.value)}
              className="min-h-[330px] w-full resize-none bg-slate-50 p-4 text-slate-700 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="bg-white p-5 shadow-lg sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <PenLine className="text-emerald-700" />
              <h2 className="text-2xl font-bold text-slate-900">Channel and reflection</h2>
            </div>
            <label className="mb-2 block text-sm font-bold text-slate-600">YouTube pipeline</label>
            <textarea
              value={command.contentPipeline}
              onChange={(event) => updateField('contentPipeline', event.target.value)}
              className="mb-4 min-h-[130px] w-full resize-none bg-slate-50 p-4 text-slate-700 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
            <label className="mb-2 block text-sm font-bold text-slate-600">Monthly reflection</label>
            <textarea
              value={command.reflection}
              onChange={(event) => updateField('reflection', event.target.value)}
              className="min-h-[130px] w-full resize-none bg-slate-50 p-4 text-slate-700 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
