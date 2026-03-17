import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { movieService } from '../services'
import MovieCard from '../components/MovieCard'
import { FiArrowRight, FiStar, FiFilm, FiUsers, FiTrendingUp } from 'react-icons/fi'

export default function HomePage() {
    const [featured, setFeatured] = useState([])
    const [topRated, setTopRated] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featuredRes, topRes] = await Promise.all([
                    movieService.getAll({ page: 0, size: 6, sort: 'createdAt,desc' }),
                    movieService.getTopRated({ page: 0, size: 4 }),
                ])
                setFeatured(featuredRes.data.data?.content || [])
                setTopRated(topRes.data.data?.content || [])
            } catch (err) {
                console.error('Failed to load home data', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="home-page animate-fadeIn">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="container hero-content">
                    <div className="hero-badge">
                        <FiStar style={{ color: 'var(--accent-gold)' }} />
                        <span>Collaborative Film Community</span>
                    </div>
                    <h1 className="hero-title font-serif">
                        Discover, Review &<br />
                        <span className="hero-title-accent">Collaborate on Cinema</span>
                    </h1>
                    <p className="hero-subtitle">
                        Film Discourse is your decentralized platform for collaborative movie logging, reviews,
                        and information management. Built by cinephiles, for cinephiles.
                    </p>
                    <div className="hero-actions">
                        <Link to="/movies" className="btn btn-primary btn-lg">
                            Browse Movies <FiArrowRight />
                        </Link>
                        <Link to="/register" className="btn btn-secondary btn-lg">
                            Join Community
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="stat-icon"><FiFilm /></div>
                            <div>
                                <div className="stat-value">6+</div>
                                <div className="stat-label">Movies</div>
                            </div>
                        </div>
                        <div className="hero-stat">
                            <div className="stat-icon"><FiUsers /></div>
                            <div>
                                <div className="stat-value">Growing</div>
                                <div className="stat-label">Community</div>
                            </div>
                        </div>
                        <div className="hero-stat">
                            <div className="stat-icon"><FiTrendingUp /></div>
                            <div>
                                <div className="stat-value">Live</div>
                                <div className="stat-label">Ratings</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recently Added */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Recently Added</h2>
                        <Link to="/movies" className="btn btn-ghost btn-sm">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="movies-grid">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 'var(--radius-lg)' }} />
                            ))}
                        </div>
                    ) : (
                        <div className="movies-grid">
                            {featured.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* Top Rated */}
            {!loading && topRated.length > 0 && (
                <section className="section section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">
                                <FiStar style={{ color: 'var(--accent-gold)', marginRight: '0.5rem' }} />
                                Top Rated
                            </h2>
                            <Link to="/movies/top-rated" className="btn btn-ghost btn-sm">
                                See More <FiArrowRight />
                            </Link>
                        </div>
                        <div className="movies-grid">
                            {topRated.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title text-center mb-8">Why Film Discourse?</h2>
                    <div className="features-grid">
                        {[
                            { icon: '🎬', title: 'Collaborative Editing', desc: 'Suggest edits to movie info and help maintain accurate data. Admin-reviewed for quality.' },
                            { icon: '⭐', title: 'Real-time Ratings', desc: 'Average ratings update automatically as users submit reviews. Always accurate.' },
                            { icon: '🔍', title: 'Powerful Search', desc: 'Filter by genre, year, director, or sort by rating to find your next watch.' },
                            { icon: '🛡️', title: 'Role-based Access', desc: 'Users review their own movies. Admins moderate content and approve edits.' },
                            { icon: '🚀', title: 'Fast & Cached', desc: 'Redis-backed caching ensures blazing-fast responses even under load.' },
                            { icon: '🔒', title: 'Secure by Design', desc: 'JWT authentication, BCrypt password hashing, rate limiting, and CORS protection.' },
                        ].map((f, i) => (
                            <div key={i} className="feature-card card">
                                <div className="feature-icon">{f.icon}</div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
        /* Hero */
        .hero {
          position: relative;
          padding: 6rem 0 4rem;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(108,99,255,0.12);
          border: 1px solid rgba(108,99,255,0.25);
          padding: 0.375rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--accent-secondary);
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          max-width: 700px;
        }
        .hero-title-accent {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          max-width: 560px;
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
        }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
        .hero-stats {
          display: flex;
          gap: 2.5rem;
          margin-top: 1rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
          justify-content: center;
        }
        .hero-stat { display: flex; align-items: center; gap: 0.75rem; }
        .stat-icon {
          width: 40px; height: 40px;
          background: rgba(108,99,255,0.12);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-primary); font-size: 1rem;
        }
        .stat-value { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); }

        /* Sections */
        .section { padding: 4rem 0; }
        .section-alt { background: rgba(255,255,255,0.01); }
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .section-title { font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; }

        /* Features */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .feature-card { text-align: center; }
        .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .feature-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .feature-desc { font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; }

        @media (max-width: 768px) {
          .hero { padding: 4rem 0 3rem; }
          .hero-stats { gap: 1.5rem; }
          .hero-actions { flex-direction: column; align-items: center; }
        }
      `}</style>
        </div>
    )
}
