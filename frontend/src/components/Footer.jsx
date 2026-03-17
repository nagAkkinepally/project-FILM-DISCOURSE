import { FiFilm, FiGithub, FiTwitter } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <FiFilm className="footer-logo-icon" />
                            <span>Film<span style={{ color: 'var(--accent-primary)' }}>Discourse</span></span>
                        </div>
                        <p className="footer-tagline">
                            A decentralized platform for collaborative movie logging, reviews, and information management.
                        </p>
                    </div>
                    <div className="footer-links-group">
                        <h4 className="footer-group-title">Platform</h4>
                        <Link to="/movies" className="footer-link">Browse Movies</Link>
                        <Link to="/movies/top-rated" className="footer-link">Top Rated</Link>
                        <Link to="/movies/add" className="footer-link">Add Movie</Link>
                    </div>
                    <div className="footer-links-group">
                        <h4 className="footer-group-title">Account</h4>
                        <Link to="/login" className="footer-link">Sign In</Link>
                        <Link to="/register" className="footer-link">Sign Up</Link>
                        <Link to="/profile" className="footer-link">Profile</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="footer-copy">© 2024 Film Discourse. All rights reserved.</p>
                    <div className="footer-social">
                        <a href="#" className="social-btn"><FiGithub /></a>
                        <a href="#" className="social-btn"><FiTwitter /></a>
                    </div>
                </div>
            </div>
            <style>{`
        .footer {
          border-top: 1px solid var(--border-color);
          background: var(--bg-secondary);
          padding: 3rem 0 1.5rem;
          margin-top: auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          padding-bottom: 2rem;
        }
        .footer-brand {}
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        .footer-logo-icon { color: var(--accent-primary); font-size: 1.4rem; }
        .footer-tagline { color: var(--text-muted); font-size: 0.875rem; line-height: 1.7; max-width: 280px; }
        .footer-group-title { font-size: 0.875rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .footer-links-group { display: flex; flex-direction: column; gap: 0.625rem; }
        .footer-link { color: var(--text-muted); font-size: 0.875rem; text-decoration: none; transition: color var(--transition-fast); }
        .footer-link:hover { color: var(--text-primary); }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
        .footer-copy { font-size: 0.825rem; color: var(--text-muted); }
        .footer-social { display: flex; gap: 0.5rem; }
        .social-btn { width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--bg-hover); color: var(--text-muted); display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: all var(--transition-fast); text-decoration: none; }
        .social-btn:hover { background: var(--accent-primary); color: white; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .footer-brand { grid-column: 1 / -1; }
          .footer-bottom { flex-direction: column; gap: 1rem; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </footer>
    )
}
