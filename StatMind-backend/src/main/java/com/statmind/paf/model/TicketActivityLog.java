package com.statmind.paf.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ticket_activity_logs")
public class TicketActivityLog {

    @Id
    private String id;

    private String ticketId;
    private String action;
    private String performedBy;
    private String performedRole;
    private String details;
    private LocalDateTime timestamp;

    public TicketActivityLog() {
    }

    public TicketActivityLog(String ticketId, String action, String performedBy,
                             String performedRole, String details, LocalDateTime timestamp) {
        this.ticketId = ticketId;
        this.action = action;
        this.performedBy = performedBy;
        this.performedRole = performedRole;
        this.details = details;
        this.timestamp = timestamp;
    }

    public String getId() {
        return id;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public String getPerformedRole() {
        return performedRole;
    }

    public void setPerformedRole(String performedRole) {
        this.performedRole = performedRole;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}