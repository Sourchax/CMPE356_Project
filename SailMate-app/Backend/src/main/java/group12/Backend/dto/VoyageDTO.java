package group12.Backend.dto;

import group12.Backend.entity.Voyage.VoyageStatus;
import java.time.LocalDate;
import java.time.LocalTime;

public class VoyageDTO {
    private Integer id;
    private Integer templateId;
    private Integer fromStationId;
    private String fromStationCity;
    private String fromStationTitle;
    private Integer toStationId;
    private String toStationCity;
    private String toStationTitle;
    private LocalDate departureDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private VoyageStatus status;
    private String shipType;
    private Boolean fuelType;
    private Long businessSeats;
    private Long promoSeats;
    private Long economySeats;
    private Boolean isModified;
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Integer templateId) {
        this.templateId = templateId;
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