import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const SearchBar = () => {
    // Get the master list of doctors from the global context, which fetches from the API
    const { doctors } = useContext(AppContext);
    const [query, setQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === '') {
            setFilteredResults([]);
            setShowDropdown(false);
            return;
        }

        // --- THE FIX ---
        // Search by combining the first and last names from the nested `user` object.
        const results = doctors.filter(doc => {
            // Construct the full name to search against
            const fullName = `Dr. ${doc.user.first_name} ${doc.user.last_name}`.toLowerCase();
            return fullName.includes(value.toLowerCase());
        });

        setFilteredResults(results);
        setShowDropdown(true);
    };

    const handleSelectDoctor = (id) => {
        // Clear the search bar and hide the dropdown after a doctor is selected
        setQuery('');
        setShowDropdown(false);
        // Navigate to the selected doctor's appointment page
        navigate(`/appointment/${id}`);
    };

    return (
        <div className="relative w-full max-w-md">
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                onFocus={handleSearch} // Allows dropdown to appear when focusing
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Hide dropdown gracefully when clicking away
                placeholder="Search doctor by name..."
                className="w-full px-4 py-2 rounded-full border border-gray-400 focus:ring-2 focus:ring-blue-400 shadow-sm outline-none"
            />
            {showDropdown && query && ( // Only show dropdown if there's a query
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredResults.length > 0 ? (
                        filteredResults.map((doc) => (
                            <div
                                key={doc.id}
                                onMouseDown={() => handleSelectDoctor(doc.id)} // Use onMouseDown to prevent onBlur from firing first
                                className="px-4 py-3 hover:bg-blue-100 cursor-pointer"
                            >
                                {/* Display the data correctly from the API structure */}
                                <p className="font-semibold">Dr. {doc.user.first_name} {doc.user.last_name}</p>
                                <p className="text-sm text-gray-500">{doc.specialization}</p>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                            No doctors found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;