'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  initialValue?: string;
}

export function SearchBar({ 
  placeholder = 'Search...', 
  onSearch, 
  debounceMs = 300,
  initialValue = ''
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      onSearch(query);
      setIsLoading(false);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [query, debounceMs, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}
