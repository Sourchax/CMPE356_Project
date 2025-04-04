package group12.Backend.repository;

import group12.Backend.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Integer> {
    
    // Find logs by user ID
    List<ActivityLog> findByUserIdOrderByCreatedAtDesc(String userId);
    
    // Find logs by entity type and entity ID
    List<ActivityLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, String entityId);
    
    // Find logs by action type
    List<ActivityLog> findByActionTypeOrderByCreatedAtDesc(String actionType);
    
    // Find logs by user role
    List<ActivityLog> findByUserRoleOrderByCreatedAtDesc(String userRole);
    
    // Find logs created between dates
    List<ActivityLog> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find logs with pagination and filtering
    @Query("SELECT a FROM ActivityLog a WHERE " +
           "(:actionType IS NULL OR a.actionType = :actionType) AND " +
           "(:entityType IS NULL OR a.entityType = :entityType) AND " +
           "(:userId IS NULL OR a.userId = :userId) AND " +
           "(:userRole IS NULL OR a.userRole = :userRole) " +
           "ORDER BY a.createdAt DESC")
    Page<ActivityLog> findWithFilters(
        @Param("actionType") String actionType,
        @Param("entityType") String entityType,
        @Param("userId") String userId,
        @Param("userRole") String userRole,
        Pageable pageable
    );
    
    // Count logs by entity type
    long countByEntityType(String entityType);
    
    // Count logs by action type
    long countByActionType(String actionType);
}