
function SearchBar({ search, setSearch, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSearch?.(search)
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="ค้นหาสายพันธุ์แมว..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        aria-label="ค้นหาสายพันธุ์แมว"
      />
      <button type="submit">ค้นหา</button>
    </form>
  )
}

export default SearchBar
