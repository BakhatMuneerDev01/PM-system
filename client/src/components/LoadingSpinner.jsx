// LoadingSpinner.jsx
export default function LoadingSpinner({ full = true }) {
    // full=true -> fill viewport height; full=false -> center in container
    return (
        <div className={`flex items-center justify-center ${full ? 'min-h-screen' : 'min-h-[60vh]'} w-full`}>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
    );
};
