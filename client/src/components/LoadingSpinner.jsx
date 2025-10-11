// src/components/LoadingSpinner.jsx
export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-full w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
    );
};