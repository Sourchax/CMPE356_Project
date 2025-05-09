package group12.Backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class CompletedTicketDTO {
    private Integer id;
    private String ticketId;
    private Integer voyageId;
    private String depCity;
    private String depStationTitle;
    private String arrCity;
    private String arrStationTitle;
    private LocalDate depDate;
    private LocalTime depTime;
    private LocalTime arrTime;
    private String shipType;
    private Boolean fuelType;
    private Integer passengerCount;
    private Double totalPrice;  // Changed from Integer to Double
    private String ticketClass;
    private String selectedSeats;
    private String userId;
    private List<TicketDTO.PassengerInfo> passengers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors, getters, and setters
    public CompletedTicketDTO() {}
    
    public CompletedTicketDTO(Integer id, String ticketId, Integer voyageId, String depCity,
                             String depStationTitle, String arrCity, String arrStationTitle,
                             LocalDate depDate, LocalTime depTime, LocalTime arrTime,
                             String shipType, Boolean fuelType, Integer passengerCount,
                             Double totalPrice, String ticketClass, String selectedSeats,
                             String userId, List<TicketDTO.PassengerInfo> passengers,
                             LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.voyageId = voyageId;
        this.depCity = depCity;
        this.depStationTitle = depStationTitle;
        this.arrCity = arrCity;
        this.arrStationTitle = arrStationTitle;
        this.depDate = depDate;
        this.depTime = depTime;
        this.arrTime = arrTime;
        this.shipType = shipType;
        this.fuelType = fuelType;
        this.passengerCount = passengerCount;
        this.totalPrice = totalPrice;
        this.ticketClass = ticketClass;
        this.selectedSeats = selectedSeats;
        this.userId = userId;
        this.passengers = passengers;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
    
    public Double getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(Double totalPrice) {
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
    
    public List<TicketDTO.PassengerInfo> getPassengers() {
        return passengers;
    }
    
    public void setPassengers(List<TicketDTO.PassengerInfo> passengers) {
        this.passengers = passengers;
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