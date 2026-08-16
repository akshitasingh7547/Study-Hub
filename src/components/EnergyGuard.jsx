import React, { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BatteryMedium, Eye, Moon, ShieldCheck } from 'lucide-react'

const storageKey = 'studyHub.energyGuard'

const defaults = {
  energy: 68,
  eyeComfort: 82,
  sleepiness: 24,
  pain: 'none',
}

const readGuard = () => {
  try {
    return { ...defaults, ...(JSON.parse(localStorage.getItem(storageKey)) || {}) }
  } catch {
    return defaults
  }
}

const getVerdict = ({ energy, eyeComfort, sleepiness, pain }) => {
  if (pain === 'worse' || eyeComfort < 35) {
    return {
      tone: 'danger',
      title: 'Stop screen study and tell a parent or guardian',
      action: 'Use rest, water, and an eye/glasses check if pain persists, worsens, or comes with blurred/double vision, dizziness, nausea, or unusual symptoms.',
      block: 'No timed screen sprint right now.',
    }
  }

  if (sleepiness > 78) {
    return {
      tone: 'danger',
      title: 'Sleepiness is too high for hard study',
      action: 'Do not force a grind session. Rest first, then reassess. Sleep protects attention, memory consolidation, and mood.',
      block: 'Rest or a very low-screen recap only.',
    }
  }

  if (pain === 'mild' || eyeComfort < 62 || sleepiness > 58 || energy < 45) {
    return {
      tone: 'warn',
      title: 'Use a protected short block',
      action: 'Pick recall, formula review, flashcards, or handwritten planning. Stop if discomfort increases.',
      block: '10-15 minute focus, then screen break and reassess.',
    }
  }

  return {
    tone: 'good',
    title: 'Ready for normal focus',
    action: 'Use active recall, PYQs, timed practice, and immediate mistake repair. Take a look-away break after each block.',
    block: '25 minute focus, 5 minute reset.',
  }
}

const EnergyGuard = ({ compact = false }) => {
  const [guard, setGuard] = useState(readGuard)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(guard))
    window.dispatchEvent(new Event('studyHubEnergyUpdated'))
  }, [guard])

  const verdict = useMemo(() => getVerdict(guard), [guard])
  const toneClass = verdict.tone === 'danger'
    ? 'border-rose-400/40 bg-rose-500/10 text-rose-100'
    : verdict.tone === 'warn'
      ? 'border-amber-300/40 bg-amber-300/10 text-amber-100'
      : 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100'

  const setValue = (field, value) => setGuard((current) => ({ ...current, [field]: value }))

  return (
    <section className={`rounded-lg border ${toneClass} ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
            <ShieldCheck size={16} /> Eye + Energy Guard
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">{verdict.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#d8c7a0]">{verdict.action}</p>
        </div>
        {verdict.tone === 'danger' ? <AlertTriangle className="text-rose-200" /> : <ShieldCheck className="text-amber-200" />}
      </div>

      <div className={`mt-4 grid gap-4 ${compact ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
        <Slider icon={BatteryMedium} label="Energy" value={guard.energy} onChange={(value) => setValue('energy', value)} />
        <Slider icon={Eye} label="Eye comfort" value={guard.eyeComfort} onChange={(value) => setValue('eyeComfort', value)} />
        <Slider icon={Moon} label="Sleepiness" value={guard.sleepiness} onChange={(value) => setValue('sleepiness', value)} inverse />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <label className="text-sm text-[#d8c7a0]">
          Head or eye discomfort
          <select
            value={guard.pain}
            onChange={(event) => setValue('pain', event.target.value)}
            className="mt-1 block w-full rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-white outline-none"
          >
            <option value="none">Comfortable</option>
            <option value="mild">Slight discomfort</option>
            <option value="worse">Increasing or significant pain</option>
          </select>
        </label>
        <div className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-white">
          {verdict.block}
        </div>
      </div>
    </section>
  )
}

const Slider = ({ icon: Icon, label, value, onChange, inverse = false }) => (
  <label className="block">
    <div className="mb-2 flex items-center justify-between text-sm font-semibold text-white">
      <span className="flex items-center gap-2"><Icon size={16} /> {label}</span>
      <span>{value}%</span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className={`w-full ${inverse ? 'accent-rose-300' : 'accent-amber-300'}`}
    />
  </label>
)

export default EnergyGuard
