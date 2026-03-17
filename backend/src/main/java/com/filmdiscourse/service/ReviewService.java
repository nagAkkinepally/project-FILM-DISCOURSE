package com.filmdiscourse.service;

import com.filmdiscourse.dto.request.ReviewRequest;
import com.filmdiscourse.dto.response.ReviewResponse;
import com.filmdiscourse.entity.Movie;
import com.filmdiscourse.entity.Review;
import com.filmdiscourse.entity.User;
import com.filmdiscourse.exception.BadRequestException;
import com.filmdiscourse.exception.DuplicateResourceException;
import com.filmdiscourse.exception.ResourceNotFoundException;
import com.filmdiscourse.exception.UnauthorizedException;
import com.filmdiscourse.repository.ReviewRepository;
import com.filmdiscourse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final MovieService movieService;

    @Transactional
    @CacheEvict(value = { "reviews", "movie", "movies" }, allEntries = true)
    public ReviewResponse addReview(Long movieId, ReviewRequest request, String username) {
        Movie movie = movieService.findMovieById(movieId);
        User user = findUserByUsername(username);

        if (reviewRepository.existsByMovieIdAndUserId(movieId, user.getId())) {
            throw new DuplicateResourceException(
                    "You have already reviewed this movie. Update your existing review.");
        }

        Review review = Review.builder()
                .movie(movie)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .spoiler(request.isSpoiler())
                .helpfulCount(0)
                .build();

        Review saved = reviewRepository.save(review);
        updateMovieAverageRating(movie);
        log.info("Review added by {} for movie {}", username, movieId);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "reviews", key = "#movieId + '-' + #pageable.pageNumber")
    public Page<ReviewResponse> getReviewsByMovie(Long movieId, Pageable pageable) {
        movieService.findMovieById(movieId); // existence check
        return reviewRepository.findByMovieId(movieId, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByUser(Long userId, Pageable pageable) {
        return reviewRepository.findByUserId(userId, pageable).map(this::mapToResponse);
    }

    @Transactional
    @CacheEvict(value = { "reviews", "movie", "movies" }, allEntries = true)
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request, String username) {
        Review review = findReviewById(reviewId);
        validateOwnership(review, username);

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setSpoiler(request.isSpoiler());

        Review updated = reviewRepository.save(review);
        updateMovieAverageRating(review.getMovie());
        log.info("Review {} updated by {}", reviewId, username);
        return mapToResponse(updated);
    }

    @Transactional
    @CacheEvict(value = { "reviews", "movie", "movies" }, allEntries = true)
    public void deleteReview(Long reviewId, String username) {
        Review review = findReviewById(reviewId);
        validateOwnership(review, username);

        Movie movie = review.getMovie();
        reviewRepository.delete(review);
        updateMovieAverageRating(movie);
        log.info("Review {} deleted by {}", reviewId, username);
    }

    private void updateMovieAverageRating(Movie movie) {
        Double avgRating = reviewRepository.calculateAverageRatingByMovieId(movie.getId());
        Long totalReviews = reviewRepository.countByMovieId(movie.getId());

        movie.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        movie.setTotalReviews(totalReviews.intValue());
        movieService.updateMovieRating(movie);
    }

    private void validateOwnership(Review review, String username) {
        if (!review.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("You are not authorized to modify this review");
        }
    }

    private Review findReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
    }

    private User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .movieId(review.getMovie().getId())
                .movieTitle(review.getMovie().getTitle())
                .userId(review.getUser().getId())
                .username(review.getUser().getUsername())
                .rating(review.getRating())
                .comment(review.getComment())
                .spoiler(review.isSpoiler())
                .helpfulCount(review.getHelpfulCount())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
