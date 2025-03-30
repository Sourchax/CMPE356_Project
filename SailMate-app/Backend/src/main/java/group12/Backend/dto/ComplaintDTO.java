package group12.Backend.dto;

import group12.Backend.entity.Complaint;
import java.time.LocalDateTime;

public class ComplaintDTO {
    private Integer id;
    private String userId;
    private String sender;
    private String email;
    private String subject;
    private String message;
    private String reply;
    private Complaint.ComplaintStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors, getters, and setters
    public ComplaintDTO() {}
    
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
    
    public String getSender() {
        return sender;
    }
    
    public void setSender(String sender) {
        this.sender = sender;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getReply() {
        return reply;
    }
    
    public void setReply(String reply) {
        this.reply = reply;
    }
    
    public Complaint.ComplaintStatus getStatus() {
        return status;
    }
    
    public void setStatus(Complaint.ComplaintStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Nested classes
    public static class ComplaintCreateRequest {
        private String userId;
        private String sender;
        private String email;
        private String subject;
        private String message;
        
        // Constructors, getters, and setters
        public ComplaintCreateRequest() {}
        
        // Getters and Setters
        public String getUserId() {
            return userId;
        }
        
        public void setUserId(String userId) {
            this.userId = userId;
        }
        
        public String getSender() {
            return sender;
        }
        
        public void setSender(String sender) {
            this.sender = sender;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getSubject() {
            return subject;
        }
        
        public void setSubject(String subject) {
            this.subject = subject;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
    
    public static class ComplaintUpdateRequest {
        private Complaint.ComplaintStatus status;
        private String reply;
        
        // Constructors, getters, and setters
        public ComplaintUpdateRequest() {}
        
        // Getters and Setters
        public Complaint.ComplaintStatus getStatus() {
            return status;
        }
        
        public void setStatus(Complaint.ComplaintStatus status) {
            this.status = status;
        }
        
        public String getReply() {
            return reply;
        }
        
        public void setReply(String reply) {
            this.reply = reply;
        }
    }
}