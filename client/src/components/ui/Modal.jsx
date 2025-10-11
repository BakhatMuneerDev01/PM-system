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
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-3xl',
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
        }
        document.addEventListener("keydown", handleEscape);
        return () => { document.removeEventListener("keydown", handleEscape) };
    }, [isOpen, onClose])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black opacity-30 transition-opacity"
                    // onClick={closeOnOverlayClick ? onClose : null}
                />
                {/* Modal Content */}
                <div className={`relative bg-white rounded-lg shadow-xl w-full ${sizes[size]} transform transition-all duration-300`}>
                    {/* Header */}
                    {(title && showCloseButton) && (
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            {title && (
                                <Title
                                    title={title}
                                    Icon={Icon}
                                    active="true"
                                />
                            )}
                            {showCloseButton && (
                                <X
                                    onClick={() => onClose()}
                                    className="bg-red-500 hover:bg-red-600 rounded-full text-white p-1 transition-all duration-150 cursor-pointer"
                                />
                            )}
                        </div>
                    )}
                    {/* Body */}
                    <div className='p-6 text-left'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Modal;