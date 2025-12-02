'use client';

import { Search, Filter } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  icon?: 'search' | 'filter';
}

export function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your search or filters to find what you\'re looking for.',
  hasFilters = false,
  onClearFilters,
  icon = 'search'
}: EmptyStateProps) {
  const Icon = icon === 'search' ? Search : Filter;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-600 text-center max-w-md mb-4">
        {message}
      </p>

      {hasFilters && onClearFilters && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-500">
            Suggestions:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 text-center">
            <li>• Check your spelling</li>
            <li>• Try different keywords</li>
            <li>• Remove some filters</li>
          </ul>
          <button
            onClick={onClearFilters}
            className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
