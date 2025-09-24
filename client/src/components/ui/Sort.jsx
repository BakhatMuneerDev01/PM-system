import React, { useState } from 'react';

const Sort = ({ sortBy, onChange }) => {
    return (
        <div>
            <select
                value={sortBy}
                onChange={(e) => onChange(e.target.value)}
                className='p-2 border border-gray-200 rounded-md'
            >
                <option value='name'>Sort by Name</option>
                <option value='lastVisit'>Sort by Last Visit</option>
            </select>
        </div>
    );
};

export default Sort;
