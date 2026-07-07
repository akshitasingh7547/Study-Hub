import React, { useMemo, useState } from 'react'
import { ExternalLink, Library as LibraryIcon, Search } from 'lucide-react'
import { learningWebsites } from '../data/learningDatabase'

const Library = () => {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const categories = ['All', ...new Set(learningWebsites.map((site) => site.category))]
  const filteredSites = useMemo(() => {
    return learningWebsites.filter((site) => {
      const matchesCategory = category === 'All' || site.category === category
      const matchesQuery = `${site.title} ${site.why} ${site.category}`.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">Learning Websites</h1>
        <p className="text-slytherin-600">Programming, English, Math, AI, and finance resources in one place.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex items-center gap-3 border border-slytherin-200 rounded-lg px-4 py-3">
            <Search size={18} className="text-slytherin-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search websites..."
              className="w-full outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 border border-slytherin-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSites.map((site) => (
          <div key={site.title} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-slytherin-500">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slytherin-100 text-slytherin-700 mb-3">
                  {site.category}
                </span>
                <h3 className="font-bold text-xl text-slytherin-900">{site.title}</h3>
              </div>
              <LibraryIcon className="text-slytherin-500" />
            </div>
            <p className="text-slytherin-600 mb-5">{site.why}</p>
            <a
              href={site.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slytherin-600 text-white font-bold rounded-lg hover:bg-slytherin-700 transition"
            >
              Open Website
              <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Library
