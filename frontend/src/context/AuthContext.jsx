import { createContext, useContext, useState, useCallback } from 'react'
import { authService } from '../services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user')
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    })

    const [loading, setLoading] = useState(false)

    const login = useCallback(async (credentials) => {
        setLoading(true)
        try {
            const { data } = await authService.login(credentials)
            const { accessToken, refreshToken, ...userInfo } = data.data
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('user', JSON.stringify(userInfo))
            setUser(userInfo)
            return { success: true }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Login failed' }
        } finally {
            setLoading(false)
        }
    }, [])

    const register = useCallback(async (userData) => {
        setLoading(true)
        try {
            const { data } = await authService.register(userData)
            return { success: true, data: data.data }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Registration failed' }
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        setUser(null)
    }, [])

    const isAdmin = user?.roles?.includes('ROLE_ADMIN')
    const isAuthenticated = !!user

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, isAdmin, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
