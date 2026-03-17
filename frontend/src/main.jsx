import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#16161e',
                    color: '#f1f1f5',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                },
                success: {
                    iconTheme: { primary: '#10b981', secondary: '#16161e' },
                },
                error: {
                    iconTheme: { primary: '#ef4444', secondary: '#16161e' },
                },
            }}
        />
    </React.StrictMode>,
)
