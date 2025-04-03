package group12.Backend.dto;

import java.time.LocalDateTime;

public class SeatsSoldDTO {
    
    private Integer id;
    private Integer voyageId;
    private String shipType;
    private Long upperDeckPromo;
    private Long upperDeckEconomy;
    private Long upperDeckBusiness;
    private Long lowerDeckPromo;
    private Long lowerDeckEconomy;
    private Long lowerDeckBusiness;
    private Long totalTicketsSold;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public SeatsSoldDTO() {
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public Integer getVoyageId() {
        return voyageId;
    }
    
    public void setVoyageId(Integer voyageId) {
        this.voyageId = voyageId;
    }
    
    public String getShipType() {
        return shipType;
    }
    
    public void setShipType(String shipType) {
        this.shipType = shipType;
    }
    
    public Long getUpperDeckPromo() {
        return upperDeckPromo;
    }
    
    public void setUpperDeckPromo(Long upperDeckPromo) {
        this.upperDeckPromo = upperDeckPromo;
    }
    
    public Long getUpperDeckEconomy() {
        return upperDeckEconomy;
    }
    
    public void setUpperDeckEconomy(Long upperDeckEconomy) {
        this.upperDeckEconomy = upperDeckEconomy;
    }
    
    public Long getUpperDeckBusiness() {
        return upperDeckBusiness;
    }
    
    public void setUpperDeckBusiness(Long upperDeckBusiness) {
        this.upperDeckBusiness = upperDeckBusiness;
    }
    
    public Long getLowerDeckPromo() {
        return lowerDeckPromo;
    }
    
    public void setLowerDeckPromo(Long lowerDeckPromo) {
        this.lowerDeckPromo = lowerDeckPromo;
    }
    
    public Long getLowerDeckEconomy() {
        return lowerDeckEconomy;
    }
    
    public void setLowerDeckEconomy(Long lowerDeckEconomy) {
        this.lowerDeckEconomy = lowerDeckEconomy;
    }
    
    public Long getLowerDeckBusiness() {
        return lowerDeckBusiness;
    }
    
    public void setLowerDeckBusiness(Long lowerDeckBusiness) {
        this.lowerDeckBusiness = lowerDeckBusiness;
    }
    
    public Long getTotalTicketsSold() {
        return totalTicketsSold;
    }
    
    public void setTotalTicketsSold(Long totalTicketsSold) {
        this.totalTicketsSold = totalTicketsSold;
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
}