package com.statmind.paf.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignTechnicianRequest {

    @NotBlank(message = "Technician id is required")
    private String assignedTechnicianId;

    @NotBlank(message = "Technician name is required")
    private String assignedTechnicianName;

    public AssignTechnicianRequest() {
    }

    public String getAssignedTechnicianId() {
        return assignedTechnicianId;
    }

    public void setAssignedTechnicianId(String assignedTechnicianId) {
        this.assignedTechnicianId = assignedTechnicianId;
    }

    public String getAssignedTechnicianName() {
        return assignedTechnicianName;
    }

    public void setAssignedTechnicianName(String assignedTechnicianName) {
        this.assignedTechnicianName = assignedTechnicianName;
    }
}