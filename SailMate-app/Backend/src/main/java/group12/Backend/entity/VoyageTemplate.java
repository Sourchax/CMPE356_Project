package group12.Backend.entity;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "voyage_templates")
public class VoyageTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "from_station")
    private Station fromStation;
    
    @ManyToOne
    @JoinColumn(name = "to_station")
    private Station toStation;
    
    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;
    
    @Column(name = "departure_time", nullable = false)
    private LocalTime departureTime;
    
    @Column(name = "arrival_time", nullable = false)
    private LocalTime arrivalTime;
    
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
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL)
    private List<Voyage> voyages;
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<Voyage> getVoyages() {
        return voyages;
    }

    public void setVoyages(List<Voyage> voyages) {
        this.voyages = voyages;
    }
}