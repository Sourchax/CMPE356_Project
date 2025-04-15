package group12.Backend.dto;

import group12.Backend.entity.Notification.NotificationType;
import java.time.LocalDateTime;

public class NotificationDTO {
    private Integer id;
    private String userId;
    private NotificationType type;
    private String title;
    private String message;
    private String titleTr;
    private String messageTr;
    private String entityId;
    private Boolean isRead;
    private LocalDateTime createdAt;
    
    // Default constructor
    public NotificationDTO() {
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public NotificationType getType() {
        return type;
    }
    
    public void setType(NotificationType type) {
        this.type = type;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getTitleTr() {
        return titleTr;
    }
    
    public void setTitleTr(String titleTr) {
        this.titleTr = titleTr;
    }
    
    public String getMessageTr() {
        return messageTr;
    }
    
    public void setMessageTr(String messageTr) {
        this.messageTr = messageTr;
    }
    
    public String getEntityId() {
        return entityId;
    }
    
    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }
    
    public Boolean getIsRead() {
        return isRead;
    }
    
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Nested classes for API requests
    public static class NotificationCreateRequest {
        private String userId;
        private NotificationType type;
        private String title;
        private String message;
        private String titleTr;
        private String messageTr;
        private String entityId;
        
        // Getters and Setters
        public String getUserId() {
            return userId;
        }
        
        public void setUserId(String userId) {
            this.userId = userId;
        }
        
        public NotificationType getType() {
            return type;
        }
        
        public void setType(NotificationType type) {
            this.type = type;
        }
        
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public String getTitleTr() {
            return titleTr;
        }
        
        public void setTitleTr(String titleTr) {
            this.titleTr = titleTr;
        }
        
        public String getMessageTr() {
            return messageTr;
        }
        
        public void setMessageTr(String messageTr) {
            this.messageTr = messageTr;
        }
        
        public String getEntityId() {
            return entityId;
        }
        
        public void setEntityId(String entityId) {
            this.entityId = entityId;
        }
    }
    
    public static class NotificationMarkReadRequest {
        private Boolean isRead;
        
        public Boolean getIsRead() {
            return isRead;
        }
        
        public void setIsRead(Boolean isRead) {
            this.isRead = isRead;
        }
    }
}