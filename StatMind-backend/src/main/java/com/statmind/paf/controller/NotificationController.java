package com.statmind.paf.controller;

import com.statmind.paf.model.Notification;
import com.statmind.paf.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;
import com.statmind.paf.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    public NotificationController(NotificationRepository notificationRepository, NotificationService notificationService) {
    this.notificationRepository = notificationRepository;
    this.notificationService = notificationService;
}

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsByUserId(@PathVariable String userId) {
        return notificationRepository.findByUserId(userId);
    }
    @PostMapping
    public Notification createNotification(@RequestBody Notification notification) {
        return notificationService.createNotification(
            notification.getUserId(),
            notification.getMessage(),
            notification.getType()
    );
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable String id) {
    Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

    notification.setRead(true);
        return notificationRepository.save(notification);
    }
    @DeleteMapping("/{id}")
    public String deleteNotification(@PathVariable String id) {
    notificationRepository.deleteById(id);
        return "Notification deleted successfully";
    }
}