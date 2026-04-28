package com.statmind.paf.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class AddAttachmentsRequest {

    @NotEmpty(message = "At least one attachment is required")
    private List<String> attachmentUrls;

    public AddAttachmentsRequest() {
    }

    public List<String> getAttachmentUrls() {
        return attachmentUrls;
    }

    public void setAttachmentUrls(List<String> attachmentUrls) {
        this.attachmentUrls = attachmentUrls;
    }
}