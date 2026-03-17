export function StarRating({ value, onChange, size = '1.5rem' }) {
    return (
        <div className="star-rating-interactive" style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange && onChange(star)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: onChange ? 'pointer' : 'default',
                        fontSize: size,
                        color: star <= value ? 'var(--accent-gold)' : 'var(--text-muted)',
                        padding: '2px',
                        transition: 'color 0.15s ease, transform 0.1s ease',
                        lineHeight: 1,
                    }}
                    onMouseEnter={(e) => {
                        if (onChange) e.target.style.transform = 'scale(1.15)'
                    }}
                    onMouseLeave={(e) => {
                        if (onChange) e.target.style.transform = 'scale(1)'
                    }}
                >
                    ★
                </button>
            ))}
        </div>
    )
}

export function StarDisplay({ rating, showNumber = false }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    style={{
                        fontSize: '0.9rem',
                        color: star <= Math.round(rating) ? 'var(--accent-gold)' : 'var(--text-muted)',
                    }}
                >★</span>
            ))}
            {showNumber && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    )
}
