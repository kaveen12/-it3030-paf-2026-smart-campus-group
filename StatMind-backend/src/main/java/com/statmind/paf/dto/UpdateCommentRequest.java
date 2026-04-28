package com.statmind.paf.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateCommentRequest {

    @NotBlank(message = "Author name is required")
    private String authorName;

    @NotBlank(message = "Updated message is required")
    private String message;

    public UpdateCommentRequest() {
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}