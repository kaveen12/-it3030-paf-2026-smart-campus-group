package com.statmind.paf.dto;

import jakarta.validation.constraints.NotBlank;

public class DeleteCommentRequest {

    @NotBlank(message = "Author name is required")
    private String authorName;

    public DeleteCommentRequest() {
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
}