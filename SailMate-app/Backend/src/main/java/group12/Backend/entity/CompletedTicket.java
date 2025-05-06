package group12.Backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "completed_tickets")
public class CompletedTicket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "ticket_id", unique = true, nullable = false)
    private String ticketId;
    
    @Column(name = "voyage_id")
    private Integer voyageId;
    
    @Column(name = "dep_city", nullable = false)
    private String depCity;
    
    @Column(name = "dep_station_title", nullable = false)
    private String depStationTitle;
    
    @Column(name = "arr_city", nullable = false)
    private String arrCity;
    
    @Column(name = "arr_station_title", nullable = false)
    private String arrStationTitle;
    
    @Column(name = "dep_date", nullable = false)
    private LocalDate depDate;
    
    @Column(name = "dep_time", nullable = false)
    private LocalTime depTime;
    
    @Column(name = "arr_time", nullable = false)
    private LocalTime arrTime;
    
    @Column(name = "ship_type", nullable = false)
    private String shipType;
    
    @Column(name = "fuel_type")
    private Boolean fuelType;
    
    @Column(name = "passenger_count", nullable = false)
    private Integer passengerCount;
    
    @Column(name = "total_price", nullable = false)
    private Integer totalPrice;
    
    @Column(name = "ticket_class", nullable = false)
    private String ticketClass;
    
    @Column(name = "selected_seats", nullable = false)
    private String selectedSeats;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "ticket_data", columnDefinition = "JSON", nullable = false)
    private String ticketData;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
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
    public CompletedTicket() {
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public Integer getVoyageId() {
        return voyageId;
    }

    public void setVoyageId(Integer voyageId) {
        this.voyageId = voyageId;
    }

    public String getDepCity() {
        return depCity;
    }

    public void setDepCity(String depCity) {
        this.depCity = depCity;
    }

    public String getDepStationTitle() {
        return depStationTitle;
    }

    public void setDepStationTitle(String depStationTitle) {
        this.depStationTitle = depStationTitle;
    }

    public String getArrCity() {
        return arrCity;
    }

    public void setArrCity(String arrCity) {
        this.arrCity = arrCity;
    }

    public String getArrStationTitle() {
        return arrStationTitle;
    }

    public void setArrStationTitle(String arrStationTitle) {
        this.arrStationTitle = arrStationTitle;
    }

    public LocalDate getDepDate() {
        return depDate;
    }

    public void setDepDate(LocalDate depDate) {
        this.depDate = depDate;
    }

    public LocalTime getDepTime() {
        return depTime;
    }

    public void setDepTime(LocalTime depTime) {
        this.depTime = depTime;
    }

    public LocalTime getArrTime() {
        return arrTime;
    }

    public void setArrTime(LocalTime arrTime) {
        this.arrTime = arrTime;
    }

    public String getShipType() {
        return shipType;
    }

    public void setShipType(String shipType) {
        this.shipType = shipType;
    }

    public Boolean getFuelType() {
        return fuelType;
    }

    public void setFuelType(Boolean fuelType) {
        this.fuelType = fuelType;
    }

    public Integer getPassengerCount() {
        return passengerCount;
    }

    public void setPassengerCount(Integer passengerCount) {
        this.passengerCount = passengerCount;
    }

    public Integer getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Integer totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getTicketClass() {
        return ticketClass;
    }

    public void setTicketClass(String ticketClass) {
        this.ticketClass = ticketClass;
    }

    public String getSelectedSeats() {
        return selectedSeats;
    }

    public void setSelectedSeats(String selectedSeats) {
        this.selectedSeats = selectedSeats;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTicketData() {
        return ticketData;
    }

    public void setTicketData(String ticketData) {
        this.ticketData = ticketData;
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