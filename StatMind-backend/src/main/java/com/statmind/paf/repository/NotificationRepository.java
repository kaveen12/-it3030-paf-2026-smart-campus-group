package com.statmind.paf.repository;

import com.statmind.paf.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserId(String userId);

    long countByUserIdAndIsReadFalse(String userId); 

    List<Notification> findByUserIdAndIsReadFalse(String userId);

    List<Notification> findByUserIdAndIsRead(String userId, boolean isRead);
    
}