import mongoose from 'mongoose'

const stockPortfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stocks: [
      {
        symbol: String,
        quantity: Number,
        buyPrice: Number,
        currentPrice: Number,
        buyDate: Date,
      }
    ],
    cash: { type: Number, default: 100000 },
    totalValue: Number,
  },
  { timestamps: true }
)

export default mongoose.model('StockPortfolio', stockPortfolioSchema)
