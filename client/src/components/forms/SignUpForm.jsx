import { Button, Input } from '../ui/base';
import { User, Mail, Phone, UserPlus } from 'lucide-react';
import AuthLayout from '../layout/AuthLayout';

const SignUpForm = () => {
    return (
        <AuthLayout>
            <div className='text-center mb-6'>
                <img
                    src='/src/assets/Logo.png'
                    alt='logo'
                    className='mx-auto h-18 w-auto'
                />
            </div>
            <div className='flex justify-center space-x-4 mb-6'>
                <Button
                    variant='ghost'
                    size='md'
                >Login</Button>
                <Button
                    variant='primary'
                    size='md'
                >Register</Button>
            </div>
            <form className='space-y-4'>
                <Input
                    label='Username'
                    name='username'
                    placeholder='Enter your username'
                    required
                    icon={User}
                />
                <Input
                    label='Full Name'
                    name='fullName'
                    placeholder='Enter your Full Name'
                    required
                    icon={User}
                />
                <Input
                    label='Email Address'
                    name='emailAddress'
                    placeholder='Enter your Email'
                    type='email'
                    required
                    icon={Mail}
                />
                <Input
                    label='Phone Number'
                    name='phoneNumber'
                    placeholder='Enter your phone number'
                    type='phone'
                    required
                    icon={Phone}
                />
                <div className='flex items-center gap-2'>
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        showPasswordToggle
                        required
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        name="password"
                        showPasswordToggle
                        required
                    />
                </div>
                <Button
                    variant='primary'
                    size='md'
                    className='w-full'
                >
                    Register
                </Button>
            </form>
        </AuthLayout>
    )
};

export default SignUpForm;