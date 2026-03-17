import { FiStar } from 'react-icons/fi'
import { Link } from 'react-router-dom'

function StarDisplay({ rating, size = '0.9rem' }) {
    return (
        <div className="stars" style={{ fontSize: size }}>
            {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`star ${star <= Math.round(rating) ? 'filled' : 'empty'}`}>★</span>
            ))}
        </div>
    )
}

export default function MovieCard({ movie }) {
    const placeholderBg = [
        'linear-gradient(135deg, #1a1a3e 0%, #2d1b69 100%)',
        'linear-gradient(135deg, #1a1429 0%, #3b1d5c 100%)',
        'linear-gradient(135deg, #0d1b2a 0%, #1b4332 100%)',
        'linear-gradient(135deg, #2d0a0a 0%, #5c1c1c 100%)',
        'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
    ]
    const bg = placeholderBg[movie.id % placeholderBg.length]

    return (
        <Link to={`/movies/${movie.id}`} className="movie-card" style={{ textDecoration: 'none' }}>
            <div className="movie-poster" style={{ background: !movie.posterUrl ? bg : undefined }}>
                {movie.posterUrl ? (
                    <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
                ) : (
                    <div className="poster-placeholder">
                        <FiStar style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.3)' }} />
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.5rem' }}>No Image</span>
                    </div>
                )}
                <div className="movie-card-overlay">
                    <span className="genre-tag">{movie.genre}</span>
                </div>
                {movie.averageRating > 0 && (
                    <div className="movie-rating-badge">
                        <span>★</span> {movie.averageRating.toFixed(1)}
                    </div>
                )}
            </div>
            <div className="movie-card-body">
                <h3 className="movie-card-title" title={movie.title}>{movie.title}</h3>
                <div className="movie-card-meta">
                    <span className="movie-year">{movie.releaseYear}</span>
                    <span className="meta-dot">·</span>
                    <span className="movie-director">{movie.director}</span>
                </div>
                {movie.averageRating > 0 && (
                    <div className="movie-card-rating">
                        <StarDisplay rating={movie.averageRating} />
                        <span className="review-count">({movie.totalReviews})</span>
                    </div>
                )}
            </div>
            <style>{`
        .movie-card {
          display: flex;
          flex-direction: column;
          background: var(--gradient-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-base);
        }
        .movie-card:hover {
          border-color: var(--accent-primary);
          box-shadow: 0 8px 32px rgba(108,99,255,0.2);
          transform: translateY(-4px);
        }
        .movie-poster {
          position: relative;
          aspect-ratio: 2/3;
          overflow: hidden;
        }
        .movie-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .movie-card:hover .movie-poster img { transform: scale(1.05); }
        .poster-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .movie-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.5rem;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
        }
        .genre-tag {
          display: inline-block;
          background: rgba(108,99,255,0.8);
          color: white;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 600;
        }
        .movie-rating-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          color: var(--accent-gold);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .movie-card-body {
          padding: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          flex: 1;
        }
        .movie-card-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.3;
        }
        .movie-card-meta {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .movie-director {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .meta-dot { color: var(--border-hover); }
        .movie-card-rating {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-top: 0.125rem;
        }
        .review-count { font-size: 0.7rem; color: var(--text-muted); }
      `}</style>
        </Link>
    )
}
