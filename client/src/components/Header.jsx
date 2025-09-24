import { Button } from './ui/base';
import { User } from 'lucide-react';

const Header = () => {
    return (
        <div className='w-full text-right px-6 py-4'>
            <Button
                variant='primary'
                size='md'
            >
                <User className='mr-2 w-5 h-5' />
                Add Patients
            </Button>
        </div>
    )
};

export default Header;