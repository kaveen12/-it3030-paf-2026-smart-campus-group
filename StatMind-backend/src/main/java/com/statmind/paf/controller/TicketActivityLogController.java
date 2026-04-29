package com.statmind.paf.controller;

import com.statmind.paf.model.TicketActivityLog;
import com.statmind.paf.service.TicketActivityLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketActivityLogController {

    private final TicketActivityLogService activityLogService;

    public TicketActivityLogController(TicketActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping("/{ticketId}/logs")
    public List<TicketActivityLog> getLogsByTicketId(@PathVariable String ticketId) {
        return activityLogService.getLogsByTicketId(ticketId);
    }
}