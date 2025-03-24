package group12.Backend.dto;

import java.time.LocalTime;

public class VoyageTemplateDTO {
    private Integer id;
    private Integer fromStationId;
    private String fromStationCity;
    private String fromStationTitle;
    private Integer toStationId;
    private String toStationCity;
    private String toStationTitle;
    private Integer dayOfWeek;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private String shipType;
    private Boolean fuelType;
    private Long businessSeats;
    private Long promoSeats;
    private Long economySeats;
    private Boolean isActive;
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getFromStationId() {
        return fromStationId;
    }

    public void setFromStationId(Integer fromStationId) {
        this.fromStationId = fromStationId;
    }

    public String getFromStationCity() {
        return fromStationCity;
    }

    public void setFromStationCity(String fromStationCity) {
        this.fromStationCity = fromStationCity;
    }

    public String getFromStationTitle() {
        return fromStationTitle;
    }

    public void setFromStationTitle(String fromStationTitle) {
        this.fromStationTitle = fromStationTitle;
    }

    public Integer getToStationId() {
        return toStationId;
    }

    public void setToStationId(Integer toStationId) {
        this.toStationId = toStationId;
    }

    public String getToStationCity() {
        return toStationCity;
    }

    public void setToStationCity(String toStationCity) {
        this.toStationCity = toStationCity;
    }

    public String getToStationTitle() {
        return toStationTitle;
    }

    public void setToStationTitle(String toStationTitle) {
        this.toStationTitle = toStationTitle;
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
}