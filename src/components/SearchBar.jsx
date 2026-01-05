import React, { useState } from 'react';
import '../styles/search-bar.css';

const SearchBar = ({ onSearch, placeholder = 'Search...', className = '' }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-icon">🔍</div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input"
      />
      {query && (
        <button className="clear-btn" onClick={handleClear}>
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;