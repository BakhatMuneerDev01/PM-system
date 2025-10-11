import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone } from 'lucide-react';


const Input = ({
    label,
    placeholder,
    type = 'text',
    error = false,
    required = false,
    value,
    onChange,
    showPasswordToggle = false,
    icon: Icon,
    className = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type)
    useEffect(() => {
        if (type === 'password' && showPasswordToggle) {
            setInputType(showPassword ? 'text' : 'password')
        }
    }, [type, showPasswordToggle, showPassword])

    const getIcon = () => {
        if (Icon) {
            switch (type) {
                case 'email':
                    Icon = Mail
                    break;
                case 'password':
                    Icon = EyeOff
                    break;
                case 'phone':
                    Icon = Phone
                    break;
                case 'text':
                    Icon = User
                    break;
                default:
                    Icon = null
            }
        }
        return Icon;
    }

    const IconComponent = getIcon();

    return (
        <div className={`space-y-1 ${className}`}>
            {/* If label is passed than rander label here */}
            {label && (
                <label className='block text-sm font-medium text-gray-700'>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}
            {/* Input and Icon goes down */}
            <div className="relative">
                {/* If icon is passed than rander icon */}
                {IconComponent && (
                    <div className={`absolute ${error ? "top-3" : 'inset-y-0'} left-0 pl-3 flex items-center pointer-events-none`}>
                        <IconComponent className="h-4 w-4 text-gray-400" />
                    </div>
                )}

                {/* Input field */}
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`
                            w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                            ${IconComponent ? 'pl-10' : ''}
                            ${showPasswordToggle ? 'pr-10' : ''}
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                            ${error ? 'border-red-500 focus:ring-red-500' : ''}
                            disabled:bg-gray-50 disabled:text-gray-500
                        `}
                    {...props}
                    icon={IconComponent}
                />
                {/* if showTogglePassword is true than rander password */}
                {showPasswordToggle && type === 'password' && (
                    <button
                        type='button'
                        className={`absolute ${error ? 'top-3' : 'inset-y-0'} right-0 pr-3 flex items-center`}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                        )}
                    </button>
                )}
                {/* if Error is passwed than r ander it */}
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
            </div>
        </div>
    )

};

export default Input;