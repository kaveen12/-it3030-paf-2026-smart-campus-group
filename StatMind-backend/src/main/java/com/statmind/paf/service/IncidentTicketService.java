package com.statmind.paf.service;

import com.statmind.paf.model.IncidentTicket;
import com.statmind.paf.repository.IncidentTicketRepository;
import org.springframework.stereotype.Service;

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

    public boolean deleteTicket(String id) {
        IncidentTicket existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }
}