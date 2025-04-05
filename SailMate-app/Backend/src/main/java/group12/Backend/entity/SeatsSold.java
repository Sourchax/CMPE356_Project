package group12.Backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seats_sold")
public class SeatsSold {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @OneToOne
    @JoinColumn(name = "voyage_id", nullable = false, unique = true)
    private Voyage voyage;
    
    @Column(name = "ship_type", nullable = false)
    private String shipType;
    
    @Column(name = "upper_deck_promo", nullable = false)
    private Long upperDeckPromo = 0L;
    
    @Column(name = "upper_deck_economy", nullable = false)
    private Long upperDeckEconomy = 0L;
    
    @Column(name = "upper_deck_business", nullable = false)
    private Long upperDeckBusiness = 0L;
    
    @Column(name = "lower_deck_promo", nullable = false)
    private Long lowerDeckPromo = 0L;
    
    @Column(name = "lower_deck_economy", nullable = false)
    private Long lowerDeckEconomy = 0L;
    
    @Column(name = "lower_deck_business", nullable = false)
    private Long lowerDeckBusiness = 0L;
    
    @Column(name = "total_tickets_sold", nullable = false)
    private Long totalTicketsSold = 0L;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public SeatsSold() {
    }
    
    public SeatsSold(Voyage voyage, String shipType) {
        this.voyage = voyage;
        this.shipType = shipType;
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public Voyage getVoyage() {
        return voyage;
    }
    
    public void setVoyage(Voyage voyage) {
        this.voyage = voyage;
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
    
    public void recalculateTotal(boolean isPurchased) {
        if(isPurchased)
            this.totalTicketsSold++;
        else
            this.totalTicketsSold--;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}