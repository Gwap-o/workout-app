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
  // Check if dark mode is active
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="bg-[#FCFCF9] dark:bg-[#0D1117] p-4 rounded-lg border border-[#E8EAED] dark:border-[#30363D]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Workout Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#202124] dark:text-[#E6EDF3]">
            Filter by Workout Type
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterTypeChange('all')}
              className={`px-3 sm:px-4 py-2 rounded font-medium text-sm sm:text-base ${
                filterType === 'all'
                  ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white'
                  : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterTypeChange('A')}
              className={`px-3 sm:px-4 py-2 rounded font-medium text-sm sm:text-base ${
                filterType === 'A'
                  ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white'
                  : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
              }`}
            >
              Workout A
            </button>
            <button
              onClick={() => onFilterTypeChange('B')}
              className={`px-3 sm:px-4 py-2 rounded font-medium text-sm sm:text-base ${
                filterType === 'B'
                  ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white'
                  : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
              }`}
            >
              Workout B
            </button>
          </div>
        </div>

        {/* Date Search */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#202124] dark:text-[#E6EDF3]">
            Search by Date
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => onSearchDateChange(e.target.value)}
              style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
              className="flex-1 px-3 py-2 border border-[#E8EAED] dark:border-[#30363D] bg-[#FCFCF9] dark:bg-[#0D1117] text-[#202124] dark:text-[#E6EDF3] rounded focus:outline-none focus:ring-2 focus:ring-[#20808D] dark:focus:ring-[#1FB8CD]"
            />
            {searchDate && (
              <button
                onClick={() => onSearchDateChange('')}
                className="px-4 py-2 bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] rounded hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]"
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
