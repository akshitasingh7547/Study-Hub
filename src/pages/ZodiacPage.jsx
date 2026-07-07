import React, { useEffect, useMemo, useState } from 'react'
import { Moon, Save, Sparkles, Sun } from 'lucide-react'

const storageKey = 'studyHub.zodiac'

const zodiacDates = [
  ['Capricorn', '12-22', '01-19'],
  ['Aquarius', '01-20', '02-18'],
  ['Pisces', '02-19', '03-20'],
  ['Aries', '03-21', '04-19'],
  ['Taurus', '04-20', '05-20'],
  ['Gemini', '05-21', '06-20'],
  ['Cancer', '06-21', '07-22'],
  ['Leo', '07-23', '08-22'],
  ['Virgo', '08-23', '09-22'],
  ['Libra', '09-23', '10-22'],
  ['Scorpio', '10-23', '11-21'],
  ['Sagittarius', '11-22', '12-21'],
]

const zodiacSymbols = {
  Aries: 'Ar',
  Taurus: 'Ta',
  Gemini: 'Ge',
  Cancer: 'Ca',
  Leo: 'Le',
  Virgo: 'Vi',
  Libra: 'Li',
  Scorpio: 'Sc',
  Sagittarius: 'Sa',
  Capricorn: 'Cp',
  Aquarius: 'Aq',
  Pisces: 'Pi',
}

const getSunSign = (dateValue) => {
  if (!dateValue) return ''
  const [, month, day] = dateValue.split('-').map(Number)
  const value = month * 100 + day

  if (value >= 1222 || value <= 119) return 'Capricorn'

  return zodiacDates.find(([, start, end]) => {
    const [startMonth, startDay] = start.split('-').map(Number)
    const [endMonth, endDay] = end.split('-').map(Number)
    const startValue = startMonth * 100 + startDay
    const endValue = endMonth * 100 + endDay
    return value >= startValue && value <= endValue
  })?.[0] || ''
}

const ZodiacPage = () => {
  const [profile, setProfile] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    sunSign: '',
    ascendant: '',
    moonSign: '',
    mercury: '',
    notes: '',
  })
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setProfile(JSON.parse(saved))
    setHasLoaded(true)
  }, [])

  useEffect(() => {
    if (!hasLoaded) return
    localStorage.setItem(storageKey, JSON.stringify(profile))
  }, [profile, hasLoaded])

  const detectedSunSign = useMemo(() => getSunSign(profile.birthDate), [profile.birthDate])

  useEffect(() => {
    if (!detectedSunSign || profile.sunSign === detectedSunSign) return
    setProfile((current) => ({ ...current, sunSign: detectedSunSign }))
  }, [detectedSunSign, profile.sunSign])

  const update = (field, value) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">Zodiac Vault</h1>
        <p className="text-slytherin-600">A saved astrology profile page with Slytherin-style calm and mystery.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-gradient-to-br from-slytherin-800 via-slytherin-700 to-slate-900 rounded-3xl shadow-xl p-8 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:28px_28px]" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="text-yellow-300" />
              <h2 className="text-2xl font-bold">Astrology Chart</h2>
            </div>

            <div className="mx-auto w-full max-w-[520px] aspect-square rounded-full border-[18px] border-slytherin-400/40 relative bg-white/5 shadow-2xl">
              <div className="absolute inset-10 rounded-full border border-white/30" />
              <div className="absolute inset-24 rounded-full border border-white/20" />
              {Object.keys(zodiacSymbols).map((sign, index) => {
                const angle = index * 30 - 90
                const x = 50 + 43 * Math.cos((angle * Math.PI) / 180)
                const y = 50 + 43 * Math.sin((angle * Math.PI) / 180)
                const active = profile.sunSign === sign || profile.moonSign === sign || profile.ascendant === sign
                return (
                  <div
                    key={sign}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full grid place-items-center text-sm font-bold ${
                      active ? 'bg-yellow-300 text-slytherin-900' : 'bg-white/10 text-white'
                    }`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    title={sign}
                  >
                    {zodiacSymbols[sign]}
                  </div>
                )
              })}

              <div className="absolute inset-0 grid place-items-center text-center p-12">
                <div>
                  <p className="text-sm uppercase tracking-widest text-slytherin-100">Sun Sign</p>
                  <p className="text-4xl font-bold text-yellow-300">{profile.sunSign || 'Unknown'}</p>
                  <p className="text-sm text-slytherin-100 mt-2">{profile.name || 'Your profile'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Moon className="text-slytherin-700" />
            <h2 className="text-2xl font-bold text-slytherin-900">Profile</h2>
          </div>

          <div className="space-y-4">
            <input
              value={profile.name}
              onChange={(event) => update('name', event.target.value)}
              placeholder="Name"
              className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
            />
            <input
              type="date"
              value={profile.birthDate}
              onChange={(event) => update('birthDate', event.target.value)}
              className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
            />
            <input
              type="time"
              value={profile.birthTime}
              onChange={(event) => update('birthTime', event.target.value)}
              className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
            />

            <select
              value={profile.sunSign}
              onChange={(event) => update('sunSign', event.target.value)}
              className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
            >
              <option value="">Sun sign</option>
              {Object.keys(zodiacSymbols).map((sign) => (
                <option key={sign}>{sign}</option>
              ))}
            </select>

            <select
              value={profile.ascendant}
              onChange={(event) => update('ascendant', event.target.value)}
              className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
            >
              <option value="">Ascendant</option>
              {Object.keys(zodiacSymbols).map((sign) => (
                <option key={sign}>{sign}</option>
              ))}
            </select>

            <select
              value={profile.moonSign}
              onChange={(event) => update('moonSign', event.target.value)}
              className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
            >
              <option value="">Moon sign</option>
              {Object.keys(zodiacSymbols).map((sign) => (
                <option key={sign}>{sign}</option>
              ))}
            </select>

            <textarea
              value={profile.notes}
              onChange={(event) => update('notes', event.target.value)}
              placeholder="Notes, traits, reminders..."
              className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600 min-h-[110px]"
            />

            <div className="flex items-center gap-2 text-slytherin-700 font-bold bg-slytherin-50 rounded-lg p-3">
              <Save size={18} />
              Saved automatically
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          ['Sun', profile.sunSign || 'Not set', 'Core identity and expression'],
          ['Moon', profile.moonSign || 'Not set', 'Emotions, habits, inner world'],
          ['Ascendant', profile.ascendant || 'Not set', 'First impression and outer style'],
        ].map(([label, value, detail]) => (
          <div key={label} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-slytherin-600">
            <div className="flex items-center gap-3 mb-3">
              <Sun className="text-yellow-500" />
              <h3 className="text-xl font-bold text-slytherin-900">{label}</h3>
            </div>
            <p className="text-2xl font-bold text-slytherin-700">{value}</p>
            <p className="text-sm text-slytherin-600 mt-2">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ZodiacPage
