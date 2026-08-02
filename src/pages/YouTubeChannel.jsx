import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'studyHub.youtubeChannel'

const emptyVideo = () => ({ id: `v-${Date.now()}`, title: '', uploadDate: '', views: 0, likes: 0, comments: 0, watchTimeMins: 0, reach: 0 })

const YouTubeChannel = () => {
  const [videos, setVideos] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
  })
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
  }, [videos])

  const addVideo = () => {
    const v = emptyVideo()
    // leave title blank by default if user didn't provide
    v.title = newTitle.trim()
    setVideos((cur) => [v, ...cur])
    setNewTitle('')
  }

  const updateVideo = (id, field, value) => setVideos((cur) => cur.map(v => v.id === id ? { ...v, [field]: value } : v))
  const removeVideo = (id) => setVideos((cur) => cur.filter(v => v.id !== id))

  const stats = videos.reduce((acc, v) => ({
    views: acc.views + Number(v.views || 0),
    likes: acc.likes + Number(v.likes || 0),
    watchTime: acc.watchTime + Number(v.watchTimeMins || 0),
    reach: acc.reach + Number(v.reach || 0),
  }), { views: 0, likes: 0, watchTime: 0, reach: 0 })

  return (
    <div className="p-8 min-h-screen bg-black text-gray-100">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 style={{ fontFamily: 'Cinzel, serif' }} className="text-3xl font-bold">YouTube Channel</h1>
          <p className="text-gray-400">Track videos, fill metrics, and get aggregated channel stats. Titles are left blank by default for you to fill.</p>
        </header>

        <section className="bg-gray-900/60 p-4 rounded">
          <h2 className="font-semibold">Channel Summary</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-800/30 rounded">
              <div className="text-sm text-gray-400">Total Views</div>
              <div className="text-xl font-bold">{stats.views}</div>
            </div>
            <div className="p-3 bg-gray-800/30 rounded">
              <div className="text-sm text-gray-400">Total Watch Time (mins)</div>
              <div className="text-xl font-bold">{stats.watchTime}</div>
            </div>
            <div className="p-3 bg-gray-800/30 rounded">
              <div className="text-sm text-gray-400">Total Likes</div>
              <div className="text-xl font-bold">{stats.likes}</div>
            </div>
            <div className="p-3 bg-gray-800/30 rounded">
              <div className="text-sm text-gray-400">Estimated Reach</div>
              <div className="text-xl font-bold">{stats.reach}</div>
            </div>
          </div>
        </section>

        <section className="bg-gray-900/60 p-4 rounded">
          <div className="mb-3 flex gap-2">
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Optional video title (leave blank)" className="flex-1 p-2 bg-transparent border border-gray-800 rounded" />
            <button onClick={addVideo} className="px-4 py-2 bg-yellow-500 text-black rounded">Add</button>
          </div>

          {videos.length === 0 ? (
            <p className="text-gray-400">No videos yet. Add a video entry and fill metrics.</p>
          ) : (
            <div className="space-y-3">
              {videos.map((v) => (
                <div key={v.id} className="p-3 bg-gray-800/30 rounded">
                  <div className="mb-2 text-sm text-gray-400">Video ID: {v.id}</div>
                  <input value={v.title} onChange={(e) => updateVideo(v.id, 'title', e.target.value)} placeholder="Title" className="w-full p-2 mb-2 bg-transparent border border-gray-800 rounded" />

                  <div className="grid grid-cols-3 gap-2">
                    <input type="date" value={v.uploadDate || ''} onChange={(e) => updateVideo(v.id, 'uploadDate', e.target.value)} className="p-2 bg-transparent border border-gray-800 rounded" />
                    <input type="number" value={v.views} onChange={(e) => updateVideo(v.id, 'views', Number(e.target.value))} placeholder="Views" className="p-2 bg-transparent border border-gray-800 rounded" />
                    <input type="number" value={v.likes} onChange={(e) => updateVideo(v.id, 'likes', Number(e.target.value))} placeholder="Likes" className="p-2 bg-transparent border border-gray-800 rounded" />
                    <input type="number" value={v.comments} onChange={(e) => updateVideo(v.id, 'comments', Number(e.target.value))} placeholder="Comments" className="p-2 bg-transparent border border-gray-800 rounded" />
                    <input type="number" value={v.watchTimeMins} onChange={(e) => updateVideo(v.id, 'watchTimeMins', Number(e.target.value))} placeholder="Watch time (mins)" className="p-2 bg-transparent border border-gray-800 rounded" />
                    <input type="number" value={v.reach} onChange={(e) => updateVideo(v.id, 'reach', Number(e.target.value))} placeholder="Reach" className="p-2 bg-transparent border border-gray-800 rounded" />
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button onClick={() => removeVideo(v.id)} className="px-3 py-1 bg-red-600 rounded text-sm">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default YouTubeChannel
