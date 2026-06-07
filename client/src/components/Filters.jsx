// Filters.jsx — Controls for filtering the expense list
// When the user changes any filter, it calls onFilterChange
// which updates the filter state in App.jsx

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other']

function Filters({ filters, onFilterChange }) {

  function handleChange(field, value) {
    // Spread the existing filters and only update the one that changed
    onFilterChange({ ...filters, [field]: value })
  }

  return (
    <div className="filters-container">
      <h3>Filter Expenses</h3>

      <div className="filters-row">

        {/* Search by note */}
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search by note..."
          />
        </div>

        {/* Filter by category */}
        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Filter by start date */}
        <div className="filter-group">
          <label>From Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>

        {/* Filter by end date */}
        <div className="filter-group">
          <label>To Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>

        {/* Clear all filters */}
        <div className="filter-group">
          <label>&nbsp;</label>
          <button
            className="btn-secondary"
            onClick={() => onFilterChange({ search: '', category: '', startDate: '', endDate: '' })}
          >
            Clear Filters
          </button>
        </div>

      </div>
    </div>
  )
}

export default Filters