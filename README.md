# Film Discourse – Complete Setup Guide

> **A Decentralized Platform for Collaborative Movie Logging, Review, and Information Management**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17 + Spring Boot 3.2 |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Security | Spring Security + JWT |
| Frontend | React 18 + Vite |
| HTTP Client | Axios |
| Containerization | Docker + Docker Compose |

---

## 📁 Project Structure

```
FILMDISCOURSE/
├── backend/
│   ├── src/
│   │   ├── main/java/com/filmdiscourse/
│   │   │   ├── FilmDiscourseApplication.java
│   │   │   ├── config/          (SecurityConfig, SwaggerConfig, RedisConfig, RateLimitFilter)
│   │   │   ├── controller/      (AuthController, MovieController, ReviewController, EditHistoryController)
│   │   │   ├── dto/
│   │   │   │   ├── request/     (RegisterRequest, LoginRequest, MovieRequest, ReviewRequest...)
│   │   │   │   └── response/    (ApiResponse, AuthResponse, MovieResponse, UserResponse...)
│   │   │   ├── entity/          (User, Movie, Review, EditHistory, Role)
│   │   │   ├── exception/       (GlobalExceptionHandler + custom exceptions)
│   │   │   ├── repository/      (UserRepository, MovieRepository, ReviewRepository...)
│   │   │   ├── security/        (JwtTokenProvider, JwtAuthenticationFilter, UserDetailsServiceImpl)
│   │   │   └── service/         (AuthService, MovieService, ReviewService, EditHistoryService...)
│   │   ├── main/resources/
│   │   │   └── application.yml
│   │   └── test/
│   │       ├── java/com/filmdiscourse/service/  (AuthServiceTest, MovieServiceTest)
│   │       └── resources/application-test.yml
│   ├── pom.xml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/  (Navbar, Footer, MovieCard, StarRating, ProtectedRoute)
│   │   ├── context/     (AuthContext)
│   │   ├── pages/       (HomePage, MoviesPage, MovieDetailPage, LoginPage, RegisterPage...)
│   │   └── services/    (api.js, index.js)
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── nginx.conf
├── database/
│   └── init.sql
└── docker-compose.yml
```

---

## 🚀 Option 1: Run with Docker Compose (Recommended)

### Prerequisites
- Docker Desktop installed
- Docker Compose v2+

### Steps

```bash
# 1. Clone / navigate to project root
cd FILMDISCOURSE

# 2. Build and start all services
docker-compose up --build -d

# 3. Check service health
docker-compose ps

# 4. View backend logs
docker-compose logs -f backend
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **pgAdmin / DB**: localhost:5432 (user: postgres, pass: postgres, db: filmdiscourse)

---

## 🖥️ Option 2: Run Locally (Development)

### Prerequisites
- JDK 17+
- Maven 3.8+
- Node.js 20+
- PostgreSQL 15 running locally
- Redis running locally

### Backend Setup

```bash
# Navigate to backend
cd FILMDISCOURSE/backend

# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE filmdiscourse;"

# Run the SQL initialization script
psql -U postgres -d filmdiscourse -f ../database/init.sql

# Update application.yml if passwords differ from defaults
# spring.datasource.username / password

# Run the Spring Boot app
mvn spring-boot:run

# OR build and run JAR
mvn clean package -DskipTests
java -jar target/filmdiscourse-backend-1.0.0.jar
```

Backend starts at: **http://localhost:8080/api**

### Frontend Setup

```bash
# Navigate to frontend
cd FILMDISCOURSE/frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## 🔑 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin@1234` |

The admin user is created automatically on first startup.

---

## 📡 API Reference

### Authentication

```bash
# Register
POST /api/auth/register
Content-Type: application/json
{
  "username": "john",
  "email": "john@example.com",
  "password": "John@1234",
  "fullName": "John Doe"
}

# Login
POST /api/auth/login
{
  "username": "john",
  "password": "John@1234"
}
# Returns: { accessToken, refreshToken, userId, username, roles }

# Get current user profile
GET /api/auth/me
Authorization: Bearer <token>
```

