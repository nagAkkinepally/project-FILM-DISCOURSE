import { useState, useEffect, useCallback } from 'react'
import { movieService } from '../services'
import MovieCard from '../components/MovieCard'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'

export default function MoviesPage() {
    const [movies, setMovies] = useState([])
    const [genres, setGenres] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)

    const [filters, setFilters] = useState({
        title: '',
        genre: '',
        releaseYear: '',
        sort: 'createdAt,desc',
    })
    const [searchInput, setSearchInput] = useState('')

    useEffect(() => {
        movieService.getGenres().then(r => setGenres(r.data.data || []))
    }, [])

    const fetchMovies = useCallback(async (page = 0) => {
        setLoading(true)
        try {
            const params = { page, size: 12 }
            if (filters.sort) params.sort = filters.sort

            let res
            const hasFilter = filters.title || filters.genre || filters.releaseYear
            if (hasFilter) {
                if (filters.title) params.title = filters.title
                if (filters.genre) params.genre = filters.genre
                if (filters.releaseYear) params.releaseYear = filters.releaseYear
                res = await movieService.search(params)
            } else {
                res = await movieService.getAll(params)
            }
            const data = res.data.data
            setMovies(data.content || [])
            setTotalPages(data.totalPages || 0)
            setCurrentPage(data.number || 0)
        } catch (err) {
            console.error('Failed to fetch movies', err)
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        const timer = setTimeout(() => fetchMovies(0), 300)
        return () => clearTimeout(timer)
    }, [fetchMovies])

    const handleSearch = (e) => {
        e.preventDefault()
        setFilters(f => ({ ...f, title: searchInput }))
    }

    const clearFilters = () => {
        setFilters({ title: '', genre: '', releaseYear: '', sort: 'createdAt,desc' })
        setSearchInput('')
    }

    const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i)

    return (
        <div className="movies-page animate-fadeIn">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Browse Movies</h1>
                    <p className="page-subtitle">Explore our collaborative movie database</p>
                </div>

                {/* Search & Filters */}
                <div className="filters-section">
                    <form onSubmit={handleSearch} className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search movies by title..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        {searchInput && (
                            <button type="button" className="clear-search" onClick={() => { setSearchInput(''); setFilters(f => ({ ...f, title: '' })) }}>
                                <FiX />
                            </button>
                        )}
                    </form>

                    <div className="filter-row">
                        <select
                            className="form-control filter-select"
                            value={filters.genre}
                            onChange={e => setFilters(f => ({ ...f, genre: e.target.value }))}
                        >
                            <option value="">All Genres</option>
                            {genres.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>

                        <select
                            className="form-control filter-select"
                            value={filters.releaseYear}
                            onChange={e => setFilters(f => ({ ...f, releaseYear: e.target.value }))}
                        >
                            <option value="">All Years</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>

                        <select
                            className="form-control filter-select"
                            value={filters.sort}
                            onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
                        >
                            <option value="createdAt,desc">Newest First</option>
                            <option value="averageRating,desc">Highest Rated</option>
                            <option value="title,asc">Title A–Z</option>
                            <option value="releaseYear,desc">Latest Release</option>
                        </select>

                        {(filters.title || filters.genre || filters.releaseYear) && (
                            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                                <FiX /> Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="movies-grid">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 'var(--radius-lg)' }} />
                        ))}
                    </div>
                ) : movies.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎬</div>
                        <div className="empty-state-title">No movies found</div>
                        <div className="empty-state-desc">Try adjusting your search or filters</div>
                        <button className="btn btn-primary mt-4" onClick={clearFilters}>Clear Filters</button>
                    </div>
                ) : (
                    <>
                        <div className="results-count">
                            Showing <strong>{movies.length}</strong> movie{movies.length !== 1 ? 's' : ''}
                        </div>
                        <div className="movies-grid mt-4">
                            {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    disabled={currentPage === 0}
                                    onClick={() => fetchMovies(currentPage - 1)}
                                >‹</button>
                                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                                    const page = i
                                    return (
                                        <button
                                            key={page}
                                            className={`page-btn ${page === currentPage ? 'active' : ''}`}
                                            onClick={() => fetchMovies(page)}
                                        >{page + 1}</button>
                                    )
                                })}
                                <button
                                    className="page-btn"
                                    disabled={currentPage === totalPages - 1}
                                    onClick={() => fetchMovies(currentPage + 1)}
                                >›</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
        .movies-page { padding: 2rem 0 4rem; }
        .page-header { margin-bottom: 2rem; }
        .page-title { font-size: 2rem; font-weight: 800; }
        .page-subtitle { color: var(--text-muted); margin-top: 0.25rem; }
        .filters-section { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .search-bar {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 0 1rem;
          transition: border-color var(--transition-fast);
        }
        .search-bar:focus-within { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(108,99,255,0.15); }
        .search-icon { color: var(--text-muted); font-size: 1rem; flex-shrink: 0; }
        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 0.875rem 0.75rem;
          font-size: 0.95rem;
          color: var(--text-primary);
          font-family: var(--font-sans);
        }
        .search-input::placeholder { color: var(--text-muted); }
        .clear-search {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          border-radius: 4px;
          transition: color var(--transition-fast);
        }
        .clear-search:hover { color: var(--text-primary); }
        .filter-row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
        .filter-select { flex: 1; min-width: 150px; max-width: 220px; }
        .results-count { color: var(--text-muted); font-size: 0.875rem; }
      `}</style>
        </div>
    )
}
