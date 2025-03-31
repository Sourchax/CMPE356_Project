package group12.Backend.service;

import group12.Backend.dto.NotificationDTO;
import group12.Backend.dto.VoyageDTO;
import group12.Backend.entity.Notification;
import group12.Backend.entity.Station;
import group12.Backend.entity.Ticket;
import group12.Backend.entity.Voyage;
import group12.Backend.repository.StationRepository;
import group12.Backend.repository.TicketRepository;
import group12.Backend.repository.VoyageRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VoyageService {
    
    @Autowired
    private VoyageRepository voyageRepository;
    
    @Autowired
    private StationRepository stationRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    // Get all voyages
    public List<VoyageDTO> getAllVoyages() {
        return voyageRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get all future voyages
    public List<VoyageDTO> getAllFutureVoyages() {
        return voyageRepository.findAllFutureVoyages().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get voyage by ID
    public VoyageDTO getVoyageById(Integer id) {
        Optional<Voyage> voyage = voyageRepository.findById(id);
        return voyage.map(this::convertToDTO).orElse(null);
    }
    
    // Find voyages by from station, to station and departure date
    public List<VoyageDTO> findVoyages(Integer fromStationId, Integer toStationId, LocalDate departureDate) {
        return voyageRepository.findByFromStation_IdAndToStation_IdAndDepartureDate(
                fromStationId, toStationId, departureDate).stream()
                .filter(v -> v.getStatus() == Voyage.VoyageStatus.active)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Create a new voyage
    @Transactional
    public VoyageDTO createVoyage(VoyageDTO voyageDTO) {
        Voyage voyage = convertToEntity(voyageDTO);
        Voyage savedVoyage = voyageRepository.save(voyage);
        return convertToDTO(savedVoyage);
    }

    public Optional<Voyage> getVoyageEntityById(Integer id) {
        return voyageRepository.findById(id);
    }
    
    // Create multiple voyages at once
    @Transactional
    public int createBulkVoyages(List<VoyageDTO> voyageDTOs) {
        List<Voyage> voyages = voyageDTOs.stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());
        
        List<Voyage> savedVoyages = voyageRepository.saveAll(voyages);
        return savedVoyages.size();
    }
    
    // Update a voyage
    @Transactional
    public VoyageDTO updateVoyage(Integer id, VoyageDTO voyageDTO) {
        Optional<Voyage> existingVoyage = voyageRepository.findById(id);
        
        if (existingVoyage.isPresent()) {
            Voyage voyage = existingVoyage.get();
            
            // Store original values for change tracking
            LocalDate originalDepartureDate = voyage.getDepartureDate();
            LocalTime originalDepartureTime = voyage.getDepartureTime();
            LocalTime originalArrivalTime = voyage.getArrivalTime();
            String originalFromStationTitle = voyage.getFromStation().getTitle();
            String originalFromStationCity = voyage.getFromStation().getCity();
            String originalToStationTitle = voyage.getToStation().getTitle();
            String originalToStationCity = voyage.getToStation().getCity();
            Voyage.VoyageStatus originalStatus = voyage.getStatus();
            String originalShipType = voyage.getShipType();
            Boolean originalFuelType = voyage.getFuelType();
            
            // Track which fields have changed
            List<String> changedFields = new ArrayList<>();
            
            // Update fields from DTO
            if (voyageDTO.getFromStationId() != null) {
                Station fromStation = stationRepository.findById(voyageDTO.getFromStationId())
                        .orElseThrow(() -> new IllegalArgumentException("From station not found"));
                
                if (!originalFromStationTitle.equals(fromStation.getTitle())) {
                    changedFields.add("departure station title");
                }
                
                if (!originalFromStationCity.equals(fromStation.getCity())) {
                    changedFields.add("departure city");
                }
                
                voyage.setFromStation(fromStation);
            }
            
            if (voyageDTO.getToStationId() != null) {
                Station toStation = stationRepository.findById(voyageDTO.getToStationId())
                        .orElseThrow(() -> new IllegalArgumentException("To station not found"));
                
                if (!originalToStationTitle.equals(toStation.getTitle())) {
                    changedFields.add("arrival station title");
                }
                
                if (!originalToStationCity.equals(toStation.getCity())) {
                    changedFields.add("arrival city");
                }
                
                voyage.setToStation(toStation);
            }
            
            if (voyageDTO.getDepartureDate() != null && !originalDepartureDate.equals(voyageDTO.getDepartureDate())) {
                voyage.setDepartureDate(voyageDTO.getDepartureDate());
                changedFields.add("departure date");
            }
            
            if (voyageDTO.getDepartureTime() != null && !originalDepartureTime.equals(voyageDTO.getDepartureTime())) {
                voyage.setDepartureTime(voyageDTO.getDepartureTime());
                changedFields.add("departure time");
            }
            
            if (voyageDTO.getArrivalTime() != null && !originalArrivalTime.equals(voyageDTO.getArrivalTime())) {
                voyage.setArrivalTime(voyageDTO.getArrivalTime());
                changedFields.add("arrival time");
            }
            
            if (voyageDTO.getStatus() != null && originalStatus != voyageDTO.getStatus()) {
                voyage.setStatus(voyageDTO.getStatus());
                changedFields.add("status");
                
                // Special handling for cancellation
                if (voyageDTO.getStatus() == Voyage.VoyageStatus.cancel) {
                    notifyVoyageCancellation(voyage);
                    // Return early since we've already sent cancellation notifications
                    return convertToDTO(voyageRepository.save(voyage));
                }
            }
            
            if (voyageDTO.getShipType() != null && !originalShipType.equals(voyageDTO.getShipType())) {
                voyage.setShipType(voyageDTO.getShipType());
                changedFields.add("ship type");
            }
            
            if (voyageDTO.getFuelType() != null && !originalFuelType.equals(voyageDTO.getFuelType())) {
                voyage.setFuelType(voyageDTO.getFuelType());
                changedFields.add("fuel type");
            }
            
            if (voyageDTO.getBusinessSeats() != null) {
                voyage.setBusinessSeats(voyageDTO.getBusinessSeats());
            }
            
            if (voyageDTO.getPromoSeats() != null) {
                voyage.setPromoSeats(voyageDTO.getPromoSeats());
            }
            
            if (voyageDTO.getEconomySeats() != null) {
                voyage.setEconomySeats(voyageDTO.getEconomySeats());
            }
            
            // Save the updated voyage
            Voyage updatedVoyage = voyageRepository.save(voyage);
            
            // Notify affected users if there are changes
            if (!changedFields.isEmpty()) {
                notifyVoyageChanges(updatedVoyage, changedFields);
            }
            
            return convertToDTO(updatedVoyage);
        }
        
        return null;
    }
    
    // Cancel a voyage
    @Transactional
    public boolean cancelVoyage(Integer id) {
        Optional<Voyage> voyage = voyageRepository.findById(id);
        
        if (voyage.isPresent()) {
            Voyage v = voyage.get();
            v.setStatus(Voyage.VoyageStatus.cancel);
            voyageRepository.save(v);
            
            // Notify users with tickets for this voyage
            notifyVoyageCancellation(v);
            
            return true;
        }
        
        return false;
    }
    
    // Cancel voyages by route and date range
    @Transactional
    public int cancelVoyagesByRoute(Integer fromStationId, Integer toStationId, LocalDate startDate, LocalDate endDate) {
        List<Voyage> voyagesToCancel = voyageRepository.findByFromStation_IdAndToStation_Id(fromStationId, toStationId)
                .stream()
                .filter(v -> v.getStatus() == Voyage.VoyageStatus.active)
                .filter(v -> !v.getDepartureDate().isBefore(startDate) && !v.getDepartureDate().isAfter(endDate))
                .collect(Collectors.toList());
                
        for (Voyage voyage : voyagesToCancel) {
            voyage.setStatus(Voyage.VoyageStatus.cancel);
            
            // Notify users with tickets for this voyage
            notifyVoyageCancellation(voyage);
        }
        
        voyageRepository.saveAll(voyagesToCancel);
        return voyagesToCancel.size();
    }
    
    // Delete a voyage
    @Transactional
    public boolean deleteVoyage(Integer id) {
        Optional<Voyage> voyage = voyageRepository.findById(id);
        
        if (voyage.isPresent()) {
            Voyage v = voyage.get();
            
            // Notify users with tickets for this voyage
            notifyVoyageCancellation(v);
            
            voyageRepository.delete(v);
            return true;
        }
        
        return false;
    }
    
    // Get voyages by date range
    public List<VoyageDTO> getVoyagesByDateRange(LocalDate startDate, LocalDate endDate) {
        return voyageRepository.findByDepartureDateBetween(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get voyages by departure station
    public List<VoyageDTO> getVoyagesByDepartureStation(Integer stationId) {
        return voyageRepository.findByFromStation_Id(stationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get voyages by arrival station
    public List<VoyageDTO> getVoyagesByArrivalStation(Integer stationId) {
        return voyageRepository.findByToStation_Id(stationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get voyages by station (either departure or arrival)
    public List<VoyageDTO> getVoyagesByStation(Integer stationId) {
        return voyageRepository.findByStationId(stationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public int countActiveVoyages() {
        return voyageRepository.countByStatus(Voyage.VoyageStatus.active);
    }
    
    // Convert Voyage entity to VoyageDTO
    private VoyageDTO convertToDTO(Voyage voyage) {
        VoyageDTO dto = new VoyageDTO();
        
        dto.setId(voyage.getId());
        
        dto.setFromStationId(voyage.getFromStation().getId());
        dto.setFromStationCity(voyage.getFromStation().getCity());
        dto.setFromStationTitle(voyage.getFromStation().getTitle());
        
        dto.setToStationId(voyage.getToStation().getId());
        dto.setToStationCity(voyage.getToStation().getCity());
        dto.setToStationTitle(voyage.getToStation().getTitle());
        
        dto.setDepartureDate(voyage.getDepartureDate());
        dto.setDepartureTime(voyage.getDepartureTime());
        dto.setArrivalTime(voyage.getArrivalTime());
        dto.setStatus(voyage.getStatus());
        dto.setShipType(voyage.getShipType());
        dto.setFuelType(voyage.getFuelType());
        dto.setBusinessSeats(voyage.getBusinessSeats());
        dto.setPromoSeats(voyage.getPromoSeats());
        dto.setEconomySeats(voyage.getEconomySeats());
        dto.setCreatedAt(voyage.getCreatedAt());
        dto.setUpdatedAt(voyage.getUpdatedAt());
        
        return dto;
    }
    
    // Convert VoyageDTO to Voyage entity
    private Voyage convertToEntity(VoyageDTO dto) {
        Voyage voyage = new Voyage();
        
        if (dto.getId() != null) {
            voyage.setId(dto.getId());
        }
        
        Station fromStation = stationRepository.findById(dto.getFromStationId())
                .orElseThrow(() -> new IllegalArgumentException("From station not found"));
        voyage.setFromStation(fromStation);
        
        Station toStation = stationRepository.findById(dto.getToStationId())
                .orElseThrow(() -> new IllegalArgumentException("To station not found"));
        voyage.setToStation(toStation);
        
        voyage.setDepartureDate(dto.getDepartureDate());
        voyage.setDepartureTime(dto.getDepartureTime());
        voyage.setArrivalTime(dto.getArrivalTime());
        
        if (dto.getStatus() != null) {
            voyage.setStatus(dto.getStatus());
        }
        
        voyage.setShipType(dto.getShipType());
        
        if (dto.getFuelType() != null) {
            voyage.setFuelType(dto.getFuelType());
        }
        
        voyage.setBusinessSeats(dto.getBusinessSeats());
        voyage.setPromoSeats(dto.getPromoSeats());
        voyage.setEconomySeats(dto.getEconomySeats());
        
        return voyage;
    }
    
    // Notify users about voyage cancellation
    private void notifyVoyageCancellation(Voyage voyage) {
        List<Ticket> affectedTickets = ticketRepository.findByVoyageId(voyage.getId());
        
        for (Ticket ticket : affectedTickets) {
            NotificationDTO.NotificationCreateRequest notificationRequest = new NotificationDTO.NotificationCreateRequest();
            notificationRequest.setUserId(ticket.getUserId());
            notificationRequest.setType(Notification.NotificationType.VOYAGE_CANCELLED);
            notificationRequest.setTitle("Voyage Cancelled");
            
            String message = String.format(
                "Your voyage from %s (%s) to %s (%s) on %s has been cancelled. Your ticket %s is affected. Please contact customer support for assistance.",
                voyage.getFromStation().getTitle(),
                voyage.getFromStation().getCity(),
                voyage.getToStation().getTitle(),
                voyage.getToStation().getCity(),
                voyage.getDepartureDate(),
                ticket.getTicketID()
            );
            
            notificationRequest.setMessage(message);
            notificationRequest.setEntityId(ticket.getTicketID());
            
            notificationService.createNotification(notificationRequest);
        }
    }
    
    // Notify users about voyage changes
    private void notifyVoyageChanges(Voyage voyage, List<String> changedFields) {
        List<Ticket> affectedTickets = ticketRepository.findByVoyageId(voyage.getId());
        
        if (affectedTickets.isEmpty()) {
            return;  // No tickets affected, so no notifications needed
        }
        
        // Format changed fields for notification message
        String changedFieldsStr = String.join(", ", changedFields);
        
        for (Ticket ticket : affectedTickets) {
            NotificationDTO.NotificationCreateRequest notificationRequest = new NotificationDTO.NotificationCreateRequest();
            notificationRequest.setUserId(ticket.getUserId());
            notificationRequest.setType(Notification.NotificationType.VOYAGE_DELAYED);
            notificationRequest.setTitle("Voyage Update");
            
            String message = String.format(
                "Your voyage from %s (%s) to %s (%s) on %s at %s has been updated. Changes were made to: %s. Your ticket %s is affected.",
                voyage.getFromStation().getTitle(),
                voyage.getFromStation().getCity(),
                voyage.getToStation().getTitle(),
                voyage.getToStation().getCity(),
                voyage.getDepartureDate(),
                voyage.getDepartureTime(),
                changedFieldsStr,
                ticket.getTicketID()
            );
            
            notificationRequest.setMessage(message);
            notificationRequest.setEntityId(ticket.getTicketID());
            
            notificationService.createNotification(notificationRequest);
        }
    }
}