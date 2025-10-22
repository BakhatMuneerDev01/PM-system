import { useEffect } from "react";
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Sidebar,
    LoadingSpinner,
    MobileBottomNav
} from '../index';

const MainLayout = ({ children }) => {
    const { loading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login')
        };
    }, [loading, user, navigate]);

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Desktop Sidebar - Fixed and doesn't scroll */}
            <div className="hidden md:block fixed top-0 left-0 h-screen z-40">
                <Sidebar />
            </div>

            {/* Main content area with left margin to account for fixed sidebar on desktop */}
            <main className='flex-1 p-4 md:p-8 overflow-y-auto md:ml-64 min-h-screen pb-16 md:pb-0'>
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation - Fixed at bottom */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <MobileBottomNav />
            </div>
        </div>
    )
};

export default MainLayout;