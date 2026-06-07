const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other']

function Filters({ filters, onFilterChange }) {
  function handleChange(field, value) {
    onFilterChange({ ...filters, [field]: value })
  }

  return (
    <div className="filters-grid">
      <div className="form-group">
        <label>Search by note</label>
        <input type="text" value={filters.search} onChange={e => handleChange('search', e.target.value)} placeholder="Search..." />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={filters.category} onChange={e => handleChange('category', e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>From Date</label>
        <input type="date" value={filters.startDate} onChange={e => handleChange('startDate', e.target.value)} />
      </div>
      <div className="form-group">
        <label>To Date</label>
        <input type="date" value={filters.endDate} onChange={e => handleChange('endDate', e.target.value)} />
      </div>
      <div className="form-group">
        <label>&nbsp;</label>
        <button className="btn-secondary" onClick={() => onFilterChange({ search: '', category: '', startDate: '', endDate: '' })}>
          Clear
        </button>
      </div>
    </div>
  )
}

export default Filters