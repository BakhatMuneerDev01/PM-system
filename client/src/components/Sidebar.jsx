import { LayoutDashboard, User, MessageSquare, LogOut, Calendar } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Modal, Button } from './ui/base'

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const siderNavlinks = [
    { name: "Dashboard", path: '/', icon: LayoutDashboard },
    { name: "My Patients", path: '/patients', icon: User },
    { name: "Visits", path: '/visits', icon: Calendar }, // Add this line
    { name: "Messaging", path: '/messaging', icon: MessageSquare },
  ]

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <div className='h-screen bg-white w-64 shadow-xl px-2 py-4 flex flex-col justify-between'>
      <div className=''>
        {/* Logo */}
        <img src="/Logo.png" alt="logo" className='mx-auto mb-6' />
        {/* Navlinks */}
        <ul className='border-t border-gray-300'>
          {siderNavlinks.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.name} className='mb-1'>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-2 cursor-pointer ${isActive ? 'bg-blue-100 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
                    } hover:bg-gray-100 rounded transition-colors duration-200`}
                >
                  <IconComponent size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Profile setup with logout */}
      <div className='space-y-4'>
        {/* Profile Section */}
        <Link to='/profile'>
          <div className='bg-gray-100 rounded-lg p-4 flex items-center space-x-3 hover:bg-gray-200 transition-colors duration-200'>
            <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden'>
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className='flex-1'>
              <p className='font-medium text-gray-900'>{user?.username || 'User'}</p>
              <p className='text-sm text-gray-500'>View Profile</p>
            </div>
          </div>
        </Link>
        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to logout?</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="small"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Sidebar;