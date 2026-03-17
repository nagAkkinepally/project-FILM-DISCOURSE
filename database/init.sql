-- Film Discourse - Database Initialization Script
-- PostgreSQL 15+

-- Create database (run manually if needed)
-- CREATE DATABASE filmdiscourse;

-- ============================================================
-- ROLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);

-- ============================================================
-- USER_ROLES JOIN TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- ============================================================
-- MOVIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS movies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    release_year INTEGER NOT NULL,
    genre VARCHAR(50) NOT NULL,
    director VARCHAR(100) NOT NULL,
    average_rating DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    total_reviews INTEGER NOT NULL DEFAULT 0,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    language VARCHAR(100),
    duration_minutes INTEGER,
    created_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_movie_title ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movie_genre ON movies(genre);
CREATE INDEX IF NOT EXISTS idx_movie_release_year ON movies(release_year);
CREATE INDEX IF NOT EXISTS idx_movie_rating ON movies(average_rating);

-- ============================================================
-- REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_spoiler BOOLEAN NOT NULL DEFAULT FALSE,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT uk_review_user_movie UNIQUE (user_id, movie_id)
);

CREATE INDEX IF NOT EXISTS idx_review_movie_id ON reviews(movie_id);
CREATE INDEX IF NOT EXISTS idx_review_user_id ON reviews(user_id);

-- ============================================================
-- EDIT_HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS edit_history (
    id BIGSERIAL PRIMARY KEY,
    movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    submitted_by_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    field_name VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    review_comment VARCHAR(500),
    reviewed_at TIMESTAMP,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_edit_movie_id ON edit_history(movie_id);
CREATE INDEX IF NOT EXISTS idx_edit_status ON edit_history(status);
CREATE INDEX IF NOT EXISTS idx_edit_submitted_by ON edit_history(submitted_by_id);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Insert roles
INSERT INTO roles (name) VALUES
    ('ROLE_USER'),
    ('ROLE_ADMIN'),
    ('ROLE_MODERATOR')
ON CONFLICT (name) DO NOTHING;

-- Insert admin user (password: Admin@1234 - BCrypt encoded)
INSERT INTO users (username, email, password, full_name, is_active, created_at)
VALUES (
    'admin',
    'admin@filmdiscourse.com',
    '$2a$12$LcTCQKrTSNXOYT2.oCJ5ouG/bUkIy78mvEJAjlYHaTLJVpV6J0/3m',
    'System Administrator',
    TRUE,
    CURRENT_TIMESTAMP
) ON CONFLICT (username) DO NOTHING;

-- Assign admin roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name IN ('ROLE_ADMIN', 'ROLE_USER')
ON CONFLICT DO NOTHING;

-- Sample Movies
INSERT INTO movies (title, description, release_year, genre, director, average_rating, total_reviews, language, duration_minutes, created_at)
VALUES
    ('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 2010, 'Sci-Fi', 'Christopher Nolan', 4.8, 2, 'English', 148, CURRENT_TIMESTAMP),
    ('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 2008, 'Action', 'Christopher Nolan', 4.9, 2, 'English', 152, CURRENT_TIMESTAMP),
    ('Parasite', 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', 2019, 'Thriller', 'Bong Joon-ho', 4.6, 1, 'Korean', 132, CURRENT_TIMESTAMP),
    ('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 2014, 'Sci-Fi', 'Christopher Nolan', 4.7, 1, 'English', 169, CURRENT_TIMESTAMP),
    ('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 'Crime', 'Francis Ford Coppola', 4.9, 1, 'English', 175, CURRENT_TIMESTAMP),
    ('Spirited Away', 'During her family''s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.', 2001, 'Animation', 'Hayao Miyazaki', 4.8, 1, 'Japanese', 125, CURRENT_TIMESTAMP);

-- Note: Admin user reviews are only inserted after seeding completes (done via application seeder)