### Movies

```bash
# Get all movies (paginated)
GET /api/movies?page=0&size=10&sort=createdAt,desc

# Search / Filter
GET /api/movies/search?title=inception&genre=Sci-Fi&releaseYear=2010&sort=averageRating,desc

# Get by ID
GET /api/movies/1

# Top-rated
GET /api/movies/top-rated?page=0&size=10

# All genres
GET /api/movies/genres

# Recommendations
GET /api/movies/1/recommendations

# Create (Authenticated)
POST /api/movies
Authorization: Bearer <token>
{
  "title": "Inception",
  "description": "...",
  "releaseYear": 2010,
  "genre": "Sci-Fi",
  "director": "Christopher Nolan",
  "language": "English",
  "durationMinutes": 148
}

# Update
PUT /api/movies/1
Authorization: Bearer <token>
{ ...same fields... }

# Delete (Admin only)
DELETE /api/movies/1
Authorization: Bearer <admin-token>
```

### Reviews

```bash
# Get reviews for a movie
GET /api/reviews/movies/1?page=0&size=10

# Add review
POST /api/reviews/movies/1
Authorization: Bearer <token>
{
  "rating": 5,
  "comment": "Masterpiece!",
  "spoiler": false
}

# Update review
PUT /api/reviews/1
Authorization: Bearer <token>
{ "rating": 4, "comment": "Updated comment" }

# Delete review
DELETE /api/reviews/1
Authorization: Bearer <token>
```

### Collaborative Editing

```bash
# Submit edit suggestion
POST /api/edits
Authorization: Bearer <token>
{
  "movieId": 1,
  "fieldName": "description",
  "newValue": "A corrected description...",
  "reason": "The original was inaccurate"
}

# Get edits for a movie
GET /api/edits/movies/1

# Pending edits (Admin)
GET /api/edits/pending
Authorization: Bearer <admin-token>

# Approve/Reject edit (Admin)
PATCH /api/edits/1/review
Authorization: Bearer <admin-token>
{
  "status": "APPROVED",
  "reviewComment": "Looks good!"
}
```

---

## 🧪 Running Tests

```bash
cd FILMDISCOURSE/backend

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthServiceTest

# Generate test report
mvn surefire-report:report
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/filmdiscourse` | PostgreSQL URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | `postgres` | DB password |
| `SPRING_DATA_REDIS_HOST` | `localhost` | Redis host |
| `SPRING_DATA_REDIS_PORT` | `6379` | Redis port |
| `APPLICATION_JWT_SECRET` | (64-char hex) | JWT signing key |
| `APPLICATION_JWT_EXPIRATION` | `86400000` | Token expiry (ms) |
| `APPLICATION_CORS_ALLOWED_ORIGINS` | `http://localhost:3000,...` | CORS origins |

---

## 🏗️ Architecture Decisions

### Security
- **JWT stateless auth** – No session state on server
- **BCrypt strength 12** – Secure password hashing
- **Role-based access** – `@PreAuthorize` method security
- **Rate limiting** – Bucket4j token bucket per IP
- **CORS** – Configurable allowed origins

### Performance
- **Redis caching** – Movie lists, details, genres, recommendations
- **Indexed DB fields** – title, genre, release_year, average_rating
- **Pagination everywhere** – Prevent large result sets
- **HikariCP connection pool** – Optimized DB connections
- **Lazy loading** – JPA relationships loaded on demand

### Data Integrity
- **Unique constraint** – One review per user per movie
- **Cascade delete** – Reviews/edits deleted with movie
- **Rating recalculation** – Triggered on every review add/update/delete
- **Edit approval workflow** – All field changes go through admin review

---

## 🗃️ Sample Test Data

The `database/init.sql` seeds:
- 3 roles (ROLE_USER, ROLE_ADMIN, ROLE_MODERATOR)
- 1 admin user
- 6 sample movies (Inception, The Dark Knight, Parasite, Interstellar, The Godfather, Spirited Away)
