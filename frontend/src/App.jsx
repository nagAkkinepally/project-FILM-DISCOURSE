import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MoviesPage from './pages/MoviesPage'
import MovieDetailPage from './pages/MovieDetailPage'
import AddMoviePage from './pages/AddMoviePage'
import TopRatedPage from './pages/TopRatedPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <main style={{ flex: 1 }}>
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/movies" element={<MoviesPage />} />
                        <Route path="/movies/top-rated" element={<TopRatedPage />} />
                        <Route path="/movies/:id" element={<MovieDetailPage />} />

                        {/* Protected */}
                        <Route path="/movies/add" element={
                            <ProtectedRoute><AddMoviePage /></ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute><ProfilePage /></ProtectedRoute>
                        } />

                        {/* Admin Only */}
                        <Route path="/admin" element={
                            <ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>
                        } />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </AuthProvider>
    )
}
