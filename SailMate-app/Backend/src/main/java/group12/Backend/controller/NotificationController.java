package group12.Backend.controller;

import group12.Backend.util.*;

import group12.Backend.dto.ActivityLogDTO;
import group12.Backend.dto.NotificationDTO;
import group12.Backend.service.ActivityLogService;
import group12.Backend.service.NotificationService;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;
    
    @Autowired
    public NotificationController(NotificationService notificationService, ActivityLogService activityLogService) {
        this.notificationService = notificationService;
        this.activityLogService = activityLogService;
    }
    
    
    // Get all notifications for a user
    @GetMapping("/all")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(@RequestHeader("Authorization") String auth) throws Exception{
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");

        return ResponseEntity.ok(notificationService.getUserNotifications(claims.getSubject()));
    }
    
    // Get only unread notifications for a user
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        return ResponseEntity.ok(notificationService.getUnreadNotifications(claims.getSubject()));
    }
    
    // Get notification by ID
    @GetMapping("/{id}")
    public ResponseEntity<NotificationDTO> getNotificationById(@PathVariable Integer id) {
        Optional<NotificationDTO> notification = notificationService.getNotificationById(id);
        return notification.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Count unread notifications
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> countUnreadNotifications(@RequestHeader("Authorization") String auth) throws Exception{
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            
        Long count = notificationService.countUnreadNotifications(claims.getSubject());
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
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
            @RequestBody NotificationDTO.NotificationMarkReadRequest requestMe,
            @RequestHeader("Authorization") String auth) throws Exception {
        
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        NotificationDTO updatedNotification = notificationService.markAsRead(id, requestMe);
        
        if (updatedNotification != null) {
            return ResponseEntity.ok(updatedNotification);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Mark all notifications as read for a user
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@RequestHeader("Authorization") String auth) throws Exception{
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        int updated = notificationService.markAllAsRead(claims.getSubject());
        
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
    public ResponseEntity<Map<String, Object>> sendBroadcastNotification(@RequestBody Map<String, String> request, @RequestHeader("Authorization") String auth) throws Exception {
        // Authenticate user
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        // Check if user is admin or super for authorization
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if (!"admin".equalsIgnoreCase(role) && !"super".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to send broadcast messages");
        }
        
        String title = request.get("title");
        String message = request.get("message");
        
        if (title == null || title.isEmpty() || message == null || message.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Title and message are required");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        notificationService.createBroadcastNotification(title, message);
        
        // Log the broadcast activity
        ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
        logRequest.setActionType("BROADCAST");
        logRequest.setEntityType("NOTIFICATION");
        logRequest.setEntityId("broadcast");
        logRequest.setDescription("Sent broadcast notification: " + title);
        logRequest.setDescriptionTr("Toplu bildirim gönderildi: " + title);
        activityLogService.createActivityLog(logRequest, claims);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Broadcast notification sent successfully");
        response.put("notification", message);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @DeleteMapping("/broadcast/{id}")
    public ResponseEntity<Map<String, Object>> deleteBroadcast(@PathVariable Integer id, @RequestHeader("Authorization") String auth) throws Exception {
        // Authenticate user
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        // Check if user is admin or super for authorization
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if (!"admin".equalsIgnoreCase(role) && !"super".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to delete broadcast messages");
        }
        
        boolean deleted = notificationService.deleteNotification(id);
        
        // If deleted, log the activity
        if (deleted) {
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("DELETE");
            logRequest.setEntityType("NOTIFICATION");
            logRequest.setEntityId("broadcast/" + id);
            logRequest.setDescription("Deleted broadcast notification with ID: " + id);
            logRequest.setDescriptionTr("Toplu bildirim silindi, ID: " + id);
            activityLogService.createActivityLog(logRequest, claims);
        }
        
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