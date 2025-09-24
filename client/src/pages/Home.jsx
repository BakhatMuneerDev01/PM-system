import { Button } from '../components/ui/base';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col">
            <div className='bg-white p-6 shadow-lg rounded-lg'>
                <div className="w-sm">
                    <span className="inline-block mb-2 text-md font-bold uppercase text-gray-500 border border-gray-600 p-1 rounded-lg bg-blue-50">Welcome to</span>
                    <h1 className="text-4xl font-bold text-gray-800">
                        A Health Solutions Inc.
                    </h1>
                </div>
                <div className="w-sm mt-4 bg-blue-50 border border-gray-400 rounded-lg px-2 py-4 text-center">
                    <p className="text-sm text-gray=300">Before proceed, please Login or create new Account.</p>
                    <div className="flex justify-center gap-2 mt-4">
                        <Button
                            variant='outline'
                            size='md'
                        >Login</Button>
                        <Button
                            variant='primary'
                            size='md'
                        >Sign Up</Button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Home;