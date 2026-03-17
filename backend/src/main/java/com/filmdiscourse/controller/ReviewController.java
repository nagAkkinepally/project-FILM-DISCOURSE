package com.filmdiscourse.controller;

import com.filmdiscourse.dto.request.ReviewRequest;
import com.filmdiscourse.dto.response.ApiResponse;
import com.filmdiscourse.dto.response.ReviewResponse;
import com.filmdiscourse.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
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

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Movie review management endpoints")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/movies/{movieId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add a review to a movie")
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(
            @PathVariable Long movieId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ReviewResponse review = reviewService.addReview(movieId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Review added", review));
    }

    @GetMapping("/movies/{movieId}")
    @Operation(summary = "Get all reviews for a movie")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getReviewsByMovie(
            @PathVariable Long movieId,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getReviewsByMovie(movieId, pageable);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/users/{userId}")
    @Operation(summary = "Get all reviews by a user")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getReviewsByUser(
            @PathVariable Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getReviewsByUser(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @PutMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update your own review")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ReviewResponse updated = reviewService.updateReview(reviewId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Review updated", updated));
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete your own review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal UserDetails userDetails) {
        reviewService.deleteReview(reviewId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }
}
