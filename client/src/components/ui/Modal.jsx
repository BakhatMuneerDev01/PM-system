import { useEffect } from "react";
import { User, X } from "lucide-react";
import Title from "./Title";

const Modal = ({
    title,
    showCloseButton = true,
    children,
    isOpen,
    onClose,
    Icon,
    size = 'md',
    closeOnOverlayClick = true
}) => {
    const sizes = {
        sm: 'w-11/12 max-w-md',
        md: 'w-11/12 max-w-lg',
        lg: 'w-11/12 max-w-2xl',
        xl: 'w-11/12 max-w-3xl',
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
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        document.addEventListener("keydown", handleEscape);
        return () => { document.removeEventListener("keydown", handleEscape) };
    }, [isOpen, onClose])

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    }

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-50 flex items-center justify-center p-4"
            onClick={handleOverlayClick}
        >
            {/* Modal Content */}
            <div className={`relative bg-white rounded-lg shadow-xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto ${sizes[size]}`}>
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                        {title && (
                            <Title
                                title={title}
                                Icon={Icon}
                                active="true"
                                className="text-lg md:text-xl"
                            />
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                            </button>
                        )}
                    </div>
                )}
                {/* Body */}
                <div className='p-4 md:p-6 text-left'>
                    {children}
                </div>
            </div>
        </div>
    )
};

export default Modal;