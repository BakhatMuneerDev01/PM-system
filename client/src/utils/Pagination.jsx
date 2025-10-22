import React from 'react';
import { Button } from '../components/ui/base';

const Pagination = ({
    from,
    to,
    total,
    currentPage,
    totalPages,
    onPrevious,
    onNext,
    onPageChange,
    className = 'mt-4'
}) => {
    // Generate page numbers with ellipsis logic
    const generatePageNumbers = () => {
        const pages = [];
        const delta = 1; // Number of pages to show around current page

        for (let page = 1; page <= totalPages; page++) {
            if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - delta && page <= currentPage + delta)
            ) {
                pages.push(page);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className={`px-4 py-3 sm:px-6 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                        Showing {from} to {to} of {total} results
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="small"
                        disabled={currentPage === 1}
                        onClick={onPrevious}
                    >
                        Previous
                    </Button>

                    {pageNumbers.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-2 py-1 text-gray-500">...</span>
                            ) : (
                                <Button
                                    variant={currentPage === page ? 'primary' : 'outline'}
                                    size="small"
                                    onClick={() => onPageChange(page)}
                                    className={currentPage === page ? 'bg-blue-500 text-white' : ''}
                                >
                                    {page}
                                </Button>
                            )}
                        </React.Fragment>
                    ))}

                    <Button
                        variant="outline"
                        size="small"
                        disabled={currentPage === totalPages}
                        onClick={onNext}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;