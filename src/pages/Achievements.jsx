import React, { useState, useEffect } from 'react'
import { Trophy, Star, Flame, Zap } from 'lucide-react'
import { achievementService } from '../services/apiService'

const Achievements = () => {
  const [achievements, setAchievements] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const result = await achievementService.getAllAchievements()
      setAchievements(result.data)
    } catch (err) {
      console.error('Error fetching achievements:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">Achievement Hall 🏆</h1>
        <p className="text-slytherin-600">Unlock badges and track your progress</p>
      </div>

      {achievements && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={24} />
              <p className="text-sm opacity-90">Achievements Unlocked</p>
            </div>
            <p className="text-3xl font-bold">{achievements.unlockedCount}/{achievements.totalCount}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Zap size={24} />
              <p className="text-sm opacity-90">Total XP</p>
            </div>
            <p className="text-3xl font-bold">1,250 XP</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Flame size={24} />
              <p className="text-sm opacity-90">Current Streak</p>
            </div>
            <p className="text-3xl font-bold">7 Days 🔥</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slytherin-900 mb-6">Badges</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements?.achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 transition ${
                achievement.unlocked
                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100'
                  : 'border-gray-300 bg-gray-50 opacity-50'
              }`}
            >
              <div className={`text-5xl mb-4 ${!achievement.unlocked && 'grayscale'}`}>
                {achievement.icon}
              </div>
              <h3 className="text-lg font-bold text-slytherin-900 mb-2">{achievement.name}</h3>
              <p className="text-sm text-slytherin-600 mb-4">{achievement.description}</p>

              {achievement.unlocked ? (
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <Star size={16} fill="currentColor" />
                  Unlocked!
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Locked</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Achievements
