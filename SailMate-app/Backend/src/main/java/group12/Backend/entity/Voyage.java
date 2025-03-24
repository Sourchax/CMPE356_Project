package group12.Backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "voyages")
public class Voyage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "template_id")
    private VoyageTemplate template;
    
    @ManyToOne
    @JoinColumn(name = "from_station")
    private Station fromStation;
    
    @ManyToOne
    @JoinColumn(name = "to_station")
    private Station toStation;
    
    @Column(name = "departure_date", nullable = false)
    private LocalDate departureDate;
    
    @Column(name = "departure_time", nullable = false)
    private LocalTime departureTime;
    
    @Column(name = "arrival_time", nullable = false)
    private LocalTime arrivalTime;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private VoyageStatus status = VoyageStatus.active;
    
    @Column(name = "ship_type", nullable = false)
    private String shipType;
    
    @Column(name = "fuel_type")
    private Boolean fuelType = false;
    
    @Column(name = "business_seats")
    private Long businessSeats;
    
    @Column(name = "promo_seats")
    private Long promoSeats;
    
    @Column(name = "economy_seats")
    private Long economySeats;
    
    @Column(name = "is_modified")
    private Boolean isModified = false;
    
    // Enum for voyage status
    public enum VoyageStatus {
        active, cancel, delete
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public VoyageTemplate getTemplate() {
        return template;
    }

    public void setTemplate(VoyageTemplate template) {
        this.template = template;
    }

    public Station getFromStation() {
        return fromStation;
    }

    public void setFromStation(Station fromStation) {
        this.fromStation = fromStation;
    }

    public Station getToStation() {
        return toStation;
    }

    public void setToStation(Station toStation) {
        this.toStation = toStation;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public VoyageStatus getStatus() {
        return status;
    }

    public void setStatus(VoyageStatus status) {
        this.status = status;
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

    public Long getBusinessSeats() {
        return businessSeats;
    }

    public void setBusinessSeats(Long businessSeats) {
        this.businessSeats = businessSeats;
    }

    public Long getPromoSeats() {
        return promoSeats;
    }

    public void setPromoSeats(Long promoSeats) {
        this.promoSeats = promoSeats;
    }

    public Long getEconomySeats() {
        return economySeats;
    }

    public void setEconomySeats(Long economySeats) {
        this.economySeats = economySeats;
    }

    public Boolean getIsModified() {
        return isModified;
    }

    public void setIsModified(Boolean isModified) {
        this.isModified = isModified;
    }
}