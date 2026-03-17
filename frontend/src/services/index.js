import api from './api'

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/me'),
}

export const movieService = {
    getAll: (params) => api.get('/movies', { params }),
    getById: (id) => api.get(`/movies/${id}`),
    create: (data) => api.post('/movies', data),
    update: (id, data) => api.put(`/movies/${id}`, data),
    delete: (id) => api.delete(`/movies/${id}`),
    search: (params) => api.get('/movies/search', { params }),
    getGenres: () => api.get('/movies/genres'),
    getTopRated: (params) => api.get('/movies/top-rated', { params }),
    getRecommendations: (id) => api.get(`/movies/${id}/recommendations`),
}

export const reviewService = {
    getByMovie: (movieId, params) => api.get(`/reviews/movies/${movieId}`, { params }),
    getByUser: (userId, params) => api.get(`/reviews/users/${userId}`, { params }),
    add: (movieId, data) => api.post(`/reviews/movies/${movieId}`, data),
    update: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
    delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
}

export const editService = {
    submit: (data) => api.post('/edits', data),
    getByMovie: (movieId, params) => api.get(`/edits/movies/${movieId}`, { params }),
    getPending: (params) => api.get('/edits/pending', { params }),
    review: (editId, data) => api.patch(`/edits/${editId}/review`, data),
}
