import React from 'react';
import { countries } from '../utils/countries';

const CountrySelector = ({
    value,
    onChange,
    label = 'Country',
    required = false,
    error = false,
    className = ''
}) => {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className='block text-sm font-medium text-gray-700'>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}

            <select
                value={value}
                onChange={onChange}
                className={`
          w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          disabled:bg-gray-50 disabled:text-gray-500
        `}
            >
                <option value="">Select a country</option>
                {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                        {country.name}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default CountrySelector;