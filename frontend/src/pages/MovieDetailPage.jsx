import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { movieService, reviewService, editService } from '../services'
import { useAuth } from '../context/AuthContext'
import { StarRating, StarDisplay } from '../components/StarRating'
import MovieCard from '../components/MovieCard'
import toast from 'react-hot-toast'
import {
    FiArrowLeft, FiEdit2, FiTrash2, FiStar, FiCalendar,
    FiTag, FiUser, FiClock, FiPlusCircle, FiAlertCircle
} from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function MovieDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, isAuthenticated, isAdmin } = useAuth()

    const [movie, setMovie] = useState(null)
    const [reviews, setReviews] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    const [reviewsLoading, setReviewsLoading] = useState(true)

    const [showReviewForm, setShowReviewForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [editingReview, setEditingReview] = useState(null)

    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '', spoiler: false })
    const [editForm, setEditForm] = useState({ fieldName: '', newValue: '', reason: '' })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchMovie()
        fetchReviews()
        fetchRecommendations()
    }, [id])

    const fetchMovie = async () => {
        try {
            const { data } = await movieService.getById(id)
            setMovie(data.data)
        } catch {
            toast.error('Movie not found')
            navigate('/movies')
        } finally {
            setLoading(false)
        }
    }

    const fetchReviews = async () => {
        setReviewsLoading(true)
        try {
            const { data } = await reviewService.getByMovie(id, { page: 0, size: 20 })
            setReviews(data.data?.content || [])
        } finally {
            setReviewsLoading(false)
        }
    }

    const fetchRecommendations = async () => {
        try {
            const { data } = await movieService.getRecommendations(id)
            setRecommendations(data.data || [])
        } catch { }
    }

    const handleDeleteMovie = async () => {
        if (!window.confirm('Are you sure you want to delete this movie?')) return
        try {
            await movieService.delete(id)
            toast.success('Movie deleted')
            navigate('/movies')
        } catch {
            toast.error('Failed to delete movie')
        }
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (!reviewForm.rating) return toast.error('Please select a rating')
        setSubmitting(true)
        try {
            if (editingReview) {
                await reviewService.update(editingReview.id, reviewForm)
                toast.success('Review updated!')
            } else {
                await reviewService.add(id, reviewForm)
                toast.success('Review submitted!')
            }
            setShowReviewForm(false)
            setEditingReview(null)
            setReviewForm({ rating: 0, comment: '', spoiler: false })
            await fetchMovie()
            await fetchReviews()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Delete your review?')) return
        try {
            await reviewService.delete(reviewId)
            toast.success('Review deleted')
            await fetchMovie()
            await fetchReviews()
        } catch {
            toast.error('Failed to delete review')
        }
    }

    const handleEditReview = (review) => {
        setEditingReview(review)
        setReviewForm({ rating: review.rating, comment: review.comment || '', spoiler: review.spoiler })
        setShowReviewForm(true)
        setShowEditForm(false)
    }

    const handleSubmitEdit = async (e) => {
        e.preventDefault()
        if (!editForm.fieldName || !editForm.newValue) return toast.error('Field name and new value are required')
        setSubmitting(true)
        try {
            await editService.submit({ movieId: parseInt(id), ...editForm })
            toast.success('Edit suggestion submitted! Pending admin review.')
            setShowEditForm(false)
            setEditForm({ fieldName: '', newValue: '', reason: '' })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit edit')
        } finally {
            setSubmitting(false)
        }
    }

    const myReview = reviews.find(r => r.username === user?.username)

    if (loading) {
        return (
            <div className="loading-page">
                <div className="spinner" />
            </div>
        )
    }

    if (!movie) return null

    return (
        <div className="movie-detail animate-fadeIn">
            <div className="container">
                {/* Back */}
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back
                </button>

                {/* Movie Header */}
                <div className="movie-hero">
                    <div className="movie-poster-large">
                        {movie.posterUrl ? (
                            <img src={movie.posterUrl} alt={movie.title} />
                        ) : (
                            <div className="poster-fallback">
                                <FiStar style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.2)' }} />
                            </div>
                        )}
                    </div>

                    <div className="movie-info">
                        <div className="genre-badge badge badge-primary">{movie.genre}</div>
                        <h1 className="movie-title font-serif">{movie.title}</h1>

                        <div className="movie-meta-row">
                            <span className="meta-item"><FiCalendar /> {movie.releaseYear}</span>
                            <span className="meta-item"><FiUser /> {movie.director}</span>
                            {movie.durationMinutes && (
                                <span className="meta-item"><FiClock /> {movie.durationMinutes} min</span>
                            )}
                            {movie.language && (
                                <span className="meta-item"><FiTag /> {movie.language}</span>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="rating-section">
                            <div className="big-rating">
                                <span className="rating-number">{movie.averageRating > 0 ? movie.averageRating.toFixed(1) : 'No ratings'}</span>
                                {movie.averageRating > 0 && <span style={{ color: 'var(--accent-gold)', fontSize: '1.5rem' }}>★</span>}
                            </div>
                            {movie.averageRating > 0 && (
                                <div>
                                    <StarDisplay rating={movie.averageRating} />
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                                        Based on {movie.totalReviews} review{movie.totalReviews !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            )}
                        </div>

                        {movie.description && (
                            <p className="movie-description">{movie.description}</p>
                        )}

                        {/* Actions */}
                        <div className="movie-actions">
                            {isAuthenticated && !myReview && (
                                <button className="btn btn-primary" onClick={() => { setShowReviewForm(true); setEditingReview(null); setReviewForm({ rating: 0, comment: '', spoiler: false }) }}>
                                    <FiStar /> Write Review
                                </button>
                            )}
                            {isAuthenticated && (
                                <button className="btn btn-secondary" onClick={() => setShowEditForm(true)}>
                                    <FiEdit2 /> Suggest Edit
                                </button>
                            )}
                            {isAdmin && (
                                <button className="btn btn-danger" onClick={handleDeleteMovie}>
                                    <FiTrash2 /> Delete Movie
                                </button>
                            )}
                            {isAdmin && (
                                <Link to={`/movies/${id}/edit`} className="btn btn-secondary">
                                    <FiEdit2 /> Edit Movie
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Review Form Modal */}
                {showReviewForm && (
                    <div className="modal-overlay" onClick={() => setShowReviewForm(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">{editingReview ? 'Update Review' : 'Write a Review'}</h2>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowReviewForm(false)}>✕</button>
                            </div>
                            <form onSubmit={handleSubmitReview}>
                                <div className="form-group">
                                    <label className="form-label">Your Rating *</label>
                                    <StarRating value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} size="2rem" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Comment</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Share your thoughts..."
                                        rows={4}
                                        value={reviewForm.comment}
                                        onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        id="spoiler"
                                        checked={reviewForm.spoiler}
                                        onChange={e => setReviewForm(f => ({ ...f, spoiler: e.target.checked }))}
                                        style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                                    />
                                    <label htmlFor="spoiler" className="form-label" style={{ margin: 0 }}>Contains spoilers</label>
                                </div>
                                <div className="flex gap-3" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowReviewForm(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={submitting || !reviewForm.rating}>
                                        {submitting ? 'Submitting...' : editingReview ? 'Update' : 'Submit Review'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Suggestion Modal */}
                {showEditForm && (
                    <div className="modal-overlay" onClick={() => setShowEditForm(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Suggest an Edit</h2>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowEditForm(false)}>✕</button>
                            </div>
                            <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
                                <FiAlertCircle style={{ verticalAlign: 'middle' }} /> Your suggestion will be reviewed by admins before being applied.
                            </div>
                            <form onSubmit={handleSubmitEdit}>
                                <div className="form-group">
                                    <label className="form-label">Field to Edit *</label>
                                    <select
                                        className="form-control"
                                        value={editForm.fieldName}
                                        onChange={e => setEditForm(f => ({ ...f, fieldName: e.target.value }))}
                                        required
                                    >
                                        <option value="">Select a field...</option>
                                        <option value="title">Title</option>
                                        <option value="description">Description</option>
                                        <option value="releaseYear">Release Year</option>
                                        <option value="genre">Genre</option>
                                        <option value="director">Director</option>
                                        <option value="language">Language</option>
                                        <option value="durationMinutes">Duration (minutes)</option>
                                        <option value="posterUrl">Poster URL</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">New Value *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter the corrected value..."
                                        value={editForm.newValue}
                                        onChange={e => setEditForm(f => ({ ...f, newValue: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Reason</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Why should this be changed?"
                                        rows={3}
                                        value={editForm.reason}
                                        onChange={e => setEditForm(f => ({ ...f, reason: e.target.value }))}
                                    />
                                </div>
                                <div className="flex gap-3" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditForm(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        {submitting ? 'Submitting...' : 'Submit Suggestion'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2 className="section-heading">Reviews ({movie.totalReviews})</h2>
                    <div className="divider" />

                    {myReview && !showReviewForm && (
                        <div className="card my-review-card">
                            <div className="review-own-badge">Your Review</div>
                            <div className="review-header">
                                <div className="reviewer-avatar">{myReview.username.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div className="reviewer-name">{myReview.username}</div>
                                    <StarDisplay rating={myReview.rating} />
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleEditReview(myReview)}>
                                        <FiEdit2 /> Edit
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(myReview.id)}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                            {myReview.comment && <p className="review-comment">{myReview.comment}</p>}
                        </div>
                    )}

                    {reviewsLoading ? (
                        <div className="flex gap-3 flex-col" style={{ marginTop: '1rem' }}>
                            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} />)}
                        </div>
                    ) : reviews.filter(r => r.username !== user?.username).length === 0 ? (
                        <div className="empty-state" style={{ padding: '3rem 0' }}>
                            <div className="empty-state-icon">💬</div>
                            <div className="empty-state-title">No reviews yet</div>
                            <div className="empty-state-desc">Be the first to review this movie!</div>
                            {isAuthenticated && !myReview && (
                                <button className="btn btn-primary mt-4" onClick={() => setShowReviewForm(true)}>
                                    <FiPlusCircle /> Write Review
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="reviews-list">
                            {reviews
                                .filter(r => r.username !== user?.username)
                                .map(review => (
                                    <div key={review.id} className="card review-card">
                                        <div className="review-header">
                                            <div className="reviewer-avatar">{review.username.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <div className="reviewer-name">{review.username}</div>
                                                <StarDisplay rating={review.rating} />
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <span className="review-date text-muted text-sm">
                                                    {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : ''}
                                                </span>
                                            </div>
                                        </div>
                                        {review.spoiler && (
                                            <div className="badge badge-red" style={{ marginBottom: '0.5rem' }}>⚠️ Spoiler</div>
                                        )}
                                        {review.comment && <p className="review-comment">{review.comment}</p>}
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div className="recommendations-section">
                        <h2 className="section-heading">You Might Also Like</h2>
                        <div className="divider" />
                        <div className="movies-grid">
                            {recommendations.map(m => <MovieCard key={m.id} movie={m} />)}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .movie-detail { padding: 2rem 0 4rem; }
        .back-btn { display: flex; align-items: center; gap: 0.5rem; background: transparent; border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-secondary); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem; margin-bottom: 2rem; transition: all var(--transition-fast); }
        .back-btn:hover { color: var(--text-primary); border-color: var(--border-hover); }
        .movie-hero { display: grid; grid-template-columns: 280px 1fr; gap: 2.5rem; margin-bottom: 3rem; }
        .movie-poster-large { border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 2/3; background: var(--bg-card); box-shadow: var(--shadow-lg); }
        .movie-poster-large img { width: 100%; height: 100%; object-fit: cover; }
        .poster-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a3e, #2d1b69); }
        .movie-info { display: flex; flex-direction: column; gap: 1rem; }
        .genre-badge { align-self: flex-start; }
        .movie-title { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; line-height: 1.1; }
        .movie-meta-row { display: flex; flex-wrap: wrap; gap: 1rem; }
        .meta-item { display: flex; align-items: center; gap: 0.375rem; color: var(--text-muted); font-size: 0.875rem; }
        .rating-section { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px solid var(--border-color); width: fit-content; }
        .big-rating { display: flex; align-items: center; gap: 0.25rem; }
        .rating-number { font-size: 2.5rem; font-weight: 800; color: var(--text-primary); line-height: 1; }
        .movie-description { color: var(--text-secondary); line-height: 1.75; font-size: 0.95rem; max-width: 600px; }
        .movie-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .reviews-section { margin-bottom: 3rem; }
        .recommendations-section { margin-bottom: 2rem; }
        .section-heading { font-size: 1.375rem; font-weight: 700; margin-bottom: 1rem; }
        .reviews-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
        .review-card { }
        .my-review-card { border-color: rgba(108,99,255,0.3); background: rgba(108,99,255,0.05); position: relative; margin-bottom: 1rem; }
        .review-own-badge { position: absolute; top: -10px; left: 1rem; background: var(--accent-primary); color: white; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: var(--radius-full); }
        .review-header { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 0.5rem; }
        .reviewer-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 700; color: white; flex-shrink: 0; }
        .reviewer-name { font-weight: 600; font-size: 0.9rem; margin-bottom: 2px; }
        .review-comment { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin-top: 0.5rem; }
        @media (max-width: 768px) {
          .movie-hero { grid-template-columns: 1fr; }
          .movie-poster-large { max-width: 280px; margin: 0 auto; }
        }
      `}</style>
        </div>
    )
}
