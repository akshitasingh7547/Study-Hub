import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { skillAreas } from '../data/studyHubData'

const storageKey = 'studyHub.skills'

const SkillPage = ({ areaTitle }) => {
  const area = skillAreas.find((item) => item.title === areaTitle)
  const [progress, setProgress] = useState({})
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const parsed = JSON.parse(saved)
      setProgress(parsed.progress || {})
      setNotes(parsed.notes?.[areaTitle] || [])
    }
    setHasLoaded(true)
  }, [areaTitle])

  useEffect(() => {
    if (!hasLoaded) return
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
    localStorage.setItem(storageKey, JSON.stringify({
      ...saved,
      progress,
      notes: {
        ...(saved.notes || {}),
        [areaTitle]: notes,
      },
    }))
    window.dispatchEvent(new Event('studyHubProgressUpdated'))
  }, [progress, notes, areaTitle, hasLoaded])

  const doneCount = useMemo(() => {
    return area.tracks.filter((track) => progress[`${areaTitle}:${track}`]).length
  }, [area.tracks, areaTitle, progress])

  const percent = area.tracks.length ? Math.round((doneCount / area.tracks.length) * 100) : 0

  const toggleTrack = (track) => {
    const key = `${areaTitle}:${track}`
    setProgress({ ...progress, [key]: !progress[key] })
  }

  const addNote = () => {
    if (!newNote.trim()) return
    setNotes([{ id: Date.now(), text: newNote.trim(), date: new Date().toISOString().slice(0, 10) }, ...notes])
    setNewNote('')
  }

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">{area.title}</h1>
        <p className="text-slytherin-600">{area.description}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slytherin-900">Progress</h2>
            <p className="text-slytherin-600">{doneCount} of {area.tracks.length} tracks completed.</p>
          </div>
          <p className="text-4xl font-bold text-slytherin-700">{percent}%</p>
        </div>
        <div className="h-4 bg-slytherin-100 rounded-full overflow-hidden">
          <div className="h-full bg-slytherin-600 transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slytherin-900 mb-6">Tracks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {area.tracks.map((track) => {
              const checked = Boolean(progress[`${areaTitle}:${track}`])
              return (
                <button
                  key={track}
                  onClick={() => toggleTrack(track)}
                  className={`flex items-center gap-3 text-left p-4 rounded-xl border transition ${
                    checked
                      ? 'bg-slytherin-700 text-white border-slytherin-700'
                      : 'bg-slytherin-50 text-slytherin-900 border-slytherin-100 hover:bg-slytherin-100'
                  }`}
                >
                  <CheckCircle2 size={22} />
                  <span className="font-bold">{track}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slytherin-900 mb-6">Projects</h2>
          <div className="space-y-3">
            {area.projects.map((project) => (
              <div key={project} className="p-3 bg-slytherin-50 rounded-lg text-slytherin-800 font-semibold">
                {project}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold text-slytherin-900 mb-6">Notes and Practice Log</h2>
        <div className="flex gap-3 mb-6">
          <input
            value={newNote}
            onChange={(event) => setNewNote(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && addNote()}
            placeholder={`Add a ${area.title.toLowerCase()} note...`}
            className="flex-1 px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
          />
          <button onClick={addNote} className="flex items-center gap-2 px-5 py-2 bg-slytherin-600 text-white rounded-lg font-bold hover:bg-slytherin-700">
            <Plus size={18} />
            Add
          </button>
        </div>
        <div className="space-y-3">
          {notes.length === 0 ? (
            <p className="text-slytherin-600">No notes yet. Add practice, doubts, resources, or project ideas here.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="flex items-start gap-3 p-4 bg-slytherin-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-slytherin-900">{note.text}</p>
                  <p className="text-xs text-slytherin-500 mt-1">{note.date}</p>
                </div>
                <button onClick={() => deleteNote(note.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SkillPage
