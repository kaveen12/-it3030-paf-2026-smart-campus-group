package com.statmind.paf.model;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tickets")
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

    private String status = "OPEN";

    private String rejectionReason;

    private String assignedTechnicianId;
    private String assignedTechnicianName;

    private String resolutionNotes;

    private List<String> attachmentUrls = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IncidentTicket() {
    }

    public IncidentTicket(String id, String resourceOrLocation, String category, String description,
                          String priority, String preferredContact, String status, String rejectionReason,
                          String assignedTechnicianId, String assignedTechnicianName, String resolutionNotes,
                          List<String> attachmentUrls, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.resourceOrLocation = resourceOrLocation;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.preferredContact = preferredContact;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.assignedTechnicianId = assignedTechnicianId;
        this.assignedTechnicianName = assignedTechnicianName;
        this.resolutionNotes = resolutionNotes;
        this.attachmentUrls = attachmentUrls;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public String getResourceOrLocation() {
        return resourceOrLocation;
    }

    public void setResourceOrLocation(String resourceOrLocation) {
        this.resourceOrLocation = resourceOrLocation;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getPreferredContact() {
        return preferredContact;
    }

    public void setPreferredContact(String preferredContact) {
        this.preferredContact = preferredContact;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
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

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public List<String> getAttachmentUrls() {
        return attachmentUrls;
    }

    public void setAttachmentUrls(List<String> attachmentUrls) {
        this.attachmentUrls = attachmentUrls;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}