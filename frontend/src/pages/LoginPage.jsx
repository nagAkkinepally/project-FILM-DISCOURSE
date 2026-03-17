import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiFilm, FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi'

export default function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [form, setForm] = useState({ username: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        const result = await login(form)
        if (result.success) {
            toast.success('Welcome back!')
            navigate('/')
        } else {
            setError(result.error)
        }
        setLoading(false)
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <FiFilm />
                    <span>Film<span className="accent">Discourse</span></span>
                </div>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to your account to continue</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div className="input-wrapper">
                            <FiUser className="input-icon" />
                            <input
                                type="text"
                                className="form-control input-with-icon"
                                placeholder="Enter your username"
                                value={form.username}
                                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <FiLock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control input-with-icon input-with-action"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                required
                            />
                            <button
                                type="button"
                                className="input-action"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
                </div>

                <div className="demo-credentials">
                    <div className="demo-title">Demo Credentials</div>
                    <div className="demo-item">
                        <span className="badge badge-gold">Admin</span>
                        <code>admin / Admin@1234</code>
                    </div>
                </div>
            </div>

            <style>{`
        .auth-page {
          min-height: calc(100vh - 64px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: radial-gradient(ellipse 60% 60% at 50% 0%, rgba(108,99,255,0.1) 0%, transparent 60%);
        }
        .auth-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          width: 100%;
          max-width: 440px;
          animation: slideUp 0.3s ease;
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }
        .auth-logo svg { color: var(--accent-primary); font-size: 1.5rem; }
        .accent { color: var(--accent-primary); }
        .auth-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
        .auth-subtitle { color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem; }
        .auth-form { display: flex; flex-direction: column; gap: 0.25rem; }
        .input-wrapper { position: relative; }
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 1rem;
          pointer-events: none;
        }
        .input-with-icon { padding-left: 2.75rem; }
        .input-with-action { padding-right: 2.75rem; }
        .input-action {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          border-radius: 4px;
          transition: color var(--transition-fast);
        }
        .input-action:hover { color: var(--text-primary); }
        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .auth-link { color: var(--accent-primary); font-weight: 600; }
        .auth-link:hover { color: var(--accent-secondary); }
        .demo-credentials {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-md);
        }
        .demo-title { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .demo-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; color: var(--text-secondary); }
        .demo-item code { font-family: monospace; color: var(--text-primary); }
      `}</style>
        </div>
    )
}
