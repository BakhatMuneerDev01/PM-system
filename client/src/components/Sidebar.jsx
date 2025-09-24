import { useState } from 'react';
import { LayoutDashboardIcon, User, MessageSquareIcon, UserCircle, LogOut } from 'lucide-react';
import { Button } from './ui/base';

const Sidebar = () => {
    // Default active item = "My Patients"
    const [activeItem, setActiveItem] = useState("My Patients");

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboardIcon },
        { name: "My Patients", icon: User },
        { name: "Messaging", icon: MessageSquareIcon },
    ];

    return (
        <div className="w-64 h-screen bg-white shadow-md flex flex-col justify-between py-4 px-2">
            {/* Logo */}
            <div>
                <div className="mb-10 flex items-center justify-center">
                    <img src="/src/assets/Logo.png" alt="logo" className="h-24 w-auto mr-2" />
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.name;

                        return (
                            <a
                                key={item.name}
                                href="#"
                                onClick={() => setActiveItem(item.name)}
                                className={`flex items-center py-3 px-2 rounded-md cursor-pointer transition
                                    ${isActive ? "bg-gray-400 text-white" : "hover:bg-gray-100 text-gray-700"}`}
                            >
                                <Icon className="w-5 h-5 mr-2" />
                                {item.name}
                            </a>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="mt-auto">
                <a
                    href="#"
                    className="flex items-center p-2 mb-3 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                    <UserCircle className="h-8 w-8 text-gray-500 mr-2" />
                    <div>
                        <p className="font-semibold text-gray-800">Admin User</p>
                        <p className="text-sm text-gray-500">Administrator</p>
                    </div>
                </a>
                <Button
                    variant="ghost"
                    size="md"
                    className="flex items-center p-3 text-red-600 hover:bg-red-50 rounded-md"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
