import { LayoutDashboard, User, MessageSquare } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation();
  // In your Sidebar component
  const siderNavlinks = [
    { name: "Dashboard", path: '/', icon: LayoutDashboard },
    { name: "My Patients", path: '/patients', icon: User }, // This should work now
    { name: "Messaging", path: '/messaging', icon: MessageSquare },
  ]

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
      {/* Profile setup  */}
      <div>
        <div className='bg-gray-200 h-20 rounded-md flex items-center justify-center'>
          <p className='text-center'>Profile Setup is going here !</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar