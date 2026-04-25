package com.statmind.paf.repository;

import com.statmind.paf.model.TicketActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketActivityLogRepository extends MongoRepository<TicketActivityLog, String> {

    List<TicketActivityLog> findByTicketIdOrderByTimestampDesc(String ticketId);
}