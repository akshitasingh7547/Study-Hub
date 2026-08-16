import React, { useEffect, useState } from 'react'
import { CloudRain, Music2, Volume2, VolumeX } from 'lucide-react'

const storageKey = 'studyHub.ambient'

const defaults = {
  rain: true,
  clouds: true,
  audio: false,
  track: 'Rain library',
}

const readAmbient = () => {
  try {
    return { ...defaults, ...(JSON.parse(localStorage.getItem(storageKey)) || {}) }
  } catch {
    return defaults
  }
}

const AmbientControls = () => {
  const [state, setState] = useState(readAmbient)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state))
    document.body.dataset.rain = state.rain ? 'on' : 'off'
    document.body.dataset.clouds = state.clouds ? 'on' : 'off'
  }, [state])

  const toggle = (key) => setState((current) => ({ ...current, [key]: !current[key] }))

  return (
    <section className="rounded-lg border border-amber-300/15 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Atmosphere</p>
          <h2 className="text-lg font-bold text-white">Rain, cloud, audio</h2>
        </div>
        <CloudRain className="text-[#77d6ff]" />
      </div>
      <div className="grid gap-2">
        <Switch active={state.rain} icon={CloudRain} label="Rain layer" onClick={() => toggle('rain')} />
        <Switch active={state.clouds} icon={CloudRain} label="Cloud drift" onClick={() => toggle('clouds')} />
        <Switch active={state.audio} icon={state.audio ? Volume2 : VolumeX} label="Ambient audio plan" onClick={() => toggle('audio')} />
      </div>
      <label className="mt-3 block text-sm text-[#d8c7a0]">
        Focus soundtrack
        <select
          value={state.track}
          onChange={(event) => setState((current) => ({ ...current, track: event.target.value }))}
          className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
        >
          <option>Rain library</option>
          <option>Cloud hall</option>
          <option>Brown noise</option>
          <option>No audio</option>
        </select>
      </label>
      <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#9a8b69]">
        <Music2 size={14} className="mt-0.5" /> Audio is intentionally opt-in so focus does not depend on loud stimulation.
      </p>
    </section>
  )
}

const Switch = ({ active, icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold ${
      active ? 'border-amber-300/40 bg-amber-300/15 text-white' : 'border-white/10 bg-black/20 text-[#c8b88f]'
    }`}
  >
    <span className="flex items-center gap-2"><Icon size={16} /> {label}</span>
    <span className={`h-5 w-9 rounded-full p-0.5 ${active ? 'bg-amber-300' : 'bg-white/15'}`}>
      <span className={`block h-4 w-4 rounded-full bg-black transition-transform ${active ? 'translate-x-4' : ''}`} />
    </span>
  </button>
)

export default AmbientControls
