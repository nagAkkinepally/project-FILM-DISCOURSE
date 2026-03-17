package com.filmdiscourse.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class MovieRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Release year is required")
    @Min(value = 1888, message = "Release year must be 1888 or later")
    @Max(value = 2100, message = "Release year must be 2100 or earlier")
    private Integer releaseYear;

    @NotBlank(message = "Genre is required")
    @Size(max = 50, message = "Genre must not exceed 50 characters")
    private String genre;

    @NotBlank(message = "Director is required")
    @Size(max = 100, message = "Director must not exceed 100 characters")
    private String director;

    @Size(max = 500, message = "Poster URL must not exceed 500 characters")
    private String posterUrl;

    @Size(max = 500, message = "Trailer URL must not exceed 500 characters")
    private String trailerUrl;

    @Size(max = 100, message = "Language must not exceed 100 characters")
    private String language;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Max(value = 1440, message = "Duration must not exceed 1440 minutes")
    private Integer durationMinutes;
}
