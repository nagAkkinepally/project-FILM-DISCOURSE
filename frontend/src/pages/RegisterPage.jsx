import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiFilm, FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi'

export default function RegisterPage() {
    const navigate = useNavigate()
    const { register } = useAuth()
    const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const getPasswordStrength = (pass) => {
        if (!pass) return { strength: 0, label: '' }
        let score = 0
        if (pass.length >= 8) score++
        if (/[A-Z]/.test(pass)) score++
        if (/[a-z]/.test(pass)) score++
        if (/\d/.test(pass)) score++
        if (/[!@#$%^&*]/.test(pass)) score++
        const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
        const colors = ['', '#ef4444', '#f97316', '#eab308', '#10b981', '#6c63ff']
        return { strength: score, label: labels[score], color: colors[score] }
    }

    const pwStrength = getPasswordStrength(form.password)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        const result = await register(form)
        if (result.success) {
            setSuccess(true)
            toast.success('Account created successfully!')
            setTimeout(() => navigate('/login'), 2000)
        } else {
            setError(result.error)
        }
        setLoading(false)
    }

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <FiCheckCircle style={{ fontSize: '4rem', color: 'var(--accent-green)', marginBottom: '1rem' }} />
                    <h2 style={{ marginBottom: '0.5rem' }}>Account Created!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Welcome to Film Discourse. Redirecting to login...
                    </p>
                    <Link to="/login" className="btn btn-primary">Go to Login</Link>
                </div>
                <style>{authPageStyles}</style>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <FiFilm />
                    <span>Film<span className="accent">Discourse</span></span>
                </div>
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join the Film Discourse community</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="input-wrapper">
                            <FiUser className="input-icon" />
                            <input
                                type="text"
                                className="form-control input-with-icon"
                                placeholder="Your full name"
                                value={form.fullName}
                                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Username *</label>
                        <div className="input-wrapper">
                            <FiUser className="input-icon" />
                            <input
                                type="text"
                                className="form-control input-with-icon"
                                placeholder="Choose a username"
                                value={form.username}
                                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                required
                                minLength={3}
                                maxLength={50}
                                pattern="^[a-zA-Z0-9_]+$"
                                title="Username can only contain letters, numbers, and underscores"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email *</label>
                        <div className="input-wrapper">
                            <FiMail className="input-icon" />
                            <input
                                type="email"
                                className="form-control input-with-icon"
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password *</label>
                        <div className="input-wrapper">
                            <FiLock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control input-with-icon input-with-action"
                                placeholder="Min 8 chars, uppercase, number"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                required
                                minLength={8}
                            />
                            <button type="button" className="input-action" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        {form.password && (
                            <div className="password-strength">
                                <div className="strength-bars">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div
                                            key={i}
                                            className="strength-bar"
                                            style={{ background: i <= pwStrength.strength ? pwStrength.color : 'var(--border-color)' }}
                                        />
                                    ))}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: pwStrength.color }}>{pwStrength.label}</span>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} style={{ marginTop: '0.5rem' }}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
            <style>{authPageStyles}</style>
        </div>
    )
}

const authPageStyles = `
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
  .auth-logo { display: flex; align-items: center; gap: 0.5rem; font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem; }
  .auth-logo svg { color: var(--accent-primary); font-size: 1.5rem; }
  .accent { color: var(--accent-primary); }
  .auth-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
  .auth-subtitle { color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem; }
  .auth-form { display: flex; flex-direction: column; gap: 0.25rem; }
  .input-wrapper { position: relative; }
  .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 1rem; pointer-events: none; }
  .input-with-icon { padding-left: 2.75rem; }
  .input-with-action { padding-right: 2.75rem; }
  .input-action { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; display: flex; border-radius: 4px; transition: color var(--transition-fast); }
  .input-action:hover { color: var(--text-primary); }
  .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted); }
  .auth-link { color: var(--accent-primary); font-weight: 600; }
  .auth-link:hover { color: var(--accent-secondary); }
  .password-strength { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
  .strength-bars { display: flex; gap: 3px; flex: 1; }
  .strength-bar { flex: 1; height: 3px; border-radius: 9999px; transition: background 0.2s; }
`
