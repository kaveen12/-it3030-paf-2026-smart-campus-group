package com.statmind.paf.dto;

import jakarta.validation.constraints.NotBlank;

public class RejectTicketRequest {

    @NotBlank(message = "Rejection reason is required")
    private String rejectionReason;

    public RejectTicketRequest() {
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}