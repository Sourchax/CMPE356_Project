package group12.Backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
public class Notification {
    
    public enum NotificationType {
        TICKET_CREATED, TICKET_UPDATED, VOYAGE_CANCELLED, VOYAGE_DELAYED, PRICE_CHANGED, SYSTEM, BROADCAST
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    // New Turkish versions of title and message
    @Column(name = "title_tr")
    private String titleTr;
    
    @Column(name = "message_tr", columnDefinition = "TEXT")
    private String messageTr;
    
    @Column(name = "entity_id")
    private String entityId;
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Notification() {
    }
    
    public Notification(String userId, NotificationType type, String title, String message, String titleTr, String messageTr, String entityId) {
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.titleTr = titleTr;
        this.messageTr = messageTr;
        this.entityId = entityId;
    }
    
    // Getter and setter methods
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
}