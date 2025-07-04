import React, { useEffect, useRef, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { assets } from '../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearch,
  setShowSearch,
  setSearchConfirmed
} from '../redux/uiSlice';
import {
  fetchAISearchSuggestions,
  clearAISuggestions
} from '../redux/aiSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef();

  const showSearch = useSelector((state) => state.ui.showSearch);
  const search = useSelector((state) => state.ui.search);
  const { 
    products, 
    categories, 
    subcategories, 
    loading, 
    error,
    lastQuery 
  } = useSelector((state) => state.ai);

  const [visible, setVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim().length > 0) {
        dispatch(fetchAISearchSuggestions(query));
        setShowSuggestions(true);
      } else {
        dispatch(clearAISuggestions());
        setShowSuggestions(false);
      }
    }, 500), // 500ms debounce delay
    [dispatch]
  );

  // Show only on /collection page
  useEffect(() => {
    setVisible(location.pathname.startsWith('/collection'));
  }, [location]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    dispatch(setSearch(query));
    
    if (query.trim().length === 0) {
      debouncedSearch.cancel();
      dispatch(clearAISuggestions());
      setShowSuggestions(false);
    } else {
      debouncedSearch(query);
    }
  };

  const selectSuggestion = (sugg) => {
    const selected = typeof sugg === 'string' ? sugg : sugg.name || '';
    dispatch(setSearch(selected));
    dispatch(setSearchConfirmed(true));
    dispatch(clearAISuggestions());
    setShowSuggestions(false);
    navigate('/collection');
  };

  const clearInput = () => {
    dispatch(setSearch(''));
    dispatch(clearAISuggestions());
    setShowSuggestions(false);
    debouncedSearch.cancel();
  };

  const closeBar = () => {
    dispatch(setShowSearch(false));
    dispatch(setSearch(''));
    setShowSuggestions(false);
    debouncedSearch.cancel();
  };

  // Group suggestions by type
  const groupedSuggestions = [
    {
      title: 'Products',
      items: products,
      visible: products.length > 0
    },
    {
      title: 'Categories',
      items: categories,
      visible: categories.length > 0
    },
    {
      title: 'Subcategories',
      items: subcategories,
      visible: subcategories.length > 0
    }
  ].filter(group => group.visible);

  if (!showSearch || !visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-x-0 top-0 bg-gray-50 border-b border-gray-200 z-50 p-4"
    >
      <div className="relative mx-auto flex items-center w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-2xl">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          onFocus={() => search.trim() !== '' && setShowSuggestions(true)}
          placeholder="Search products, categories..."
          className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {search.trim() === '' ? (
          <img
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5 absolute right-12 cursor-default"
          />
        ) : (
          <img
            src={assets.cross_icon}
            alt="clear"
            onClick={clearInput}
            className="w-4 h-4 absolute right-12 cursor-pointer hover:opacity-80"
          />
        )}

        <button
          onClick={closeBar}
          className="ml-3 sm:ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close search"
        >
          <img src={assets.cross_icon} alt="close" className="w-5 h-5" />
        </button>
      </div>

      {/* Enhanced Suggestion List */}
      {showSuggestions && search.trim() !== '' && (
        <div className="mt-2 mx-auto w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-2xl bg-white border border-gray-300 rounded-lg shadow-lg overflow-auto max-h-96">
          {error ? (
            <div className="px-3 py-2 text-sm text-red-500">
              {error}
            </div>
          ) : loading ? (
            <div className="px-3 py-2 text-sm text-gray-500 flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching for ...
            </div>
          ) : groupedSuggestions.length > 0 ? (
            <>
              <div className="px-3 pt-2 text-xs text-gray-500">
                Suggestions
              </div>
              {groupedSuggestions.map((group, groupIdx) => (
                <div key={groupIdx}>
                  <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100">
                    {group.title}
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {group.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => selectSuggestion(item)}
                      >
                        {item.image && (
                          <img 
                            src={item.image[0]} 
                            alt="" 
                            className="w-6 h-6 rounded-full mr-2 object-cover"
                            onError={(e) => {
                              e.target.src = assets.placeholder_image;
                            }}
                          />
                        )}
                        <span className="truncate">
                          {item.name || item}
                        </span>
                        {item.bestseller && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800 whitespace-nowrap">
                            Bestseller
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No suggestions found for "{lastQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;