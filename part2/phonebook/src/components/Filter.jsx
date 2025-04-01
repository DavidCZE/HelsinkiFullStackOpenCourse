const Filter = ({ filter, handleFilterChange }) => (
    <div>
      Filter: <input value={filter} onChange={handleFilterChange} placeholder="Search" />
    </div>
  )
  
export default Filter
  