import React, { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, ShoppingCart } from 'lucide-react'
import { stockService } from '../services/apiService'

const StockMarket = () => {
  const [portfolio, setPortfolio] = useState(null)
  const [symbol, setSymbol] = useState('RELIANCE')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(2847.50)
  const [action, setAction] = useState('buy')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [performance, setPerformance] = useState(null)

  const mockStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2847.50 },
    { symbol: 'INFY', name: 'Infosys', price: 1542.30 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3456.75 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1687.40 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 923.50 },
  ]

  useEffect(() => {
    fetchPortfolio()
    fetchPerformance()
  }, [])

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      const result = await stockService.getPortfolio()
      setPortfolio(result.data)
    } catch (err) {
      setError('Error fetching portfolio')
    } finally {
      setLoading(false)
    }
  }

  const fetchPerformance = async () => {
    try {
      const result = await stockService.getPerformance()
      setPerformance(result.data)
    } catch (err) {
      console.error('Error fetching performance')
    }
  }

  const handleBuy = async () => {
    if (quantity <= 0 || price <= 0) {
      setError('Invalid quantity or price')
      return
    }

    try {
      await stockService.buyStock(symbol, quantity, price)
      setSymbol('RELIANCE')
      setQuantity(1)
      setPrice(2847.50)
      fetchPortfolio()
      fetchPerformance()
    } catch (err) {
      setError(err.response?.data?.message || 'Error buying stock')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">Share Market Simulator 📈</h1>
        <p className="text-slytherin-600">Paper trading with real stock data</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {performance && (
          <>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-sm opacity-90 mb-2">Portfolio Value</p>
              <p className="text-3xl font-bold">₹{(performance.totalPortfolioValue || 0).toFixed(0)}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-sm opacity-90 mb-2">Cash Available</p>
              <p className="text-3xl font-bold">₹{(performance.cash || 0).toFixed(0)}</p>
            </div>

            <div className={`bg-gradient-to-br ${performance.profitLoss >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-xl shadow-lg p-6 text-white`}>
              <p className="text-sm opacity-90 mb-2">Profit/Loss</p>
              <p className="text-3xl font-bold">₹{(performance.profitLoss || 0).toFixed(0)}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-sm opacity-90 mb-2">Return %</p>
              <p className="text-3xl font-bold">{(performance.returnPercentage || 0)}%</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slytherin-900 mb-6">Trade Stocks</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slytherin-900 mb-2">Action</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
              >
                <option value="buy">Buy Stock</option>
                <option value="sell">Sell Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slytherin-900 mb-2">Stock Symbol</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
              >
                {mockStocks.map(s => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slytherin-900 mb-2">Price: ₹{mockStocks.find(s => s.symbol === symbol)?.price.toFixed(2)}</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slytherin-900 mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-slytherin-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slytherin-600"
              />
            </div>

            <div className="bg-slytherin-50 p-4 rounded-lg">
              <p className="text-sm text-slytherin-600 mb-2">Total: ₹{(quantity * price).toFixed(2)}</p>
            </div>

            <button
              onClick={action === 'buy' ? handleBuy : null}
              className={`w-full px-4 py-3 text-white font-bold rounded-lg transition ${
                action === 'buy'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {action === 'buy' ? '📈 Buy Stock' : '📉 Sell Stock'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slytherin-900 mb-6">Your Portfolio</h2>

          {portfolio && portfolio.stocks.length === 0 ? (
            <div className="text-center text-slytherin-600 py-8">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
              <p>No stocks in portfolio. Start trading!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolio?.stocks.map((stock, index) => (
                <div key={index} className="p-4 bg-slytherin-50 rounded-lg border-l-4 border-slytherin-600">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-slytherin-900">{stock.symbol}</p>
                    <p className="text-sm text-slytherin-600">{stock.quantity} shares</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slytherin-600">
                      Buy: ₹{stock.buyPrice.toFixed(2)} | Current: ₹{stock.currentPrice.toFixed(2)}
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      +₹{((stock.currentPrice - stock.buyPrice) * stock.quantity).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StockMarket
