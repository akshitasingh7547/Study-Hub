import mongoose from 'mongoose'

const testSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String, enum: ['Practice Test', 'Class Test', 'Term Exam', 'Mock Exam'], default: 'Practice Test' },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default mongoose.model('Test', testSchema)
