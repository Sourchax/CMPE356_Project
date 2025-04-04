package group12.Backend.repository;

import group12.Backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    
    // Find all notifications for a user, ordered by creation date (newest first)
    // No longer including 'broadcast' user ID in the query
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdOrderByCreatedAtDesc(@Param("userId") String userId);
    
    // Find unread notifications for a user
    // No longer including 'broadcast' user ID in the query  
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(@Param("userId") String userId);
    
    // Find notifications by type for a user
    List<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(String userId, Notification.NotificationType type);
    
    // Count unread notifications for a user
    // No longer including 'broadcast' user ID in the query
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.isRead = false")
    Long countByUserIdAndIsReadFalse(@Param("userId") String userId);
    
    // Mark all notifications as read for a user
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
    int markAllAsReadForUser(@Param("userId") String userId);
    
    // Delete all notifications for a specific entity
    @Modifying
    void deleteByEntityId(String entityId);
    
    // Delete notifications older than a specific date for a user
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.userId = :userId AND n.createdAt < :date")
    int deleteOldNotifications(@Param("userId") String userId, @Param("date") java.time.LocalDateTime date);
    
    // Find all notifications of a specific type
    List<Notification> findByTypeOrderByCreatedAtDesc(Notification.NotificationType type);
}