package group12.Backend.controller;

import group12.Backend.dto.NotificationDTO;
import group12.Backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    // ===== User Notification Endpoints =====
    
    // Get all notifications for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }
    
    // Get only unread notifications for a user
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }
    
    // Get notification by ID
    @GetMapping("/{id}")
    public ResponseEntity<NotificationDTO> getNotificationById(@PathVariable Integer id) {
        Optional<NotificationDTO> notification = notificationService.getNotificationById(id);
        return notification.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Count unread notifications
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Map<String, Long>> countUnreadNotifications(@PathVariable String userId) {
        Long count = notificationService.countUnreadNotifications(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
    
    // Create a notification (for manual creation or testing)
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(
            @RequestBody NotificationDTO.NotificationCreateRequest request) {
        NotificationDTO notification = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }
    
    // Create ticket notification helper endpoint
    @PostMapping("/ticket/{ticketId}")
    public ResponseEntity<NotificationDTO> createTicketNotification(
            @PathVariable String ticketId,
            @RequestParam String userId,
            @RequestParam String action) {
        
        NotificationDTO notification = notificationService.createTicketNotification(userId, ticketId, action);
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }
    
    // Mark a notification as read/unread
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markNotificationRead(
            @PathVariable Integer id,
            @RequestBody NotificationDTO.NotificationMarkReadRequest request) {
        NotificationDTO updatedNotification = notificationService.markAsRead(id, request);
        
        if (updatedNotification != null) {
            return ResponseEntity.ok(updatedNotification);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Mark all notifications as read for a user
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@PathVariable String userId) {
        int updated = notificationService.markAllAsRead(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", updated);
        response.put("message", updated + " notifications marked as read");
        
        return ResponseEntity.ok(response);
    }
    
    // Delete a notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Integer id) {
        boolean deleted = notificationService.deleteNotification(id);
        
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Clear old notifications for a user (optional days parameter)
    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<Map<String, Object>> clearOldNotifications(
            @PathVariable String userId,
            @RequestParam(defaultValue = "30") int daysToKeep) {
        
        int deleted = notificationService.cleanupOldNotifications(userId, daysToKeep);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("deleted", deleted);
        response.put("message", "Deleted " + deleted + " notifications older than " + daysToKeep + " days");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/broadcast")
    public ResponseEntity<Map<String, Object>> sendBroadcastNotification(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String message = request.get("message");
        
        if (title == null || title.isEmpty() || message == null || message.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Title and message are required");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        NotificationDTO notification = notificationService.createBroadcastNotification(title, message);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Broadcast notification sent successfully");
        response.put("notification", notification);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/broadcasts")
    public ResponseEntity<List<NotificationDTO>> getAllBroadcasts() {
        return ResponseEntity.ok(notificationService.getUserNotifications("broadcast"));
    }
    
    @DeleteMapping("/broadcast/{id}")
    public ResponseEntity<Map<String, Object>> deleteBroadcast(@PathVariable Integer id) {
        boolean deleted = notificationService.deleteNotification(id);
        
        Map<String, Object> response = new HashMap<>();
        if (deleted) {
            response.put("success", true);
            response.put("message", "Broadcast notification deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Broadcast notification not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}