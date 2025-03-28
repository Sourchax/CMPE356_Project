package group12.Backend.dto;

import group12.Backend.entity.Station;

public class StationDTO {
    
    private Integer id;
    private String city;
    private String title;
    private String personnel;
    private String phoneno;
    private String address;
    private Station.Status status = Station.Status.active;
    
    // Default constructor
    public StationDTO() {
    }
    
    // Constructor with all fields
    public StationDTO(Integer id, String city, String title, String personnel, String phoneno, String address, Station.Status status) {
        this.id = id;
        this.city = city;
        this.title = title;
        this.personnel = personnel;
        this.phoneno = phoneno;
        this.address = address;
        this.status = status;
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getPersonnel() {
        return personnel;
    }
    
    public void setPersonnel(String personnel) {
        this.personnel = personnel;
    }
    
    public String getPhoneno() {
        return phoneno;
    }
    
    public void setPhoneno(String phoneno) {
        this.phoneno = phoneno;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public Station.Status getStatus() {
        return status;
    }
    
    public void setStatus(Station.Status status) {
        this.status = status;
    }
}