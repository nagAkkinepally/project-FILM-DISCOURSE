package com.filmdiscourse.service;

import com.filmdiscourse.dto.request.EditSuggestionRequest;
import com.filmdiscourse.dto.request.ReviewEditRequest;
import com.filmdiscourse.dto.response.EditHistoryResponse;
import com.filmdiscourse.entity.EditHistory;
import com.filmdiscourse.entity.EditHistory.EditStatus;
import com.filmdiscourse.entity.Movie;
import com.filmdiscourse.entity.User;
import com.filmdiscourse.exception.BadRequestException;
import com.filmdiscourse.exception.ResourceNotFoundException;
import com.filmdiscourse.repository.EditHistoryRepository;
import com.filmdiscourse.repository.MovieRepository;
import com.filmdiscourse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class EditHistoryService {

    private final EditHistoryRepository editHistoryRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    @Transactional
    public EditHistoryResponse submitEditSuggestion(EditSuggestionRequest request, String username) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", request.getMovieId()));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        String oldValue = getCurrentFieldValue(movie, request.getFieldName());

        EditHistory editHistory = EditHistory.builder()
                .movie(movie)
                .submittedBy(user)
                .fieldName(request.getFieldName())
                .oldValue(oldValue)
                .newValue(request.getNewValue())
                .reason(request.getReason())
                .status(EditStatus.PENDING)
                .build();

        EditHistory saved = editHistoryRepository.save(editHistory);
        log.info("Edit suggestion submitted by {} for movie {}", username, movie.getId());
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<EditHistoryResponse> getEditsByMovie(Long movieId, Pageable pageable) {
        return editHistoryRepository.findByMovieId(movieId, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<EditHistoryResponse> getPendingEdits(Pageable pageable) {
        return editHistoryRepository.findByStatus(EditStatus.PENDING, pageable).map(this::mapToResponse);
    }

    @Transactional
    @CacheEvict(value = { "movie", "movies" }, allEntries = true)
    public EditHistoryResponse reviewEdit(Long editId, ReviewEditRequest request, String adminUsername) {
        EditHistory edit = editHistoryRepository.findById(editId)
                .orElseThrow(() -> new ResourceNotFoundException("EditHistory", "id", editId));

        if (edit.getStatus() != EditStatus.PENDING) {
            throw new BadRequestException("This edit has already been reviewed");
        }

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", adminUsername));

        EditStatus newStatus;
        try {
            newStatus = EditStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status. Must be APPROVED or REJECTED");
        }

        edit.setStatus(newStatus);
        edit.setReviewedBy(admin);
        edit.setReviewComment(request.getReviewComment());
        edit.setReviewedAt(LocalDateTime.now());

        if (newStatus == EditStatus.APPROVED) {
            applyEditToMovie(edit);
        }

        EditHistory saved = editHistoryRepository.save(edit);
        log.info("Edit {} {} by admin {}", editId, newStatus, adminUsername);
        return mapToResponse(saved);
    }

    private void applyEditToMovie(EditHistory edit) {
        Movie movie = edit.getMovie();
        String fieldName = edit.getFieldName();
        String newValue = edit.getNewValue();

        try {
            switch (fieldName.toLowerCase()) {
                case "title" -> movie.setTitle(newValue);
                case "description" -> movie.setDescription(newValue);
                case "releaseyear", "release_year" -> movie.setReleaseYear(Integer.parseInt(newValue));
                case "genre" -> movie.setGenre(newValue);
                case "director" -> movie.setDirector(newValue);
                case "language" -> movie.setLanguage(newValue);
                case "durationminutes", "duration_minutes" -> movie.setDurationMinutes(Integer.parseInt(newValue));
                case "posterurl", "poster_url" -> movie.setPosterUrl(newValue);
                default -> throw new BadRequestException("Unknown field: " + fieldName);
            }
            movieRepository.save(movie);
            log.info("Applied edit to movie {}: {} = {}", movie.getId(), fieldName, newValue);
        } catch (NumberFormatException e) {
            throw new BadRequestException("Invalid numeric value for field: " + fieldName);
        }
    }

    private String getCurrentFieldValue(Movie movie, String fieldName) {
        return switch (fieldName.toLowerCase()) {
            case "title" -> movie.getTitle();
            case "description" -> movie.getDescription();
            case "releaseyear", "release_year" ->
                movie.getReleaseYear() != null ? String.valueOf(movie.getReleaseYear()) : null;
            case "genre" -> movie.getGenre();
            case "director" -> movie.getDirector();
            case "language" -> movie.getLanguage();
            case "durationminutes", "duration_minutes" ->
                movie.getDurationMinutes() != null ? String.valueOf(movie.getDurationMinutes()) : null;
            case "posterurl", "poster_url" -> movie.getPosterUrl();
            default -> null;
        };
    }

    private EditHistoryResponse mapToResponse(EditHistory edit) {
        return EditHistoryResponse.builder()
                .id(edit.getId())
                .movieId(edit.getMovie().getId())
                .movieTitle(edit.getMovie().getTitle())
                .submittedById(edit.getSubmittedBy().getId())
                .submittedByUsername(edit.getSubmittedBy().getUsername())
                .fieldName(edit.getFieldName())
                .oldValue(edit.getOldValue())
                .newValue(edit.getNewValue())
                .reason(edit.getReason())
                .status(edit.getStatus().name())
                .reviewedByUsername(edit.getReviewedBy() != null ? edit.getReviewedBy().getUsername() : null)
                .reviewComment(edit.getReviewComment())
                .reviewedAt(edit.getReviewedAt())
                .submittedAt(edit.getSubmittedAt())
                .build();
    }
}
