const Button = ({
    size,
    variant,
    children,
    disabled = false,
    onClick,
    type = 'button',
    className = '',
    icon: Icon,
    ...props
}) => {
    const sizes = {
        small: 'px-2 py-1.5',
        medium: 'px-4 py-2',
        large: 'px-8 py-3'
    }

    const variants = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
        ghost: 'hover:bg-gray-200 text-gray-700',
        link: 'text-primary-400 hover:text-primary-500'
    }

    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-sm transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

    const classes = `${className} ${baseClasses} ${sizes[size]} ${variants[variant]}`

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={classes}
            size={size}
            variant={variant}
            {...props}
        >
            {Icon && <Icon className={`${className} mr-2 w-4 h-4`} />}
            {children}
        </button>
    )
};

export default Button;