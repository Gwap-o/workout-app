interface FilterBarProps {
  filterType: 'A' | 'B' | 'all';
  searchDate: string;
  onFilterTypeChange: (type: 'A' | 'B' | 'all') => void;
  onSearchDateChange: (date: string) => void;
}

export const FilterBar = ({
  filterType,
  searchDate,
  onFilterTypeChange,
  onSearchDateChange,
}: FilterBarProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Workout Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Filter by Workout Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onFilterTypeChange('all')}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterTypeChange('A')}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                filterType === 'A'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Workout A
            </button>
            <button
              onClick={() => onFilterTypeChange('B')}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                filterType === 'B'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Workout B
            </button>
          </div>
        </div>

        {/* Date Search */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Search by Date
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => onSearchDateChange(e.target.value)}
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchDate && (
              <button
                onClick={() => onSearchDateChange('')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
