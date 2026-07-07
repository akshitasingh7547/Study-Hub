import StockPortfolio from '../models/StockPortfolio.js'

export const getPortfolio = async (req, res) => {
  try {
    let portfolio = await StockPortfolio.findOne({ userId: req.userId })

    if (!portfolio) {
      portfolio = new StockPortfolio({
        userId: req.userId,
        cash: 100000,
      })
      await portfolio.save()
    }

    res.json(portfolio)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const buyStock = async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body

    let portfolio = await StockPortfolio.findOne({ userId: req.userId })
    if (!portfolio) {
      portfolio = new StockPortfolio({ userId: req.userId, cash: 100000 })
    }

    const totalCost = quantity * price

    if (portfolio.cash < totalCost) {
      return res.status(400).json({ message: 'Insufficient funds' })
    }

    const existingStock = portfolio.stocks.find(s => s.symbol === symbol)
    if (existingStock) {
      existingStock.quantity += quantity
      existingStock.currentPrice = price
    } else {
      portfolio.stocks.push({
        symbol,
        quantity,
        buyPrice: price,
        currentPrice: price,
        buyDate: new Date(),
      })
    }

    portfolio.cash -= totalCost

    await portfolio.save()

    res.json({ message: 'Stock purchased successfully', portfolio })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPerformance = async (req, res) => {
  try {
    const portfolio = await StockPortfolio.findOne({ userId: req.userId })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' })
    }

    let totalInvested = 0
    let currentValue = 0

    portfolio.stocks.forEach(stock => {
      totalInvested += stock.quantity * stock.buyPrice
      currentValue += stock.quantity * stock.currentPrice
    })

    const profitLoss = currentValue - totalInvested
    const returnPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0

    res.json({
      totalInvested,
      currentValue,
      cash: portfolio.cash,
      profitLoss,
      returnPercentage: returnPercentage.toFixed(2),
      totalPortfolioValue: currentValue + portfolio.cash,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
