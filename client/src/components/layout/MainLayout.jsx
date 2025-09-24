import Sidebar from '../Sidebar';
import Header from '../Header';

const MainLayout = ({children}) => {
    return(
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col px-12 py-4">
                <Header />
                <main className='flex-1 p-6'>
                    {children}
                </main>
            </div>
        </div>
    )
};

export default MainLayout;