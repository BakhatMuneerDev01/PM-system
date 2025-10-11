import { useEffect } from "react";
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Sidebar,
    LoadingSpinner
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
            <Sidebar />
            <main className='flex-1 p-8 overflow-y-auto'>
                <Outlet />
            </main>
        </div>
    )
};

export default MainLayout;