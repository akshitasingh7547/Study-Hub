import React, { useState } from 'react'

// BreakSearch component: shows quick research suggestions and opens a Google search in a new tab
const defaultSuggestions = [
  'Maharashtra Nature Park highlights',
  'Tech places near me',
  'AI Engineer career roadmap',
  'Quant analyst interview preparation',
]

const BreakSearch = () => {
  const [query, setQuery] = useState('')

  const search = (q) => {
    if (!q || !q.trim()) return
    const url = `https://www.google.com/search?q=${encodeURIComponent(q)}`
    window.open(url, '_blank')
  }

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search this..."
          className="flex-1 p-2 bg-transparent border border-gray-800 rounded text-sm"
        />
        <button onClick={() => search(query)} className="px-3 py-1 bg-yellow-500 text-black rounded">Search</button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {defaultSuggestions.map((s) => (
          <button key={s} onClick={() => search(s)} className="text-left p-2 bg-gray-800/20 rounded text-xs">{s}</button>
        ))}
      </div>
    </div>
  )
}

export default BreakSearch
