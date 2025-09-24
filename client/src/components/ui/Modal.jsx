import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
    title,
    showCloseButton = true,
    children,
    isOpen,
    onClose,
    size = 'md',
    closeOnOverlayClick = true
}) => {

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-3xl'
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.target === 'Escape' && isOpen) {
                onClose()
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => { document.removeEventListener('keydown', handleEscape) };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black opacity-50 transition-opacity"
                    onClick={closeOnOverlayClick ? onClose : null}
                />
                {/* Modal Content */}
                <div className={` relative bg-white rounded-lg shadow-xl w-full ${sizes[size]} transform transition-all duration-300`}>
                    {/* Header */}
                    {(title && showCloseButton) && (
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            {title && (
                                <h3 className="text-lg fndsemibold text-gray-900">
                                    {title}
                                </h3>
                            )}
                            {showCloseButton && (
                                <button
                                    onClick={() => onClose()}
                                    className='text-gray-400 hover:text-gray-600 transition-colors'
                                >
                                    <X className='w-5 h-5' />
                                </button>
                            )}
                        </div>
                    )}
                    {/* Body */}
                    <div className='p-6'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Modal;