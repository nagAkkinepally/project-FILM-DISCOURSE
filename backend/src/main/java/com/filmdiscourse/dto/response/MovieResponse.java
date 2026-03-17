package com.filmdiscourse.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MovieResponse {

    private Long id;
    private String title;
    private String description;
    private Integer releaseYear;
    private String genre;
    private String director;
    private Double averageRating;
    private Integer totalReviews;
    private String posterUrl;
    private String trailerUrl;
    private String language;
    private Integer durationMinutes;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
