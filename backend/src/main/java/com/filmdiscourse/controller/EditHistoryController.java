package com.filmdiscourse.controller;

import com.filmdiscourse.dto.request.EditSuggestionRequest;
import com.filmdiscourse.dto.request.ReviewEditRequest;
import com.filmdiscourse.dto.response.ApiResponse;
import com.filmdiscourse.dto.response.EditHistoryResponse;
import com.filmdiscourse.service.EditHistoryService;
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
@RequestMapping("/edits")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Collaborative Editing", description = "Movie edit suggestion and approval endpoints")
public class EditHistoryController {

    private final EditHistoryService editHistoryService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit an edit suggestion for a movie")
    public ResponseEntity<ApiResponse<EditHistoryResponse>> submitEdit(
            @Valid @RequestBody EditSuggestionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        EditHistoryResponse edit = editHistoryService.submitEditSuggestion(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Edit suggestion submitted", edit));
    }

    @GetMapping("/movies/{movieId}")
    @Operation(summary = "Get all edits for a movie")
    public ResponseEntity<ApiResponse<Page<EditHistoryResponse>>> getEditsByMovie(
            @PathVariable Long movieId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<EditHistoryResponse> edits = editHistoryService.getEditsByMovie(movieId, pageable);
        return ResponseEntity.ok(ApiResponse.success(edits));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all pending edit suggestions (Admin only)")
    public ResponseEntity<ApiResponse<Page<EditHistoryResponse>>> getPendingEdits(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<EditHistoryResponse> pending = editHistoryService.getPendingEdits(pageable);
        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    @PatchMapping("/{editId}/review")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Approve or reject an edit suggestion (Admin only)")
    public ResponseEntity<ApiResponse<EditHistoryResponse>> reviewEdit(
            @PathVariable Long editId,
            @Valid @RequestBody ReviewEditRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        EditHistoryResponse edit = editHistoryService.reviewEdit(editId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Edit reviewed", edit));
    }
}
