// src/components/LoadingOverlay.jsx
export default function LoadingOverlay({ message = "Loading..." }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-40 rounded-lg">
            <div className="flex flex-col items-center space-y-3">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-gray-700 font-medium">{message}</p>
            </div>
        </div>
    );
};