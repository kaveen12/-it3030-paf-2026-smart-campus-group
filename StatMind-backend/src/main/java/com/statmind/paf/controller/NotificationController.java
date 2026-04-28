package com.statmind.paf.controller;

import com.statmind.paf.exception.ResourceNotFoundException;
import com.statmind.paf.model.Notification;
import com.statmind.paf.repository.NotificationRepository;
import com.statmind.paf.repository.UserRepository;
import com.statmind.paf.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.*;
import com.statmind.paf.service.NotificationService;
import com.statmind.paf.model.User;
import com.statmind.paf.repository.UserRepository;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationRepository notificationRepository, NotificationService notificationService ,UserRepository userRepository) {
    this.notificationRepository = notificationRepository;
    this.notificationService = notificationService;
    this.userRepository = userRepository;
}

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsByUserId(@PathVariable String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
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
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

    notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @DeleteMapping("/{id}")
    public String deleteNotification(@PathVariable String id) {
    Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

    notificationRepository.delete(notification);
        return "Notification deleted successfully";
    }

    @PostMapping("/booking-status")
    public Notification sendBookingStatusNotification(@RequestParam String userId,
                                                  @RequestParam String status) {
    String message = "Your booking has been " + status;
        return notificationService.createNotification(userId, message, "BOOKING");
    }

    @PostMapping("/ticket-status")
    public Notification sendTicketStatusNotification(@RequestParam String userId,
                                                 @RequestParam String status) {
    String message = "Your ticket status changed to " + status;
        return notificationService.createNotification(userId, message, "TICKET");
    }

    @PostMapping("/comment")
    public Notification sendCommentNotification(@RequestParam String userId) {
    String message = "A new comment was added to your ticket";
        return notificationService.createNotification(userId, message, "COMMENT");
    }

    @GetMapping("/user/{userId}/unread-count")
    public long getUnreadCount(@PathVariable String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @GetMapping("/user/{userId}/unread")
    public List<Notification> getUnreadNotifications(@PathVariable String userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    @PutMapping("/user/{userId}/read-all")
    public List<Notification> markAllAsRead(@PathVariable String userId) {
    List<Notification> notifications = notificationRepository.findByUserIdAndIsRead(userId, false);

    for (Notification notification : notifications) {
        notification.setRead(true);
    }

        return notificationRepository.saveAll(notifications);
    }

    @PostMapping("/send-to-role")
public String sendNotificationToRole(@RequestBody Map<String, String> request) {

    String role = request.get("role");
    String message = request.get("message");
    String type = request.getOrDefault("type", "ADMIN_MESSAGE");

    List<User> users = userRepository.findAll();

    for (User user : users) {

        // 🔥 handle ALL USERS
        if (role.equalsIgnoreCase("ALL")) {

            Notification notification = new Notification();
            notification.setUserId(user.getId());
            notification.setMessage(message);
            notification.setType(type);
            notification.setRead(false);
            notification.setCreatedAt(java.time.LocalDateTime.now().toString());

            notificationRepository.save(notification);
        }

        // 🔥 handle specific role
        else if (user.getRole() != null &&
                user.getRole().name().equalsIgnoreCase(role)) {

            Notification notification = new Notification();
            notification.setUserId(user.getId());
            notification.setMessage(message);
            notification.setType(type);
            notification.setRead(false);
            notification.setCreatedAt(java.time.LocalDateTime.now().toString());

            notificationRepository.save(notification);
        }
    }

    return "Notification sent successfully";
}


}