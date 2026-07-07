import Test from '../models/Test.js'
import User from '../models/User.js'

export const addTest = async (req, res) => {
  try {
    const { name, subject, category, score, total } = req.body

    const percentage = (score / total) * 100

    const test = new Test({
      userId: req.userId,
      name,
      subject,
      category,
      score,
      total,
      percentage,
    })

    await test.save()

    const xpGained = Math.floor(percentage / 10)
    await User.findByIdAndUpdate(req.userId, {
      $inc: { xp: xpGained },
    })

    res.status(201).json({ message: 'Test added successfully', test })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getTests = async (req, res) => {
  try {
    const tests = await Test.find({ userId: req.userId }).sort({ date: -1 })
    res.json(tests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAnalytics = async (req, res) => {
  try {
    const tests = await Test.find({ userId: req.userId })
    const user = await User.findById(req.userId)

    const subjectStats = {}
    tests.forEach(test => {
      if (!subjectStats[test.subject]) {
        subjectStats[test.subject] = { total: 0, count: 0 }
      }
      subjectStats[test.subject].total += test.percentage
      subjectStats[test.subject].count += 1
    })

    const subjectAccuracy = {}
    for (const subject in subjectStats) {
      subjectAccuracy[subject] = Math.round(
        subjectStats[subject].total / subjectStats[subject].count
      )
    }

    res.json({
      totalTests: tests.length,
      averageScore: tests.length > 0 ? Math.round(tests.reduce((acc, t) => acc + t.percentage, 0) / tests.length) : 0,
      subjectAccuracy,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
