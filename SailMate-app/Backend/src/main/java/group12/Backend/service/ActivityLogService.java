package group12.Backend.service;

import group12.Backend.dto.ActivityLogDTO;
import group12.Backend.entity.ActivityLog;
import group12.Backend.repository.ActivityLogRepository;
import group12.Backend.util.ClerkUsers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.jsonwebtoken.Claims;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
public class ActivityLogService {
    
    private final ActivityLogRepository activityLogRepository;
    
    @Autowired
    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }
    
    // Convert Entity to DTO
    private ActivityLogDTO convertToDTO(ActivityLog activityLog) {
        return new ActivityLogDTO(
            activityLog.getId(),
            activityLog.getActionType(),
            activityLog.getEntityType(),
            activityLog.getEntityId(),
            activityLog.getUserId(),
            activityLog.getFullName(),
            activityLog.getUserRole(),
            activityLog.getDescription(),
            activityLog.getDescriptionTr(),
            activityLog.getCreatedAt()
        );
    }
    
    // Get all activity logs
    public List<ActivityLogDTO> getAllActivityLogs() {
        return activityLogRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get activity log by ID
    public Optional<ActivityLogDTO> getActivityLogById(Integer id) {
        return activityLogRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    // Get activity logs by user ID
    public List<ActivityLogDTO> getActivityLogsByUserId(String userId) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get activity logs by entity type and entity ID
    public List<ActivityLogDTO> getActivityLogsByEntity(String entityType, String entityId) {
        return activityLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get activity logs by action type
    public List<ActivityLogDTO> getActivityLogsByActionType(String actionType) {
        return activityLogRepository.findByActionTypeOrderByCreatedAtDesc(actionType)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get activity logs with filters and pagination
    public Page<ActivityLogDTO> getActivityLogsWithFilters(
            ActivityLogDTO.ActivityLogFilterRequest filterRequest) {
        
        // Set default page and size if not provided
        int page = filterRequest.getPage() != null ? filterRequest.getPage() : 0;
        int size = filterRequest.getSize() != null ? filterRequest.getSize() : 20;
        
        // Create pageable
        Pageable pageable = PageRequest.of(page, size);
        
        // Find with filters
        Page<ActivityLog> activityLogs = activityLogRepository.findWithFilters(
            filterRequest.getActionType(),
            filterRequest.getEntityType(),
            filterRequest.getUserId(),
            filterRequest.getUserRole(),
            pageable
        );
        
        // Convert to DTOs
        return activityLogs.map(this::convertToDTO);
    }
    
    // Create an activity log
    @Transactional
    public ActivityLogDTO createActivityLog(
            ActivityLogDTO.ActivityLogCreateRequest request,
            Claims claims) {
        
        // Extract user information from claims
        String userId = claims.getSubject();
        
        // Get user metadata
        Map<String, Object> metadata = claims.get("meta_data", HashMap.class);
        String role = (String) metadata.get("role");
        
        // Set role as a string
        String userRole = role != null ? role.toLowerCase() : "user";
        
        // Get user full name from ClerkUsers
        String fullName = "";
        try {
            Map<String, Object> allUsers = ClerkUsers.allUsers();
            if (allUsers != null && allUsers.containsKey(userId)) {
                Map<String, Object> userInfo = (Map<String, Object>) allUsers.get(userId);
                if (userInfo.containsKey("full_name")) {
                    fullName = (String) userInfo.get("full_name");
                }
            }
        } catch (Exception e) {
            // Log the error but continue
            System.err.println("Error getting user full name: " + e.getMessage());
        }
        
        // Create the activity log
        ActivityLog activityLog = new ActivityLog(
            request.getActionType(),
            request.getEntityType(),
            request.getEntityId(),
            userId,
            fullName,
            userRole,
            request.getDescription(),
            request.getDescriptionTr()
        );
        
        // Save to database
        ActivityLog savedLog = activityLogRepository.save(activityLog);
        
        // Return as DTO
        return convertToDTO(savedLog);
    }
    
    // Create a system activity log (without user authentication)
    @Transactional
    public ActivityLogDTO createSystemActivityLog(
            String actionType,
            String entityType,
            String entityId,
            String description,
            String descriptionTr) {
        
        // Create the activity log with system user
        ActivityLog activityLog = new ActivityLog(
            actionType,
            entityType,
            entityId,
            "system",
            "System",
            "system",
            description,
            descriptionTr
        );
        
        // Save to database
        ActivityLog savedLog = activityLogRepository.save(activityLog);
        
        // Return as DTO
        return convertToDTO(savedLog);
    }
    
    // Get activity logs between dates
    public List<ActivityLogDTO> getActivityLogsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return activityLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Helper method to parse date strings
    private LocalDateTime parseDate(String dateStr, boolean isEndDate) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }
        
        try {
            LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE);
            if (isEndDate) {
                return date.atTime(LocalTime.MAX);
            } else {
                return date.atStartOfDay();
            }
        } catch (Exception e) {
            return null;
        }
    }
    
    // Delete an activity log (admin only)
    @Transactional
    public boolean deleteActivityLog(Integer id) {
        if (activityLogRepository.existsById(id)) {
            activityLogRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Get count of activity logs by entity type
    public long getCountByEntityType(String entityType) {
        return activityLogRepository.countByEntityType(entityType);
    }
    
    // Get count of activity logs by action type
    public long getCountByActionType(String actionType) {
        return activityLogRepository.countByActionType(actionType);
    }

    public long getActivityLogCount() {
        return activityLogRepository.count();
    }
}