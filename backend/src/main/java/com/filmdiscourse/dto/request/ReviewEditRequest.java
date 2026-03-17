package com.filmdiscourse.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewEditRequest {

    @NotNull(message = "Status is required")
    private String status; // APPROVED or REJECTED

    @Size(max = 500, message = "Comment must not exceed 500 characters")
    private String reviewComment;
}
