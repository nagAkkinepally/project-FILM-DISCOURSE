import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiFilm, FiMenu, FiX, FiHome, FiSearch, FiStar, FiUser, FiLogOut, FiShield, FiPlusCircle } from 'react-icons/fi'
import './Navbar.css'

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/')
        setMenuOpen(false)
    }

    const closeMenu = () => setMenuOpen(false)

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                {/* Logo */}
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <FiFilm className="logo-icon" />
                    <span className="logo-text">Film<span className="logo-accent">Discourse</span></span>
                </Link>

                {/* Desktop Nav */}
                <div className="navbar-links">
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                        <FiHome /> Home
                    </NavLink>
                    <NavLink to="/movies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <FiSearch /> Movies
                    </NavLink>
                    <NavLink to="/movies/top-rated" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <FiStar /> Top Rated
                    </NavLink>
                    {isAuthenticated && (
                        <NavLink to="/movies/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FiPlusCircle /> Add Movie
                        </NavLink>
                    )}
                    {isAdmin && (
                        <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FiShield /> Admin
                        </NavLink>
                    )}
                </div>

                {/* Auth Section */}
                <div className="navbar-auth">
                    {isAuthenticated ? (
                        <div className="user-menu" onMouseLeave={() => setDropdownOpen(false)}>
                            <button
                                className="user-avatar"
                                onMouseEnter={() => setDropdownOpen(true)}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <div className="avatar-circle">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <span className="username-text">{user?.username}</span>
                            </button>
                            {dropdownOpen && (
                                <div className="user-dropdown">
                                    <div className="dropdown-header">
                                        <div className="dropdown-name">{user?.username}</div>
                                        <div className="dropdown-email">{user?.email}</div>
                                    </div>
                                    <div className="dropdown-divider" />
                                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        <FiUser /> Profile
                                    </Link>
                                    {isAdmin && (
                                        <Link to="/admin" className="dropdown-item admin" onClick={() => setDropdownOpen(false)}>
                                            <FiShield /> Admin Dashboard
                                        </Link>
                                    )}
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item danger" onClick={handleLogout}>
                                        <FiLogOut /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-menu">
                    <NavLink to="/" className="mobile-link" onClick={closeMenu} end>Home</NavLink>
                    <NavLink to="/movies" className="mobile-link" onClick={closeMenu}>Movies</NavLink>
                    <NavLink to="/movies/top-rated" className="mobile-link" onClick={closeMenu}>Top Rated</NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink to="/movies/add" className="mobile-link" onClick={closeMenu}>Add Movie</NavLink>
                            <NavLink to="/profile" className="mobile-link" onClick={closeMenu}>Profile</NavLink>
                        </>
                    )}
                    {isAdmin && (
                        <NavLink to="/admin" className="mobile-link" onClick={closeMenu}>Admin</NavLink>
                    )}
                    {isAuthenticated ? (
                        <button className="mobile-link danger" onClick={handleLogout}>Sign Out</button>
                    ) : (
                        <>
                            <Link to="/login" className="mobile-link" onClick={closeMenu}>Sign In</Link>
                            <Link to="/register" className="mobile-link" onClick={closeMenu}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}
