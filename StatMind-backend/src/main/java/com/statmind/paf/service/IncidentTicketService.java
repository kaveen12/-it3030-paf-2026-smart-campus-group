package com.statmind.paf.service;

import com.statmind.paf.model.IncidentTicket;
import com.statmind.paf.repository.IncidentTicketRepository;
import org.springframework.stereotype.Service;
import com.statmind.paf.dto.AssignTechnicianRequest;
import com.statmind.paf.dto.UpdateStatusRequest;
import com.statmind.paf.dto.RejectTicketRequest;
import com.statmind.paf.dto.ResolveTicketRequest;
import com.statmind.paf.dto.AddAttachmentsRequest;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository repository;

    public IncidentTicketService(IncidentTicketRepository repository) {
        this.repository = repository;
    }

    public IncidentTicket createTicket(IncidentTicket ticket) {
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return repository.save(ticket);
    }

    public List<IncidentTicket> getAllTickets() {
        return repository.findAll();
    }

    public IncidentTicket getTicketById(String id) {
        return repository.findById(id).orElse(null);
    }

    public IncidentTicket updateTicket(String id, IncidentTicket updatedTicket) {
        IncidentTicket existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setResourceOrLocation(updatedTicket.getResourceOrLocation());
        existing.setCategory(updatedTicket.getCategory());
        existing.setDescription(updatedTicket.getDescription());
        existing.setPriority(updatedTicket.getPriority());
        existing.setPreferredContact(updatedTicket.getPreferredContact());
        existing.setUpdatedAt(LocalDateTime.now());

        return repository.save(existing);
    }

    public IncidentTicket assignTechnician(String id, AssignTechnicianRequest request) {
    IncidentTicket existing = repository.findById(id).orElse(null);

    if (existing == null) {
        return null;
    }

    existing.setAssignedTechnicianId(request.getAssignedTechnicianId());
    existing.setAssignedTechnicianName(request.getAssignedTechnicianName());

    if ("OPEN".equals(existing.getStatus())) {
        existing.setStatus("IN_PROGRESS");
    }

    existing.setUpdatedAt(LocalDateTime.now());

    return repository.save(existing);
}
    public IncidentTicket updateTicketStatus(String id, UpdateStatusRequest request) {
    IncidentTicket existing = repository.findById(id).orElse(null);

    if (existing == null) {
        return null;
    }

    String newStatus = request.getStatus().toUpperCase();

    if (!newStatus.equals("OPEN") &&
        !newStatus.equals("IN_PROGRESS") &&
        !newStatus.equals("RESOLVED") &&
        !newStatus.equals("CLOSED") &&
        !newStatus.equals("REJECTED")) {
        throw new IllegalArgumentException("Invalid status value");
    }

    existing.setStatus(newStatus);
    existing.setUpdatedAt(LocalDateTime.now());

    return repository.save(existing);
    }
    public IncidentTicket rejectTicket(String id, RejectTicketRequest request) {
    IncidentTicket existing = repository.findById(id).orElse(null);

    if (existing == null) {
        return null;
    }

    // Optional rule: cannot reject closed tickets
    if ("CLOSED".equals(existing.getStatus())) {
        throw new IllegalStateException("Cannot reject a closed ticket");
    }

    existing.setStatus("REJECTED");
    existing.setRejectionReason(request.getRejectionReason());
    existing.setUpdatedAt(LocalDateTime.now());

    return repository.save(existing);
    }

    public IncidentTicket resolveTicket(String id, ResolveTicketRequest request) {
    IncidentTicket existing = repository.findById(id).orElse(null);

    if (existing == null) {
        return null;
    }

    if ("CLOSED".equals(existing.getStatus())) {
        throw new IllegalStateException("Cannot resolve a closed ticket");
    }

    existing.setResolutionNotes(request.getResolutionNotes());
    existing.setStatus("RESOLVED");
    existing.setUpdatedAt(LocalDateTime.now());

    return repository.save(existing);
    }

    public IncidentTicket closeTicket(String id) {
    IncidentTicket existing = repository.findById(id).orElse(null);

    if (existing == null) {
        return null;
    }

    if (!"RESOLVED".equals(existing.getStatus())) {
        throw new IllegalStateException("Only resolved tickets can be closed");
    }

    existing.setStatus("CLOSED");
    existing.setUpdatedAt(LocalDateTime.now());

    return repository.save(existing);
    }

    public IncidentTicket addAttachments(String id, AddAttachmentsRequest request) {
    IncidentTicket existing = repository.findById(id).orElse(null);

    if (existing == null) {
        return null;
    }

    List<String> currentAttachments = existing.getAttachmentUrls();

    if (currentAttachments == null) {
        currentAttachments = new java.util.ArrayList<>();
    }

    int newTotal = currentAttachments.size() + request.getAttachmentUrls().size();

    if (newTotal > 3) {
        throw new IllegalStateException("A ticket can have a maximum of 3 attachments");
    }

    currentAttachments.addAll(request.getAttachmentUrls());
    existing.setAttachmentUrls(currentAttachments);
    existing.setUpdatedAt(LocalDateTime.now());

    return repository.save(existing);
    }

    public boolean deleteTicket(String id) {
        IncidentTicket existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }
    
}