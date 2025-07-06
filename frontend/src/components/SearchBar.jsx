import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const SearchBar = () => {
    const { doctors } = useContext(AppContext);
    const [query, setQuery] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.trim() === '') {
            setFilteredDoctors([]);
            setShowDropdown(false);
            return;
        }

        const results = doctors.filter(doc =>
            doc.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDoctors(results);
        setShowDropdown(true);
    };

    const handleSelectDoctor = (id) => {
        setQuery('');
        setShowDropdown(false);
        navigate(`/appointment/${id}`);
    };

    return (
        <div className="relative w-full max-w-md border-black px-2 py-3.5">
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search doctor by name..."
                className="w-full px-2 py-1 rounded-full border border-black focus:ring-2 focus:ring-blue-300 shadow-sm outline-none"
            />
            {showDropdown && filteredDoctors.length > 0 && (
                <div className="absolute z-40 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
                    {filteredDoctors.map((doc) => (
                        <div
                            key={doc._id}
                            onClick={() => handleSelectDoctor(doc._id)}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                        >
                            {doc.name} <span className="text-gray-500">({doc.speciality})</span>
                        </div>
                    ))}
                </div>
            )}
            {showDropdown && query && filteredDoctors.length === 0 && (
                <div className="absolute z-40 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 text-sm text-gray-500">
                    No doctors found.
                </div>
            )}
        </div>
    );
};

export default SearchBar;
