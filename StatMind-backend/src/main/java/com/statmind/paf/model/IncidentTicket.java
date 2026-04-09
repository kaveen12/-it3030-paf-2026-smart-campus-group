package com.statmind.paf.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentTicket {

    @Id
    private String id;

    @NotBlank(message = "Resource or location is required")
    private String resourceOrLocation;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Priority is required")
    private String priority;

    @NotBlank(message = "Preferred contact is required")
    private String preferredContact;

    @Builder.Default
    private String status = "OPEN";

    private String rejectionReason;

    private String assignedTechnician;

    private String resolutionNotes;

    @Builder.Default
    private List<String> attachmentUrls = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}