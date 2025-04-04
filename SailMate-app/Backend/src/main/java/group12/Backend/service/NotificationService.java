package group12.Backend.service;

import group12.Backend.dto.NotificationDTO;
import group12.Backend.entity.Notification;
import group12.Backend.repository.NotificationRepository;
import group12.Backend.util.ClerkUsers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    
    // Convert Entity to DTO
    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUserId());
        dto.setType(notification.getType());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setEntityId(notification.getEntityId());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
    
    // Get all notifications for a user
    public List<NotificationDTO> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get unread notifications for a user
    public List<NotificationDTO> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get notification by ID
    public Optional<NotificationDTO> getNotificationById(Integer id) {
        return notificationRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    // Count unread notifications
    public Long countUnreadNotifications(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
    
    // Create a new notification
    @Transactional
    public NotificationDTO createNotification(NotificationDTO.NotificationCreateRequest request) {
        Notification notification = new Notification(
                request.getUserId(),
                request.getType(),
                request.getTitle(),
                request.getMessage(),
                request.getEntityId()
        );
        
        notification = notificationRepository.save(notification);
        return convertToDTO(notification);
    }
    
    // Mark notification as read
    @Transactional
    public NotificationDTO markAsRead(Integer id, NotificationDTO.NotificationMarkReadRequest request) {
        Optional<Notification> notificationOpt = notificationRepository.findById(id);
        
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setIsRead(request.getIsRead());
            
            notification = notificationRepository.save(notification);
            return convertToDTO(notification);
        }
        
        return null;
    }
    
    // Mark all notifications as read for a user
    @Transactional
    public int markAllAsRead(String userId) {
        return notificationRepository.markAllAsReadForUser(userId);
    }
    
    // Delete a notification
    @Transactional
    public boolean deleteNotification(Integer id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return true;
        }
        
        return false;
    }
    
    // Delete all notifications for a specific entity (e.g., when a ticket or voyage is deleted)
    @Transactional
    public void deleteNotificationsForEntity(String entityId) {
        notificationRepository.deleteByEntityId(entityId);
    }
    
    // Create ticket notification
    @Transactional
    public NotificationDTO createTicketNotification(String userId, String ticketId, String action) {
        String title;
        String message;
        Notification.NotificationType type;
        
        if ("created".equals(action)) {
            title = "Ticket Purchased";
            message = "Your ticket " + ticketId + " has been successfully purchased.";
            type = Notification.NotificationType.TICKET_CREATED;
        } else if ("updated".equals(action)) {
            title = "Ticket Updated";
            message = "Your ticket " + ticketId + " has been updated.";
            type = Notification.NotificationType.TICKET_UPDATED;
        } else {
            title = "Ticket Notification";
            message = "There's an update regarding your ticket " + ticketId + ".";
            type = Notification.NotificationType.SYSTEM;
        }
        
        Notification notification = new Notification(userId, type, title, message, ticketId);
        notification = notificationRepository.save(notification);
        return convertToDTO(notification);
    }
    
    // Create broadcast notification for all users
    @Transactional
    public List<NotificationDTO> createBroadcastNotification(String title, String message) {
        List<NotificationDTO> createdNotifications = new ArrayList<>();
        
        // Get all users from ClerkUsers utility
        Map<String, Object> allUsers = ClerkUsers.allUsers();
        
        if (allUsers != null && !allUsers.isEmpty()) {
            // For each user, create an individual notification
            for (String userId : allUsers.keySet()) {
                Notification notification = new Notification(
                        userId,  // Use actual user ID instead of "broadcast"
                        Notification.NotificationType.BROADCAST,
                        title,
                        message,
                        null  // No entity ID for broadcast messages
                );
                
                Notification savedNotification = notificationRepository.save(notification);
                createdNotifications.add(convertToDTO(savedNotification));
            }
        }
        
        return createdNotifications;
    }
    
    // Get all broadcast notifications (for admin view)
    @Transactional
    public List<NotificationDTO> getAllBroadcasts() {
        // We don't have a "broadcast" user anymore, so we'll find by type instead
        return notificationRepository.findByUserIdAndTypeOrderByCreatedAtDesc("broadcast", Notification.NotificationType.BROADCAST)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Create voyage notification
    @Transactional
    public List<NotificationDTO> createVoyageNotification(Integer voyageId, List<String> affectedUserIds, String action) {
        String title;
        String message;
        Notification.NotificationType type;
        
        if ("cancelled".equals(action)) {
            title = "Voyage Cancelled";
            message = "Your voyage #" + voyageId + " has been cancelled. Please check your email for further details.";
            type = Notification.NotificationType.VOYAGE_CANCELLED;
        } else if ("delayed".equals(action)) {
            title = "Voyage Delayed";
            message = "Your voyage #" + voyageId + " has been delayed. Please check the updated schedule.";
            type = Notification.NotificationType.VOYAGE_DELAYED;
        } else {
            title = "Voyage Update";
            message = "There's an update regarding your voyage #" + voyageId + ".";
            type = Notification.NotificationType.SYSTEM;
        }
        
        return affectedUserIds.stream().map(userId -> {
            Notification notification = new Notification(userId, type, title, message, voyageId.toString());
            notification = notificationRepository.save(notification);
            return convertToDTO(notification);
        }).collect(Collectors.toList());
    }
    
    // Clean up old notifications (could be scheduled with @Scheduled)
    @Transactional
    public int cleanupOldNotifications(String userId, int daysToKeep) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysToKeep);
        return notificationRepository.deleteOldNotifications(userId, cutoffDate);
    }
}