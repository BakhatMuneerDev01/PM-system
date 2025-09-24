// import React, { useState } from 'react';
// import { Input } from './base';

// const SearchBar = ({ data = [] }) => {
//     const [searchTerm, setSearchTerm] = useState('');

//     const filteredData = data.filter((p) =>
//         p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.phoneNumber.includes(searchTerm)
//     );

//     return (
//         <div>
//             <Input
//                 placeholder='Search by name or phone'
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {/* Render filtered results */}
//             <ul>
//                 {filteredData.map((item, index) => (
//                     <li key={index}>{item.fullName} - {item.phone}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default SearchBar;


import React from 'react';
import { Input } from './base';

/**
 * Very simple SearchBar
 * Parent handles filtering logic.
 */
const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
    return (
        <div className="w-full">
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
