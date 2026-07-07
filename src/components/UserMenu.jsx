import React, { useState } from 'react'
import { LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    onLogout()
    navigate('/login')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slytherin-600 text-white rounded-lg hover:bg-slytherin-700 transition"
      >
        <User size={20} />
        {user?.name || 'User'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slytherin-300 z-50">
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-3 px-4 py-2 text-left text-slytherin-900 hover:bg-slytherin-50"
          >
            <Settings size={16} />
            Profile Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 border-t border-slytherin-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
