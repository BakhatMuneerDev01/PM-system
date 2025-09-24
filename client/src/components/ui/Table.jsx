// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, Edit, Calendar } from 'lucide-react';
// import { Modal } from './base';

// const Table = ({
//     columns,
//     data,
//     onRowClick,
//     actions = [],
//     loading = false
// }) => {
//     const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);


//     const navigate = useNavigate();

//     if (loading) return <div>Loading...</div>;

//     return (
//         <div className='overflow-x-auto'>
//             <table className='min-w-full divide-y divide-gray-400'>
//                 <thead className='bg-gray-100'>
//                     <tr>
//                         {columns.map((column) => (
//                             <th
//                                 key={column.key}
//                                 className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
//                             >
//                                 {column.title}
//                             </th>
//                         ))}
//                         {actions.length > 0 && (
//                             <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                                 Actions
//                             </th>
//                         )}
//                     </tr>
//                 </thead>
//                 <tbody className='bg-white divide-y divide-gray-300'>
//                     {data.map((row, index) => (
//                         <tr
//                             key={row.id || index}
//                             className='hover:bg-gray-50'
//                             onClick={onRowClick && onRowClick(row)}
//                         >
//                             {columns.map((column) => (
//                                 <td
//                                     key={column.key}
//                                     className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
//                                 >
//                                     {column.key === 'fullName' || column.key === 'lastVisit' ? (
//                                         <div className="text-blue-600">{row[column.key]}</div>
//                                     ) : (
//                                         row[column.key]
//                                     )}
//                                 </td>

//                             ))}
//                             {actions.length > 0 && (
//                                 <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
//                                     <div className='flex space-x-2'>
//                                         {actions.map((action, actionIndex) => (
//                                             <button
//                                                 key={actionIndex}
//                                                 onClick={() => action.onClick(row)}
//                                                 className='text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
//                                                 title={action.title}
//                                             >
//                                                 <action.Icon className='w-4 h-4' />
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </td>
//                             )}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Table;

// components/ui/base/Table.jsx
import React from 'react';
import { Eye, Edit } from 'lucide-react';

const Table = ({
    columns,
    data,
    onRowClick,
    actions = [],
    loading = false
}) => {
    if (loading) return <div>Loading...</div>;

    const renderActionItem = (action, row, actionIndex) => {
        if (action.type === 'button') {
            return (
                <button
                    key={actionIndex}
                    onClick={() => action.onClick(row)}
                    className={`px-3 py-1 rounded ${action.className || 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    title={action.title}
                >
                    {action.label || action.title}
                </button>
            );
        }

        // Default icon rendering
        const Icon = action.Icon;
        return Icon ? (
            <button
                key={actionIndex}
                onClick={() => action.onClick(row)}
                className='text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
                title={action.title}
            >
                <Icon className='w-4 h-4' />
            </button>
        ) : null;
    };

    return (
        <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-400'>
                <thead className='bg-gray-100'>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                                {column.title}
                            </th>
                        ))}
                        {actions.length > 0 && (
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-300'>
                    {data.map((row, index) => (
                        <tr
                            key={row.id || index}
                            className='hover:bg-gray-50'
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    onClick={() => onRowClick && onRowClick(row)}
                                >
                                    {column.key === 'fullName' || column.key === 'lastVisit' ? (
                                        <div className="text-blue-600 cursor-pointer">{row[column.key]}</div>
                                    ) : (
                                        row[column.key]
                                    )}
                                </td>
                            ))}
                            {actions.length > 0 && (
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                    <div className='flex space-x-2'>
                                        {actions.map((action, actionIndex) => renderActionItem(action, row, actionIndex))}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;