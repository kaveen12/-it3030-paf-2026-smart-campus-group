package com.statmind.paf.service;

import com.statmind.paf.model.TicketActivityLog;
import com.statmind.paf.repository.TicketActivityLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketActivityLogService {

    private final TicketActivityLogRepository activityLogRepository;

    public TicketActivityLogService(TicketActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    public TicketActivityLog createLog(String ticketId,
                                       String action,
                                       String performedBy,
                                       String performedRole,
                                       String details) {
        TicketActivityLog log = new TicketActivityLog(
                ticketId,
                action,
                performedBy,
                performedRole,
                details,
                LocalDateTime.now()
        );

        return activityLogRepository.save(log);
    }

    public List<TicketActivityLog> getLogsByTicketId(String ticketId) {
        return activityLogRepository.findByTicketIdOrderByTimestampDesc(ticketId);
    }
}