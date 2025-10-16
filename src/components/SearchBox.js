import React, { useState, useCallback, useEffect } from 'react';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAutocomplete, clearSuggestions, addToSearchHistory } from '../redux/searchSlice';
import { debounce } from 'lodash';

const SearchBox = ({ className = "" }) => {
  const [searchValue, setSearchValue] = useState('');
  const [lastQuery, setLastQuery] = useState(''); // Track last query to avoid duplicate calls
  const history = useHistory();
  const dispatch = useDispatch();
  
  const { suggestions, autocompleteLoading, searchHistory } = useSelector(state => state.search);

  // Debounced autocomplete function with increased delay
  const debouncedAutocomplete = useCallback(
    debounce((query) => {
      // Only make API call if query is different from last one and meets criteria
      if (query && query.length >= 3 && query !== lastQuery) { // Increased minimum length to 3
        dispatch(fetchAutocomplete(query));
        setLastQuery(query);
      } else if (!query || query.length < 3) {
        dispatch(clearSuggestions());
        setLastQuery('');
      }
    }, 600), // Increased debounce delay to 600ms
    [dispatch, lastQuery]
  );

  // Trigger autocomplete when value changes
  useEffect(() => {
    debouncedAutocomplete(searchValue);
    
    // Cleanup function to cancel debounced call
    return () => {
      debouncedAutocomplete.cancel();
    };
  }, [searchValue, debouncedAutocomplete]);

  // Format options for AutoComplete
  const getOptions = () => {
    const options = [];
    
    // Add search history if no current search
    if (!searchValue && searchHistory.length > 0) {
      options.push({
        label: (
          <div className="text-gray-500 text-xs font-medium px-2 py-1">
            Recent Searches
          </div>
        ),
        options: searchHistory.slice(0, 5).map(item => ({
          value: item,
          label: (
            <div className="flex items-center gap-2 py-1">
              <SearchOutlined className="text-gray-400 text-xs" />
              <span className="text-gray-700">{item}</span>
            </div>
          )
        }))
      });
    }
    
    // Add current suggestions
    if (suggestions.length > 0) {
      options.push({
        label: (
          <div className="text-gray-500 text-xs font-medium px-2 py-1">
            Suggestions
          </div>
        ),
        options: suggestions.map(suggestion => ({
          value: suggestion,
          label: (
            <div className="flex items-center gap-2 py-1">
              <SearchOutlined className="text-gray-400 text-xs" />
              <span className="text-gray-700">{suggestion}</span>
            </div>
          )
        }))
      });
    }
    
    return options;
  };

  const handleSearch = (value) => {
    if (value && value.trim()) {
      const trimmedValue = value.trim();
      dispatch(addToSearchHistory(trimmedValue));
      history.push(`/products?search=${encodeURIComponent(trimmedValue)}`);
      // Don't clear search value immediately - let user see what they searched for
      dispatch(clearSuggestions());
    }
  };

  const handleSelect = (value) => {
    // Update the search value to show the selected suggestion
    setSearchValue(value);
    handleSearch(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchValue);
    }
  };

  // Clear search value when user starts typing a new search
  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  // Clear search input
  const handleClear = () => {
    setSearchValue('');
    setLastQuery('');
    dispatch(clearSuggestions());
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      <AutoComplete
        value={searchValue}
        options={getOptions()}
        onSelect={handleSelect}
        onSearch={handleSearchChange}
        className="w-full"
        popupClassName="search-dropdown"
        notFoundContent={
          autocompleteLoading 
            ? 'Searching...' 
            : searchValue.length < 3 
              ? 'Type at least 3 characters' 
              : 'No suggestions found'
        }
        placeholder="Search for products, brands and more"
      >
        <Input
          size="large"
          suffix={
            <div className="flex items-center gap-2">
              <SearchOutlined className="cursor-pointer text-gray-500 hover:text-gray-700" />
              {searchValue && (
                <CloseOutlined 
                  onClick={handleClear}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                />
              )}
            </div>
          }
          className="rounded-md"
          onKeyPress={handleKeyPress}
          loading={autocompleteLoading}
        />
      </AutoComplete>
    </div>
  );
};

export default SearchBox;