package com.statmind.paf.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AssignTechnicianRequest {

    @NotBlank(message = "Technician id is required")
    private String assignedTechnicianId;

    @NotBlank(message = "Technician name is required")
    private String assignedTechnicianName;
}