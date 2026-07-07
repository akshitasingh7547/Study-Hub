import React, { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { plannerItems } from '../data/studyHubData'

const storageKey = 'studyHub.planner'

const readPlanner = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {}
  } catch {
    return {}
  }
}

const toLocalDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const eventTypes = ['Exam', 'Class test', 'Competition', 'Assignment', 'Revision', 'Practice test', 'Project', 'Reminder']
const subjects = ['General', ...plannerItems.map((item) => item.title)]

const CalendarPage = () => {
  const [monthDate, setMonthDate] = useState(() => new Date())
  const [events, setEvents] = useState([])
  const [hasLoaded, setHasLoaded] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: toLocalDate(new Date()),
    type: 'Exam',
    subject: 'General',
    notes: '',
  })

  useEffect(() => {
    const saved = readPlanner()
    setEvents(saved.events || [])
    setHasLoaded(true)
  }, [])

  useEffect(() => {
    if (!hasLoaded) return
    const saved = readPlanner()
    localStorage.setItem(storageKey, JSON.stringify({ ...saved, events }))
    window.dispatchEvent(new Event('studyHubPlannerUpdated'))
  }, [events, hasLoaded])

  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
  const firstDayOffset = monthStart.getDay()
  const daysInMonth = monthEnd.getDate()

  const calendarCells = useMemo(() => {
    const cells = []
    for (let i = 0; i < firstDayOffset; i += 1) cells.push(null)
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day))
    }
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [daysInMonth, firstDayOffset, monthDate])

  const eventsByDate = useMemo(() => {
    return events.reduce((grouped, event) => {
      grouped[event.date] = grouped[event.date] || []
      grouped[event.date].push(event)
      return grouped
    }, {})
  }, [events])

  const upcomingEvents = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8)
  const monthLabel = monthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) return
    setEvents([...events, { ...newEvent, id: Date.now() }].sort((a, b) => a.date.localeCompare(b.date)))
    setNewEvent({
      title: '',
      date: newEvent.date,
      type: 'Exam',
      subject: 'General',
      notes: '',
    })
  }

  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  const changeMonth = (amount) => {
    setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + amount, 1))
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">Calendar</h1>
        <p className="text-slytherin-600">See your month, add exams, competitions, events, and reminders.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-slytherin-700" />
              <h2 className="text-2xl font-bold text-slytherin-900">{monthLabel}</h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slytherin-100 text-slytherin-800 font-bold hover:bg-slytherin-200"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button
                onClick={() => setMonthDate(new Date())}
                className="px-4 py-2 rounded-lg bg-slytherin-600 text-white font-bold hover:bg-slytherin-700"
              >
                Today
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slytherin-100 text-slytherin-800 font-bold hover:bg-slytherin-200"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-bold text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((date, index) => {
              const iso = date ? toLocalDate(date) : ''
              const dayEvents = eventsByDate[iso] || []
              const isToday = iso === toLocalDate(new Date())

              return (
                <div
                  key={date ? iso : `blank-${index}`}
                  className={`min-h-[130px] rounded-xl border p-3 ${
                    date ? 'bg-slate-50 border-slate-200' : 'bg-transparent border-transparent'
                  } ${isToday ? 'ring-2 ring-slytherin-600' : ''}`}
                >
                  {date && (
                    <>
                      <div className="font-bold text-slytherin-900 mb-2">{date.getDate()}</div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs rounded px-2 py-1 text-white ${
                              event.type === 'Competition' ? 'bg-orange-600' : event.type === 'Exam' ? 'bg-red-600' : 'bg-slytherin-600'
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-slate-500">+{dayEvents.length - 3} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slytherin-900 mb-5">Add Event</h2>

            <div className="space-y-4">
              <input
                value={newEvent.title}
                onChange={(event) => setNewEvent({ ...newEvent, title: event.target.value })}
                placeholder="Event name"
                className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(event) => setNewEvent({ ...newEvent, date: event.target.value })}
                className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
              />
              <select
                value={newEvent.type}
                onChange={(event) => setNewEvent({ ...newEvent, type: event.target.value })}
                className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
              >
                {eventTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              <select
                value={newEvent.subject}
                onChange={(event) => setNewEvent({ ...newEvent, subject: event.target.value })}
                className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
              >
                {subjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
              <textarea
                value={newEvent.notes}
                onChange={(event) => setNewEvent({ ...newEvent, notes: event.target.value })}
                placeholder="Notes"
                className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600 min-h-[90px]"
              />
              <button
                onClick={addEvent}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slytherin-600 text-white font-bold rounded-lg hover:bg-slytherin-700"
              >
                <Plus size={18} />
                Add Event
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slytherin-900 mb-5">Upcoming</h2>
            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-slytherin-600">No events yet.</p>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-slytherin-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-bold text-slytherin-900">{event.title}</p>
                      <p className="text-xs text-slytherin-600">{event.date} - {event.type} - {event.subject}</p>
                    </div>
                    <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
