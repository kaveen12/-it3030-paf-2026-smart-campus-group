package com.statmind.paf.service;

import com.statmind.paf.dto.CreateCommentRequest;
import com.statmind.paf.dto.UpdateCommentRequest;
import com.statmind.paf.dto.DeleteCommentRequest;
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

    public TicketComment updateComment(String commentId, UpdateCommentRequest request) {
        TicketComment existing = commentRepository.findById(commentId).orElse(null);

        if (existing == null) {
            return null;
        }

        if (!existing.getAuthorName().equals(request.getAuthorName())) {
            throw new IllegalStateException("Only the comment owner can edit this comment");
        }

        existing.setMessage(request.getMessage());
        existing.setUpdatedAt(LocalDateTime.now());

        return commentRepository.save(existing);
    }

    public boolean deleteComment(String commentId, DeleteCommentRequest request) {
        TicketComment existing = commentRepository.findById(commentId).orElse(null);

        if (existing == null) {
            return false;
        }

        if (!existing.getAuthorName().equals(request.getAuthorName())) {
            throw new IllegalStateException("Only the comment owner can delete this comment");
        }

        commentRepository.deleteById(commentId);
        return true;
    }
}