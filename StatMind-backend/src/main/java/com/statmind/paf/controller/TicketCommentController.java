package com.statmind.paf.controller;

import com.statmind.paf.dto.CreateCommentRequest;
import com.statmind.paf.model.TicketComment;
import com.statmind.paf.service.TicketCommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@CrossOrigin(origins = "*")
public class TicketCommentController {

    private final TicketCommentService commentService;

    public TicketCommentController(TicketCommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<?> addComment(@PathVariable String ticketId,
                                        @Valid @RequestBody CreateCommentRequest request) {
        TicketComment comment = commentService.addComment(ticketId, request);

        if (comment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }

        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TicketComment>> getCommentsByTicketId(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicketId(ticketId));
    }
}