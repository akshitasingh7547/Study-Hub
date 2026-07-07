import React, { useState } from 'react'
import { Mail, Lock, User as UserIcon } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services/apiService'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const result = await authService.login(formData.email, formData.password)
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.user))
        navigate('/')
      } else {
        const result = await authService.register(formData.name, formData.email, formData.password)
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.user))
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slytherin-900 to-slytherin-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-slideIn">
        <h1 className="text-3xl font-bold text-slytherin-900 mb-2 text-center">Study Hub 2</h1>
        <p className="text-slytherin-600 text-center mb-8">Your Personal Learning OS</p>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 font-bold rounded-lg transition ${
              isLogin
                ? 'bg-slytherin-600 text-white'
                : 'bg-slytherin-100 text-slytherin-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 font-bold rounded-lg transition ${
              !isLogin
                ? 'bg-slytherin-600 text-white'
                : 'bg-slytherin-100 text-slytherin-600'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-slytherin-900 mb-2">Name</label>
              <div className="flex items-center gap-3 px-4 py-3 border border-slytherin-300 rounded-lg">
                <UserIcon size={20} className="text-slytherin-600" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="flex-1 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slytherin-900 mb-2">Email</label>
            <div className="flex items-center gap-3 px-4 py-3 border border-slytherin-300 rounded-lg">
              <Mail size={20} className="text-slytherin-600" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="flex-1 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slytherin-900 mb-2">Password</label>
            <div className="flex items-center gap-3 px-4 py-3 border border-slytherin-300 rounded-lg">
              <Lock size={20} className="text-slytherin-600" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="flex-1 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-slytherin-600 to-slytherin-700 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="text-center text-slytherin-600 text-sm mt-4">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slytherin-600 font-bold hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Auth
