package com.statmind.paf.service;

import com.statmind.paf.dto.CreateCommentRequest;
import com.statmind.paf.model.IncidentTicket;
import com.statmind.paf.model.TicketComment;
import com.statmind.paf.repository.IncidentTicketRepository;
import com.statmind.paf.repository.TicketCommentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketCommentService {

    private final TicketCommentRepository commentRepository;
    private final IncidentTicketRepository ticketRepository;

    public TicketCommentService(TicketCommentRepository commentRepository,
                                IncidentTicketRepository ticketRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
    }

    public TicketComment addComment(String ticketId, CreateCommentRequest request) {
        IncidentTicket ticket = ticketRepository.findById(ticketId).orElse(null);

        if (ticket == null) {
            return null;
        }

        TicketComment comment = new TicketComment();
        comment.setTicketId(ticketId);
        comment.setAuthorName(request.getAuthorName());
        comment.setAuthorRole(request.getAuthorRole());
        comment.setMessage(request.getMessage());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    public List<TicketComment> getCommentsByTicketId(String ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }
}