import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService, reviewService } from '../services'
import { StarDisplay } from '../components/StarRating'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiCalendar, FiLogOut, FiStar } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function ProfilePage() {
    const { user, isAdmin, logout } = useAuth()
    const navigate = useNavigate()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user?.userId) {
            reviewService.getByUser(user.userId, { page: 0, size: 20 })
                .then(r => setReviews(r.data.data?.content || []))
                .catch(() => { })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [user])

    const handleLogout = () => { logout(); navigate('/') }

    const joinDate = user?.createdAt || new Date().toISOString()

    return (
        <div className="profile-page animate-fadeIn">
            <div className="container">
                {/* Profile Header */}
                <div className="profile-header card">
                    <div className="profile-avatar">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{user?.fullName || user?.username}</h1>
                        <div className="profile-username">@{user?.username}</div>
                        <div className="profile-meta">
                            <span><FiMail /> {user?.email}</span>
                            <span><FiCalendar /> Joined {formatDistanceToNow(new Date(joinDate), { addSuffix: true })}</span>
                        </div>
                        <div className="profile-roles">
                            {user?.roles?.map(role => (
                                <span key={role} className={`badge ${role === 'ROLE_ADMIN' ? 'badge-primary' : 'badge-green'}`}>
                                    {role.replace('ROLE_', '')}
                                </span>
                            ))}
                        </div>
                    </div>
                    <button className="btn btn-secondary" onClick={handleLogout} style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
                        <FiLogOut /> Sign Out
                    </button>
                </div>

                {/* Stats */}
                <div className="profile-stats">
                    <div className="stat-card card">
                        <div className="stat-number">{reviews.length}</div>
                        <div className="stat-label">Reviews Written</div>
                    </div>
                    <div className="stat-card card">
                        <div className="stat-number">
                            {reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '—'}
                        </div>
                        <div className="stat-label">Avg. Rating Given</div>
                    </div>
                    {isAdmin && (
                        <div className="stat-card card" style={{ borderColor: 'rgba(108,99,255,0.3)' }}>
                            <div className="stat-number" style={{ color: 'var(--accent-primary)' }}>Admin</div>
                            <div className="stat-label">Account Type</div>
                        </div>
                    )}
                </div>

                {/* My Reviews */}
                <div className="reviews-section">
                    <h2 className="section-heading">My Reviews</h2>
                    <div className="divider" />
                    {loading ? (
                        <div className="flex flex-col gap-3 mt-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} />
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="empty-state" style={{ padding: '3rem 0' }}>
                            <div className="empty-state-icon"><FiStar /></div>
                            <div className="empty-state-title">No reviews yet</div>
                            <div className="empty-state-desc">Start reviewing movies to see them here</div>
                            <Link to="/movies" className="btn btn-primary mt-4">Browse Movies</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            {reviews.map(review => (
                                <Link
                                    key={review.id}
                                    to={`/movies/${review.movieId}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="review-item card">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{review.movieTitle}</h3>
                                            <StarDisplay rating={review.rating} showNumber />
                                        </div>
                                        {review.comment && (
                                            <p className="line-clamp-2" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{review.comment}</p>
                                        )}
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                            {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : ''}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .profile-page { padding: 2rem 0 4rem; }
        .profile-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .profile-avatar {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; font-weight: 700; color: white;
          flex-shrink: 0;
        }
        .profile-info { flex: 1; }
        .profile-name { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
        .profile-username { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.75rem; }
        .profile-meta { display: flex; gap: 1.25rem; flex-wrap: wrap; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem; }
        .profile-meta span { display: flex; align-items: center; gap: 0.375rem; }
        .profile-roles { display: flex; gap: 0.5rem; }
        .profile-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { text-align: center; padding: 1.5rem; }
        .stat-number { font-size: 2rem; font-weight: 800; color: var(--accent-primary); }
        .stat-label { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }
        .reviews-section {}
        .section-heading { font-size: 1.375rem; font-weight: 700; margin-bottom: 1rem; }
        .review-item:hover { border-color: var(--accent-primary); }
      `}</style>
        </div>
    )
}
