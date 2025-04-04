package group12.Backend.dto;

import java.time.LocalDateTime;

public class ActivityLogDTO {
    private Integer id;
    private String actionType;
    private String entityType;
    private String entityId;
    private String userId;
    private String fullName;
    private String userRole;
    private String description;
    private LocalDateTime createdAt;
    
    // Default constructor
    public ActivityLogDTO() {
    }
    
    // Constructor with all fields
    public ActivityLogDTO(Integer id, String actionType, String entityType, String entityId,
                         String userId, String fullName, String userRole, 
                         String description, LocalDateTime createdAt) {
        this.id = id;
        this.actionType = actionType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.userId = userId;
        this.fullName = fullName;
        this.userRole = userRole;
        this.description = description;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getActionType() {
        return actionType;
    }
    
    public void setActionType(String actionType) {
        this.actionType = actionType;
    }
    
    public String getEntityType() {
        return entityType;
    }
    
    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }
    
    public String getEntityId() {
        return entityId;
    }
    
    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getUserRole() {
        return userRole;
    }
    
    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Inner class for creating activity logs
    public static class ActivityLogCreateRequest {
        private String actionType;
        private String entityType;
        private String entityId;
        private String description;
        
        // Getters and Setters
        public String getActionType() {
            return actionType;
        }
        
        public void setActionType(String actionType) {
            this.actionType = actionType;
        }
        
        public String getEntityType() {
            return entityType;
        }
        
        public void setEntityType(String entityType) {
            this.entityType = entityType;
        }
        
        public String getEntityId() {
            return entityId;
        }
        
        public void setEntityId(String entityId) {
            this.entityId = entityId;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
    }
    
    // Inner class for filtering activity logs
    public static class ActivityLogFilterRequest {
        private String actionType;
        private String entityType;
        private String userId;
        private String userRole;
        private String startDate;
        private String endDate;
        private Integer page;
        private Integer size;
        
        // Getters and Setters
        public String getActionType() {
            return actionType;
        }
        
        public void setActionType(String actionType) {
            this.actionType = actionType;
        }
        
        public String getEntityType() {
            return entityType;
        }
        
        public void setEntityType(String entityType) {
            this.entityType = entityType;
        }
        
        public String getUserId() {
            return userId;
        }
        
        public void setUserId(String userId) {
            this.userId = userId;
        }
        
        public String getUserRole() {
            return userRole;
        }
        
        public void setUserRole(String userRole) {
            this.userRole = userRole;
        }
        
        public String getStartDate() {
            return startDate;
        }
        
        public void setStartDate(String startDate) {
            this.startDate = startDate;
        }
        
        public String getEndDate() {
            return endDate;
        }
        
        public void setEndDate(String endDate) {
            this.endDate = endDate;
        }
        
        public Integer getPage() {
            return page;
        }
        
        public void setPage(Integer page) {
            this.page = page;
        }
        
        public Integer getSize() {
            return size;
        }
        
        public void setSize(Integer size) {
            this.size = size;
        }
    }
}