package group12.Backend.dto;

public class AnnouncementDTO {
    
    private Integer id;
    private String imageBase64; // For transferring image data as Base64
    private String title;
    private String description;
    private String details;
    
    // Default constructor
    public AnnouncementDTO() {
    }
    
    // Constructor with all fields
    public AnnouncementDTO(Integer id, String imageBase64, String title, String description, String details) {
        this.id = id;
        this.imageBase64 = imageBase64;
        this.title = title;
        this.description = description;
        this.details = details;
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getImageBase64() {
        return imageBase64;
    }
    
    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getDetails() {
        return details;
    }
    
    public void setDetails(String details) {
        this.details = details;
    }
}