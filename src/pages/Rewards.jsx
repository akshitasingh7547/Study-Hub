import React, { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react'

const weeklyKey = 'studyHub.weeklyTasks'
const explorationKey = 'studyHub.exploration'

const readWeekly = () => {
  try { return JSON.parse(localStorage.getItem(weeklyKey)) || [] } catch { return [] }
}

const readExploration = () => {
  try { return JSON.parse(localStorage.getItem(explorationKey)) || [] } catch { return [] }
}

const Rewards = () => {
  const [weekly, setWeekly] = useState(readWeekly)
  const [explore, setExplore] = useState(readExploration)
  const [newPlace, setNewPlace] = useState('')

  useEffect(() => { localStorage.setItem(weeklyKey, JSON.stringify(weekly)) }, [weekly])
  useEffect(() => { localStorage.setItem(explorationKey, JSON.stringify(explore)) }, [explore])

  const allDone = weekly.length > 0 && weekly.every(w => w.done)

  const addPlace = () => {
    if (!newPlace.trim()) return
    setExplore(cur => [{ id: `e-${Date.now()}`, title: newPlace.trim() }, ...cur])
    setNewPlace('')
  }

  const removePlace = (id) => setExplore(cur => cur.filter(p => p.id !== id))

  return (
    <div className="p-8 min-h-screen bg-black text-gray-100">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 style={{ fontFamily: 'Cinzel, serif' }} className="text-3xl font-bold">Rewards & Exploration</h1>
          <p className="text-gray-400">Track your reward progress and add exploration destinations. Exploration unlocks when all weekly tasks are complete.</p>
        </header>

        <section className="bg-gray-900/60 p-4 rounded">
          <h2 className="font-semibold">Exploration (Outings)</h2>
          <p className="text-xs text-gray-400">Unlocked when weekly checklist is fully complete.</p>

          <div className="mt-3">
            <p className={`inline-block px-3 py-1 rounded ${allDone ? 'bg-green-800 text-green-200' : 'bg-gray-800 text-gray-300'}`}>{allDone ? 'Unlocked' : 'Locked'}</p>
          </div>

          <div className="mt-4 grid gap-3">
            {explore.length === 0 ? <p className="text-gray-400">No places yet — add your favorite spots.</p> : explore.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
                <div>
                  <div className="font-semibold">{p.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removePlace(p.id)} className="text-red-400"><Trash2 /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input value={newPlace} onChange={(e) => setNewPlace(e.target.value)} placeholder="Add exploration place" className="flex-1 p-2 bg-transparent border border-gray-800 rounded" />
            <button onClick={addPlace} className="px-4 py-2 bg-yellow-500 text-black rounded"><Plus /></button>
          </div>
        </section>

        <section className="bg-gray-900/60 p-4 rounded">
          <h2 className="font-semibold">Rewards</h2>
          <p className="text-gray-400 text-sm">Rewards are driven by weekly completion. Use the Weekly Tasks page to manage the checklist.</p>

          <div className="mt-3 p-3 bg-gray-800/30 rounded">
            <div className="font-semibold">Exploration Access</div>
            <div className="text-xs text-gray-400">Unlock: Complete all weekly tasks.</div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Rewards
