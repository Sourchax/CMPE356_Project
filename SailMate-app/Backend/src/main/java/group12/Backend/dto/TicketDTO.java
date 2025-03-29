package group12.Backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TicketDTO {
    
    public static class PassengerInfo {
        private String name;
        private String surname;
        private String birthDate;
        private String email;
        private String phoneNo;
        
        // Constructors
        public PassengerInfo() {}
        
        public PassengerInfo(String name, String surname, String birthDate, String email, String phoneNo) {
            this.name = name;
            this.surname = surname;
            this.birthDate = birthDate;
            this.email = email;
            this.phoneNo = phoneNo;
        }
        
        // Getters and Setters
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getSurname() {
            return surname;
        }
        
        public void setSurname(String surname) {
            this.surname = surname;
        }
        
        public String getBirthDate() {
            return birthDate;
        }
        
        public void setBirthDate(String birthDate) {
            this.birthDate = birthDate;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getPhoneNo() {
            return phoneNo;
        }
        
        public void setPhoneNo(String phoneNo) {
            this.phoneNo = phoneNo;
        }
    }
    
    public static class TicketRequest {
        private Integer voyageId;
        private Integer passengerCount;
        private Integer totalPrice;
        private String ticketClass;
        private String selectedSeats;
        private String userId;
        private List<PassengerInfo> passengers;
        
        // Constructors
        public TicketRequest() {}
        
        public TicketRequest(Integer voyageId, Integer passengerCount, Integer totalPrice, 
                            String ticketClass, String selectedSeats, String userId, 
                            List<PassengerInfo> passengers) {
            this.voyageId = voyageId;
            this.passengerCount = passengerCount;
            this.totalPrice = totalPrice;
            this.ticketClass = ticketClass;
            this.selectedSeats = selectedSeats;
            this.userId = userId;
            this.passengers = passengers;
        }
        
        // Getters and Setters
        public Integer getVoyageId() {
            return voyageId;
        }
        
        public void setVoyageId(Integer voyageId) {
            this.voyageId = voyageId;
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
        
        public List<PassengerInfo> getPassengers() {
            return passengers;
        }
        
        public void setPassengers(List<PassengerInfo> passengers) {
            this.passengers = passengers;
        }
    }
    
    public static class TicketResponse {
        private Integer id;
        private String ticketID;
        private Integer voyageId;
        private Integer passengerCount;
        private Integer totalPrice;
        private String ticketClass;
        private String selectedSeats;
        private String userId;
        private List<PassengerInfo> passengers;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        // Constructors
        public TicketResponse() {}
        
        public TicketResponse(Integer id, String ticketID, Integer voyageId, Integer passengerCount,
                            Integer totalPrice, String ticketClass, String selectedSeats, String userId,
                            List<PassengerInfo> passengers, LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.ticketID = ticketID;
            this.voyageId = voyageId;
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
        
        public String getTicketID() {
            return ticketID;
        }
        
        public void setTicketID(String ticketID) {
            this.ticketID = ticketID;
        }
        
        public Integer getVoyageId() {
            return voyageId;
        }
        
        public void setVoyageId(Integer voyageId) {
            this.voyageId = voyageId;
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
        
        public List<PassengerInfo> getPassengers() {
            return passengers;
        }
        
        public void setPassengers(List<PassengerInfo> passengers) {
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
    
    public static class TicketUpdateRequest {
        private Integer passengerCount;
        private Integer totalPrice;
        private String ticketClass;
        private String selectedSeats;
        private List<PassengerInfo> passengers;
        
        // Constructors
        public TicketUpdateRequest() {}
        
        public TicketUpdateRequest(Integer passengerCount, Integer totalPrice, String ticketClass,
                                String selectedSeats, List<PassengerInfo> passengers) {
            this.passengerCount = passengerCount;
            this.totalPrice = totalPrice;
            this.ticketClass = ticketClass;
            this.selectedSeats = selectedSeats;
            this.passengers = passengers;
        }
        
        // Getters and Setters
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
        
        public List<PassengerInfo> getPassengers() {
            return passengers;
        }
        
        public void setPassengers(List<PassengerInfo> passengers) {
            this.passengers = passengers;
        }
    }
}