import { useState, useEffect } from 'react'
import { movieService } from '../services'
import MovieCard from '../components/MovieCard'
import { FiStar } from 'react-icons/fi'

export default function TopRatedPage() {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const fetchTopRated = async (page = 0) => {
        setLoading(true)
        try {
            const { data } = await movieService.getTopRated({ page, size: 12 })
            setMovies(data.data?.content || [])
            setTotalPages(data.data?.totalPages || 0)
            setCurrentPage(data.data?.number || 0)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchTopRated() }, [])

    return (
        <div className="top-rated-page animate-fadeIn">
            <div className="container">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiStar style={{ color: 'var(--accent-gold)' }} /> Top Rated Movies
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Ranked by community ratings
                    </p>
                </div>

                {loading ? (
                    <div className="movies-grid">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 'var(--radius-lg)' }} />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="movies-grid">
                            {movies.map((movie, idx) => (
                                <div key={movie.id} style={{ position: 'relative' }}>
                                    <div className="rank-badge">#{(currentPage * 12) + idx + 1}</div>
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button className="page-btn" disabled={currentPage === 0} onClick={() => fetchTopRated(currentPage - 1)}>‹</button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} className={`page-btn ${i === currentPage ? 'active' : ''}`} onClick={() => fetchTopRated(i)}>{i + 1}</button>
                                ))}
                                <button className="page-btn" disabled={currentPage === totalPages - 1} onClick={() => fetchTopRated(currentPage + 1)}>›</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
        .top-rated-page { padding: 2rem 0 4rem; }
        .rank-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          z-index: 2;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          color: var(--accent-gold);
          font-size: 0.8rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
        }
      `}</style>
        </div>
    )
}
