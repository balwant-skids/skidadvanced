'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function FilterDropdown({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Select filters...'
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const getSelectedLabels = () => {
    return options
      .filter(opt => selectedValues.includes(opt.value))
      .map(opt => opt.label);
  };

  const selectedLabels = getSelectedLabels();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {selectedValues.length > 0 && (
          <span className="px-2 py-0.5 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
            {selectedValues.length}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2">
            {/* Header with Clear All */}
            {selectedValues.length > 0 && (
              <div className="flex items-center justify-between px-2 py-1 mb-2">
                <span className="text-xs font-medium text-gray-500">
                  {selectedValues.length} selected
                </span>
                <button
                  onClick={clearAll}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedLabels.map((label, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full"
            >
              <span>{label}</span>
              <button
                onClick={() => {
                  const value = options.find(opt => opt.label === label)?.value;
                  if (value) toggleOption(value);
                }}
                className="hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
