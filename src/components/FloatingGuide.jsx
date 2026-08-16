import React, { useEffect, useMemo, useState } from 'react'
import { Bot, ChevronDown, Sparkles } from 'lucide-react'

const guardKey = 'studyHub.energyGuard'

const readGuard = () => {
  try {
    return JSON.parse(localStorage.getItem(guardKey)) || {}
  } catch {
    return {}
  }
}

const FloatingGuide = () => {
  const [open, setOpen] = useState(false)
  const [guard, setGuard] = useState(readGuard)

  useEffect(() => {
    const update = () => setGuard(readGuard())
    window.addEventListener('studyHubEnergyUpdated', update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener('studyHubEnergyUpdated', update)
      window.removeEventListener('storage', update)
    }
  }, [])

  const message = useMemo(() => {
    const energy = Number(guard.energy ?? 68)
    const eyeComfort = Number(guard.eyeComfort ?? 82)
    const sleepiness = Number(guard.sleepiness ?? 24)
    const pain = guard.pain || 'none'

    if (pain === 'worse' || eyeComfort < 35) {
      return 'Stop screen work now. Tell a parent or guardian if pain is increasing, persistent, or paired with vision changes. Use offline rest or an eye/glasses check.'
    }
    if (sleepiness > 78) {
      return 'Sleepiness is too high for real learning. Rest first, then reassess. Do not turn exhaustion into a fake productivity challenge.'
    }
    if (energy < 45 || eyeComfort < 62 || sleepiness > 58 || pain === 'mild') {
      return 'Choose a protected 10-15 minute block: formula recall, handwritten mistake repair, vocabulary cards, or a light HSC review. Break after it.'
    }
    return 'Good window for serious work: JEE PYQs, timed HSC answer writing, SQL/Python practice, or a mock-review sprint. Use active recall before rereading.'
  }, [guard])

  return (
    <div className="fixed bottom-5 right-5 z-[70] w-[min(360px,calc(100vw-2rem))]">
      {open && (
        <div className="mb-3 rounded-lg border border-amber-300/25 bg-[#080908]/95 p-4 text-[#f7ead0] shadow-2xl shadow-black/50 backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-300">
            <Sparkles size={16} /> Floating AI guide
          </div>
          <p className="text-sm leading-6 text-[#d8c7a0]">{message}</p>
          <div className="mt-3 rounded-lg bg-white/5 p-3 text-xs leading-5 text-[#9a8b69]">
            Why this works: retrieval practice, spaced review, short breaks, and sleep-aware planning improve useful learning more reliably than long tired screen sessions.
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300 px-4 py-3 font-bold text-black shadow-xl shadow-black/40"
        aria-expanded={open}
      >
        <Bot size={20} /> Guide <ChevronDown className={open ? 'rotate-180' : ''} size={18} />
      </button>
    </div>
  )
}

export default FloatingGuide
