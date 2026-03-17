package com.filmdiscourse.service;

import com.filmdiscourse.dto.request.MovieRequest;
import com.filmdiscourse.dto.response.MovieResponse;
import com.filmdiscourse.entity.Movie;
import com.filmdiscourse.entity.User;
import com.filmdiscourse.exception.ResourceNotFoundException;
import com.filmdiscourse.repository.MovieRepository;
import com.filmdiscourse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    @Transactional
    @CacheEvict(value = { "movies", "genres" }, allEntries = true)
    public MovieResponse createMovie(MovieRequest request, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .releaseYear(request.getReleaseYear())
                .genre(request.getGenre())
                .director(request.getDirector())
                .posterUrl(request.getPosterUrl())
                .trailerUrl(request.getTrailerUrl())
                .language(request.getLanguage())
                .durationMinutes(request.getDurationMinutes())
                .createdBy(creator)
                .averageRating(0.0)
                .totalReviews(0)
                .build();

        Movie saved = movieRepository.save(movie);
        log.info("Movie created: {} by {}", saved.getTitle(), username);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "movies", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort")
    public Page<MovieResponse> getAllMovies(Pageable pageable) {
        return movieRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "movie", key = "#id")
    public MovieResponse getMovieById(Long id) {
        Movie movie = findMovieById(id);
        return mapToResponse(movie);
    }

    @Transactional(readOnly = true)
    public Page<MovieResponse> searchMovies(String title, String genre, Integer releaseYear, Pageable pageable) {
        return movieRepository.findByFilters(title, genre, releaseYear, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "movie", key = "#id"),
            @CacheEvict(value = "movies", allEntries = true)
    })
    public MovieResponse updateMovie(Long id, MovieRequest request, String username) {
        Movie movie = findMovieById(id);

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setReleaseYear(request.getReleaseYear());
        movie.setGenre(request.getGenre());
        movie.setDirector(request.getDirector());
        if (request.getPosterUrl() != null)
            movie.setPosterUrl(request.getPosterUrl());
        if (request.getTrailerUrl() != null)
            movie.setTrailerUrl(request.getTrailerUrl());
        if (request.getLanguage() != null)
            movie.setLanguage(request.getLanguage());
        if (request.getDurationMinutes() != null)
            movie.setDurationMinutes(request.getDurationMinutes());

        Movie updated = movieRepository.save(movie);
        log.info("Movie updated: {} by {}", updated.getTitle(), username);
        return mapToResponse(updated);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "movie", key = "#id"),
            @CacheEvict(value = { "movies", "genres" }, allEntries = true)
    })
    public void deleteMovie(Long id) {
        Movie movie = findMovieById(id);
        movieRepository.delete(movie);
        log.info("Movie deleted: id={}", id);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "genres")
    public List<String> getAllGenres() {
        return movieRepository.findAllGenres();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "recommendations", key = "#movieId")
    public List<MovieResponse> getRecommendations(Long movieId) {
        Movie movie = findMovieById(movieId);
        return movieRepository.findSimilarMovies(movie.getGenre(), movieId,
                org.springframework.data.domain.PageRequest.of(0, 6))
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<MovieResponse> getTopRatedMovies(Pageable pageable) {
        return movieRepository.findTopRatedMovies(pageable).map(this::mapToResponse);
    }

    // Package-private for use by ReviewService
    Movie findMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id));
    }

    void updateMovieRating(Movie movie) {
        movieRepository.save(movie);
    }

    private MovieResponse mapToResponse(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .releaseYear(movie.getReleaseYear())
                .genre(movie.getGenre())
                .director(movie.getDirector())
                .averageRating(movie.getAverageRating())
                .totalReviews(movie.getTotalReviews())
                .posterUrl(movie.getPosterUrl())
                .trailerUrl(movie.getTrailerUrl())
                .language(movie.getLanguage())
                .durationMinutes(movie.getDurationMinutes())
                .createdByUsername(movie.getCreatedBy() != null ? movie.getCreatedBy().getUsername() : null)
                .createdAt(movie.getCreatedAt())
                .updatedAt(movie.getUpdatedAt())
                .build();
    }
}
