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

    // Resource integration fields
    private String resourceId;
    private String resourceCode;
    private String resourceName;
    private String location;

    // Temporary backward-compatible field
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

    // Created-by fields
    private String createdById;
    private String createdByName;
    private String createdByRole;

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

    public IncidentTicket(String id,
                          String resourceId,
                          String resourceCode,
                          String resourceName,
                          String location,
                          String resourceOrLocation,
                          String category,
                          String description,
                          String priority,
                          String preferredContact,
                          String createdById,
                          String createdByName,
                          String createdByRole,
                          String status,
                          String rejectionReason,
                          String assignedTechnicianId,
                          String assignedTechnicianName,
                          String resolutionNotes,
                          List<String> attachmentUrls,
                          LocalDateTime createdAt,
                          LocalDateTime updatedAt) {
        this.id = id;
        this.resourceId = resourceId;
        this.resourceCode = resourceCode;
        this.resourceName = resourceName;
        this.location = location;
        this.resourceOrLocation = resourceOrLocation;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.preferredContact = preferredContact;
        this.createdById = createdById;
        this.createdByName = createdByName;
        this.createdByRole = createdByRole;
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

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceCode() {
        return resourceCode;
    }

    public void setResourceCode(String resourceCode) {
        this.resourceCode = resourceCode;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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

    public String getCreatedById() {
        return createdById;
    }

    public void setCreatedById(String createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public String getCreatedByRole() {
        return createdByRole;
    }

    public void setCreatedByRole(String createdByRole) {
        this.createdByRole = createdByRole;
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