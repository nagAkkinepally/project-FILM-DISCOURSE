package com.filmdiscourse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EditSuggestionRequest {

    @NotNull(message = "Movie ID is required")
    private Long movieId;

    @NotBlank(message = "Field name is required")
    @Size(max = 50, message = "Field name must not exceed 50 characters")
    private String fieldName;

    @NotBlank(message = "New value is required")
    @Size(max = 2000, message = "New value must not exceed 2000 characters")
    private String newValue;

    @Size(max = 1000, message = "Reason must not exceed 1000 characters")
    private String reason;
}
