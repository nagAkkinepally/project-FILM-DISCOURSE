import { useState, useEffect } from 'react'
import { editService } from '../services'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiShield, FiCheck, FiX, FiClock } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function AdminPage() {
    const { isAdmin } = useAuth()
    const navigate = useNavigate()
    const [edits, setEdits] = useState([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState({})
    const [reviewComment, setReviewComment] = useState({})

    useEffect(() => {
        if (!isAdmin) { navigate('/'); return }
        fetchPendingEdits()
    }, [isAdmin])

    const fetchPendingEdits = async () => {
        setLoading(true)
        try {
            const { data } = await editService.getPending({ page: 0, size: 50 })
            setEdits(data.data?.content || [])
        } finally {
            setLoading(false)
        }
    }

    const handleReview = async (editId, status) => {
        setProcessing(p => ({ ...p, [editId]: true }))
        try {
            await editService.review(editId, { status, reviewComment: reviewComment[editId] || '' })
            toast.success(`Edit ${status.toLowerCase()} successfully!`)
            setEdits(e => e.filter(edit => edit.id !== editId))
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${status.toLowerCase()} edit`)
        } finally {
            setProcessing(p => ({ ...p, [editId]: false }))
        }
    }

    if (!isAdmin) return null

    return (
        <div className="admin-page animate-fadeIn">
            <div className="container">
                <div className="admin-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="admin-icon"><FiShield /></div>
                        <div>
                            <h1 className="page-title">Admin Dashboard</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage pending edit suggestions</p>
                        </div>
                    </div>
                    <div className="badge badge-primary" style={{ fontSize: '0.875rem', padding: '0.4rem 0.875rem' }}>
                        <FiClock /> {edits.length} Pending
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: '160px', borderRadius: 'var(--radius-lg)' }} />
                        ))}
                    </div>
                ) : edits.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">✅</div>
                        <div className="empty-state-title">All caught up!</div>
                        <div className="empty-state-desc">No pending edit suggestions at this time.</div>
                    </div>
                ) : (
                    <div className="edits-list">
                        {edits.map(edit => (
                            <div key={edit.id} className="card edit-card">
                                <div className="edit-header">
                                    <div>
                                        <h3 className="edit-movie">{edit.movieTitle}</h3>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            Submitted by <strong style={{ color: 'var(--text-secondary)' }}>{edit.submittedByUsername}</strong>
                                            {edit.submittedAt && ` · ${formatDistanceToNow(new Date(edit.submittedAt), { addSuffix: true })}`}
                                        </div>
                                    </div>
                                    <span className="badge badge-gold">{edit.fieldName}</span>
                                </div>

                                <div className="edit-diff">
                                    {edit.oldValue && (
                                        <div className="diff-item old">
                                            <span className="diff-label">Current</span>
                                            <span className="diff-value">{edit.oldValue}</span>
                                        </div>
                                    )}
                                    <div className="diff-item new">
                                        <span className="diff-label">Proposed</span>
                                        <span className="diff-value">{edit.newValue}</span>
                                    </div>
                                </div>

                                {edit.reason && (
                                    <div className="edit-reason">
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Reason: </span>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{edit.reason}</span>
                                    </div>
                                )}

                                <div className="edit-actions">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Admin comment (optional)..."
                                        value={reviewComment[edit.id] || ''}
                                        onChange={e => setReviewComment(c => ({ ...c, [edit.id]: e.target.value }))}
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        className="btn btn-secondary"
                                        style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.3)' }}
                                        onClick={() => handleReview(edit.id, 'REJECTED')}
                                        disabled={processing[edit.id]}
                                    >
                                        <FiX /> Reject
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        style={{ background: 'rgba(16,185,129,0.8)' }}
                                        onClick={() => handleReview(edit.id, 'APPROVED')}
                                        disabled={processing[edit.id]}
                                    >
                                        <FiCheck /> Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        .admin-page { padding: 2rem 0 4rem; }
        .admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .page-title { font-size: 1.75rem; font-weight: 800; }
        .admin-icon { width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(108,99,255,0.2); display: flex; align-items: center; justify-content: center; color: var(--accent-primary); font-size: 1.25rem; }
        .edits-list { display: flex; flex-direction: column; gap: 1rem; }
        .edit-card { }
        .edit-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem; gap: 1rem; }
        .edit-movie { font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem; }
        .edit-diff { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem; }
        .diff-item { padding: 0.75rem; border-radius: var(--radius-md); }
        .diff-item.old { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); }
        .diff-item.new { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); }
        .diff-label { display: block; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.25rem; }
        .diff-value { font-size: 0.875rem; color: var(--text-primary); word-break: break-all; }
        .edit-reason { margin-bottom: 0.75rem; }
        .edit-actions { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
        @media (max-width: 600px) {
          .edit-diff { grid-template-columns: 1fr; }
          .edit-actions { flex-direction: column; }
        }
      `}</style>
        </div>
    )
}
