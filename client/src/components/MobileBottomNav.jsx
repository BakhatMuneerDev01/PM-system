import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, MessageSquare, User as UserIcon, Calendar } from 'lucide-react';

const MobileBottomNav = () => {
    const location = useLocation();

    // Update the navItems array:
    const navItems = [
        { name: "Dashboard", path: '/', icon: LayoutDashboard },
        { name: "Patients", path: '/patients', icon: User },
        { name: "Visits", path: '/visits', icon: Calendar }, // Add this line
        { name: "Messaging", path: '/messaging', icon: MessageSquare },
        { name: "Profile", path: '/profile', icon: UserIcon },
    ];

    return (
        <div className="bg-white shadow-2xl border-t border-gray-200 py-3 px-4 flex justify-around items-center">
            {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;

                return (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                            }`}
                    >
                        <IconComponent size={24} />
                        {/* No text labels - only icons as requested */}
                    </Link>
                );
            })}
        </div>
    );
};

export default MobileBottomNav;