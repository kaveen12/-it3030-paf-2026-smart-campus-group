package com.statmind.paf.controller;

import com.statmind.paf.model.IncidentTicket;
import com.statmind.paf.service.IncidentTicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.statmind.paf.dto.AssignTechnicianRequest;
import com.statmind.paf.dto.UpdateStatusRequest;
import com.statmind.paf.dto.RejectTicketRequest;
import com.statmind.paf.dto.ResolveTicketRequest;
import com.statmind.paf.dto.AddAttachmentsRequest;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class IncidentTicketController {

    private final IncidentTicketService service;

    public IncidentTicketController(IncidentTicketService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<IncidentTicket> createTicket(@Valid @RequestBody IncidentTicket ticket) {
    return new ResponseEntity<>(service.createTicket(ticket), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<IncidentTicket>> getAllTickets() {
        return ResponseEntity.ok(service.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable String id) {
        IncidentTicket ticket = service.getTicketById(id);

        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }

        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable String id, @Valid @RequestBody IncidentTicket updatedTicket) {
        IncidentTicket ticket = service.updateTicket(id, updatedTicket);

        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }

        return ResponseEntity.ok(ticket);
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<?> assignTechnician(@PathVariable String id,
                                          @Valid @RequestBody AssignTechnicianRequest request) {
    IncidentTicket ticket = service.assignTechnician(id, request);

    if (ticket == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
    }

    return ResponseEntity.ok(ticket);
    }

    @PatchMapping("/{id}/status")
public ResponseEntity<?> updateTicketStatus(@PathVariable String id,
                                            @Valid @RequestBody UpdateStatusRequest request) {
    try {
        IncidentTicket ticket = service.updateTicketStatus(id, request);

        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }

        return ResponseEntity.ok(ticket);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    }

    @PatchMapping("/{id}/reject")
public ResponseEntity<?> rejectTicket(@PathVariable String id,
                                      @Valid @RequestBody RejectTicketRequest request) {
    try {
        IncidentTicket ticket = service.rejectTicket(id, request);

        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }

        return ResponseEntity.ok(ticket);
    } catch (IllegalStateException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    }
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<?> resolveTicket(@PathVariable String id,
                                       @Valid @RequestBody ResolveTicketRequest request) {
    try {
        IncidentTicket ticket = service.resolveTicket(id, request);

        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }

        return ResponseEntity.ok(ticket);
    } catch (IllegalStateException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    }

    @PatchMapping("/{id}/close")
public ResponseEntity<?> closeTicket(@PathVariable String id) {
    try {
        IncidentTicket ticket = service.closeTicket(id);

        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }

        return ResponseEntity.ok(ticket);
    } catch (IllegalStateException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    }

    @PatchMapping("/{id}/attachments")
    public ResponseEntity<?> addAttachments(@PathVariable String id,
                                        @Valid @RequestBody AddAttachmentsRequest request) {
    try {
        IncidentTicket ticket = service.addAttachments(id, request);

        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }

        return ResponseEntity.ok(ticket);
    } catch (IllegalStateException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id) {
        boolean deleted = service.deleteTicket(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }

        return ResponseEntity.ok("Deleted successfully");
    }
}