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
public class EditHistoryResponse {

    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long submittedById;
    private String submittedByUsername;
    private String fieldName;
    private String oldValue;
    private String newValue;
    private String reason;
    private String status;
    private String reviewedByUsername;
    private String reviewComment;
    private LocalDateTime reviewedAt;
    private LocalDateTime submittedAt;
}
