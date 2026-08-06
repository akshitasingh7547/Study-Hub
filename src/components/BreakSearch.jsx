import React, { useState } from 'react'
import { Coffee, ExternalLink, Search } from 'lucide-react'

const breakIdeas = [
  '2 minute breathing reset',
  'Eye relaxation exercise',
  'Quick desk stretch',
  'Calm library ambience',
]

const BreakSearch = () => {
  const [query, setQuery] = useState('calm study break music')

  const openSearch = (site) => {
    const trimmed = query.trim() || 'study break reset'
    const url = site === 'youtube'
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(trimmed)}`
      : `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
        <Search size={16} className="text-yellow-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') openSearch('youtube')
          }}
          placeholder="Search a refresh activity..."
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => openSearch('youtube')} className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-black">
          <ExternalLink size={15} /> YouTube
        </button>
        <button onClick={() => openSearch('web')} className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white">
          <ExternalLink size={15} /> Web
        </button>
      </div>

      <div className="grid gap-2">
        {breakIdeas.map((idea) => (
          <button
            key={idea}
            onClick={() => setQuery(idea)}
            className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-left text-xs text-gray-300 hover:bg-white/10"
          >
            <Coffee size={14} className="text-yellow-400" />
            {idea}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BreakSearch
