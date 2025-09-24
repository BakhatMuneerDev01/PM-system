const Button = ({
    children,
    onClick,
    disabled = false,
    type = 'button',
    size = 'default',
    variant = 'primary',  // ✅ fixed spelling
    loading = false,
    icons: Icons,
    className = '',
    ...props
}) => {
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-base'
    }
    const variants = {  // ✅ fixed spelling
        primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-primary-500',
        ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    }
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    const classes = `${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`
    return (
        <button
            type={type}
            onClick={onClick}
            className={classes}
            disabled={disabled || loading}
            {...props}
            icon={Icons}
        >   
            {Icons && <Icons />}
            {children}
        </button>
    )
};

export default Button;
