import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import config from './config.js'

import authRoutes from './routes/auth.js'
import testRoutes from './routes/tests.js'
import stockRoutes from './routes/stocks.js'

const app = express()

app.use(cors())
app.use(express.json())

mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

app.use('/api/auth', authRoutes)
app.use('/api/tests', testRoutes)
app.use('/api/stocks', stockRoutes)

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' })
})

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`)
})

export default app
