import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { movieService } from '../services'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiFilm } from 'react-icons/fi'

const GENRES = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Fantasy', 'Horror', 'Musical',
    'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western'
]

export default function AddMoviePage() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({
        title: '', description: '', releaseYear: '', genre: '',
        director: '', posterUrl: '', trailerUrl: '', language: '', durationMinutes: ''
    })

    if (!isAuthenticated) {
        navigate('/login')
        return null
    }

    const validate = () => {
        const errs = {}
        if (!form.title.trim()) errs.title = 'Title is required'
        if (!form.releaseYear) errs.releaseYear = 'Release year is required'
        else if (form.releaseYear < 1888 || form.releaseYear > 2100) errs.releaseYear = 'Invalid year'
        if (!form.genre) errs.genre = 'Genre is required'
        if (!form.director.trim()) errs.director = 'Director is required'
        return errs
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
        if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) { setErrors(errs); return }

        setLoading(true)
        try {
            const payload = {
                ...form,
                releaseYear: parseInt(form.releaseYear),
                durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes) : undefined,
            }
            const { data } = await movieService.create(payload)
            toast.success('Movie added successfully!')
            navigate(`/movies/${data.data.id}`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add movie')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="add-movie-page animate-fadeIn">
            <div className="container" style={{ maxWidth: '720px' }}>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back
                </button>

                <div className="card" style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiFilm style={{ color: 'var(--accent-primary)' }} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Add a Movie</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Contribute to the Film Discourse database</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid-cols-2 grid gap-4">
                            <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                <label className="form-label">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="Movie title"
                                    value={form.title}
                                    onChange={handleChange}
                                />
                                {errors.title && <div className="form-error">{errors.title}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Genre *</label>
                                <select name="genre" className="form-control" value={form.genre} onChange={handleChange}>
                                    <option value="">Select Genre</option>
                                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                                {errors.genre && <div className="form-error">{errors.genre}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Release Year *</label>
                                <input
                                    type="number"
                                    name="releaseYear"
                                    className="form-control"
                                    placeholder="e.g. 2024"
                                    value={form.releaseYear}
                                    onChange={handleChange}
                                    min={1888}
                                    max={2100}
                                />
                                {errors.releaseYear && <div className="form-error">{errors.releaseYear}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Director *</label>
                                <input
                                    type="text"
                                    name="director"
                                    className="form-control"
                                    placeholder="Director name"
                                    value={form.director}
                                    onChange={handleChange}
                                />
                                {errors.director && <div className="form-error">{errors.director}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Language</label>
                                <input
                                    type="text"
                                    name="language"
                                    className="form-control"
                                    placeholder="e.g. English"
                                    value={form.language}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    placeholder="Brief description of the movie..."
                                    rows={4}
                                    value={form.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Poster URL</label>
                                <input
                                    type="url"
                                    name="posterUrl"
                                    className="form-control"
                                    placeholder="https://..."
                                    value={form.posterUrl}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Duration (minutes)</label>
                                <input
                                    type="number"
                                    name="durationMinutes"
                                    className="form-control"
                                    placeholder="e.g. 120"
                                    value={form.durationMinutes}
                                    onChange={handleChange}
                                    min={1}
                                    max={1440}
                                />
                            </div>

                            <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                <label className="form-label">Trailer URL</label>
                                <input
                                    type="url"
                                    name="trailerUrl"
                                    className="form-control"
                                    placeholder="https://youtube.com/..."
                                    value={form.trailerUrl}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3" style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <Link to="/movies" className="btn btn-secondary">Cancel</Link>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Movie'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
        .add-movie-page { padding: 2rem 0 4rem; }
        .back-btn { display: flex; align-items: center; gap: 0.5rem; background: transparent; border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-secondary); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem; transition: all var(--transition-fast); }
        .back-btn:hover { color: var(--text-primary); border-color: var(--border-hover); }
        @media (max-width: 600px) { .grid-cols-2.grid { grid-template-columns: 1fr; } .form-group[style*="1/-1"] { grid-column: 1; } }
      `}</style>
        </div>
    )
}
