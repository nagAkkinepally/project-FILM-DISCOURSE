package com.filmdiscourse.controller;

import com.filmdiscourse.dto.request.MovieRequest;
import com.filmdiscourse.dto.response.ApiResponse;
import com.filmdiscourse.dto.response.MovieResponse;
import com.filmdiscourse.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@Tag(name = "Movies", description = "Movie management endpoints")
public class MovieController {

    private final MovieService movieService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new movie")
    public ResponseEntity<ApiResponse<MovieResponse>> createMovie(
            @Valid @RequestBody MovieRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        MovieResponse movie = movieService.createMovie(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Movie created", movie));
    }

    @GetMapping
    @Operation(summary = "Get all movies with pagination")
    public ResponseEntity<ApiResponse<Page<MovieResponse>>> getAllMovies(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<MovieResponse> movies = movieService.getAllMovies(pageable);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get movie by ID")
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(@PathVariable Long id) {
        MovieResponse movie = movieService.getMovieById(id);
        return ResponseEntity.ok(ApiResponse.success(movie));
    }

    @GetMapping("/search")
    @Operation(summary = "Search/filter movies by title, genre, or release year")
    public ResponseEntity<ApiResponse<Page<MovieResponse>>> searchMovies(
            @Parameter(description = "Search by title") @RequestParam(required = false) String title,
            @Parameter(description = "Filter by genre") @RequestParam(required = false) String genre,
            @Parameter(description = "Filter by release year") @RequestParam(required = false) Integer releaseYear,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<MovieResponse> movies = movieService.searchMovies(title, genre, releaseYear, pageable);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/genres")
    @Operation(summary = "Get all distinct genres")
    public ResponseEntity<ApiResponse<List<String>>> getAllGenres() {
        List<String> genres = movieService.getAllGenres();
        return ResponseEntity.ok(ApiResponse.success(genres));
    }

    @GetMapping("/top-rated")
    @Operation(summary = "Get top-rated movies")
    public ResponseEntity<ApiResponse<Page<MovieResponse>>> getTopRated(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<MovieResponse> movies = movieService.getTopRatedMovies(pageable);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/{id}/recommendations")
    @Operation(summary = "Get movie recommendations based on genre")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getRecommendations(@PathVariable Long id) {
        List<MovieResponse> recommendations = movieService.getRecommendations(id);
        return ResponseEntity.ok(ApiResponse.success(recommendations));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update a movie")
    public ResponseEntity<ApiResponse<MovieResponse>> updateMovie(
            @PathVariable Long id,
            @Valid @RequestBody MovieRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        MovieResponse updated = movieService.updateMovie(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Movie updated", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a movie (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(ApiResponse.success("Movie deleted successfully", null));
    }
}
