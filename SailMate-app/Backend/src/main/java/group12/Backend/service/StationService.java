package group12.Backend.service;

import group12.Backend.dto.NotificationDTO;
import group12.Backend.dto.StationDTO;
import group12.Backend.entity.Notification;
import group12.Backend.entity.Station;
import group12.Backend.entity.Ticket;
import group12.Backend.entity.Voyage;
import group12.Backend.repository.StationRepository;
import group12.Backend.repository.TicketRepository;
import group12.Backend.repository.VoyageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StationService {
    
    private final StationRepository stationRepository;
    private final VoyageRepository voyageRepository;
    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;
    
    @Autowired
    public StationService(StationRepository stationRepository, 
                          VoyageRepository voyageRepository,
                          TicketRepository ticketRepository,
                          NotificationService notificationService) {
        this.stationRepository = stationRepository;
        this.voyageRepository = voyageRepository;
        this.ticketRepository = ticketRepository;
        this.notificationService = notificationService;
    }
    
    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }
    
    public List<Station> getActiveStations() {
        return stationRepository.findByStatus(Station.Status.active);
    }

    public List<String> getAllActiveStationTitles() {
        // Get only the titles of active stations for the dropdowns
        return stationRepository.findByStatus(Station.Status.active).stream()
                .map(Station::getTitle)
                .collect(Collectors.toList());
    }
    
    public Map<String, String> getStationLocations() {
        // Create a map with station title as key and city as value
        // This is useful for showing location info in dropdowns
        Map<String, String> locations = new HashMap<>();
        stationRepository.findByStatus(Station.Status.active).forEach(station -> {
            locations.put(station.getTitle(), station.getCity());
        });
        return locations;
    }
    
    public Optional<Station> getStationById(Integer id) {
        return stationRepository.findById(id);
    }
    
    public List<Station> getStationsByCity(String city) {
        return stationRepository.findByCity(city);
    }
    
    public List<Station> getStationsByStatus(Station.Status status) {
        return stationRepository.findByStatus(status);
    }
    
    public List<Station> getStationsByCityAndStatus(String city, Station.Status status) {
        return stationRepository.findByCityAndStatus(city, status);
    }
    
    @Transactional
    public Station saveStation(Station station) {
        return stationRepository.save(station);
    }
    
    @Transactional
    public Station updateStation(Integer id, Station stationDetails) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found with id: " + id));
        
        // Track station changes
        String originalTitle = station.getTitle();
        String originalCity = station.getCity();
        String originalAddress = station.getAddress();
        String originalPersonnel = station.getPersonnel();
        String originalPhoneno = station.getPhoneno();
        Station.Status originalStatus = station.getStatus();
        
        // List to track what changed
        List<String> changedFields = new ArrayList<>();
        
        // Update station attributes
        if (!originalTitle.equals(stationDetails.getTitle())) {
            station.setTitle(stationDetails.getTitle());
            changedFields.add("title");
        }
        
        if (!originalCity.equals(stationDetails.getCity())) {
            station.setCity(stationDetails.getCity());
            changedFields.add("city");
        }
        
        if (!originalPersonnel.equals(stationDetails.getPersonnel())) {
            station.setPersonnel(stationDetails.getPersonnel());
            changedFields.add("personnel");
        }
        
        if (!originalPhoneno.equals(stationDetails.getPhoneno())) {
            station.setPhoneno(stationDetails.getPhoneno());
            changedFields.add("phone number");
        }
        
        if (!originalAddress.equals(stationDetails.getAddress())) {
            station.setAddress(stationDetails.getAddress());
            changedFields.add("address");
        }
        
        if (originalStatus != stationDetails.getStatus()) {
            station.setStatus(stationDetails.getStatus());
            changedFields.add("status");
            
            // Special handling if station is deactivated
            if (stationDetails.getStatus() == Station.Status.inactive || 
                stationDetails.getStatus() == Station.Status.maintenance) {
                notifyStationStatusChange(station, originalStatus, stationDetails.getStatus());
            }
        }
        
        // Save the station
        Station savedStation = stationRepository.save(station);
        
        // If important fields changed (title or city), notify affected users
        if (changedFields.contains("title") || changedFields.contains("city")) {
            notifyStationChange(savedStation, originalTitle, originalCity, changedFields);
        }
        
        return savedStation;
    }
    
    @Transactional
    public void deleteStation(Integer id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found with id: " + id));
        
        // Find voyages that reference this station
        List<Voyage> departureVoyages = voyageRepository.findByFromStation_Id(station.getId());
        List<Voyage> arrivalVoyages = voyageRepository.findByToStation_Id(station.getId());
        
        // Before deleting, notify users that will be affected
        notifyStationDeletion(station);
        
        // Mark voyages as cancelled
        for (Voyage voyage : departureVoyages) {
            voyage.setStatus(Voyage.VoyageStatus.cancel);
        }
        
        for (Voyage voyage : arrivalVoyages) {
            voyage.setStatus(Voyage.VoyageStatus.cancel);
        }
        
        // Save changes to voyages before deleting the station
        voyageRepository.saveAll(departureVoyages);
        voyageRepository.saveAll(arrivalVoyages);
        
        // Delete voyages that reference this station
        // This breaks the reference chain
        voyageRepository.deleteAll(departureVoyages);
        voyageRepository.deleteAll(arrivalVoyages);
        
        // Now we can safely delete the station
        stationRepository.deleteById(id);
    }
    
    public boolean existsById(Integer id) {
        return stationRepository.existsById(id);
    }

    // Get count of all stations
    public long getStationCount() {
        return stationRepository.count();
    }
    
    /**
     * Notify users about station changes that affect their voyages/tickets
     */
    private void notifyStationChange(Station station, String originalTitle, String originalCity, List<String> changedFields) {
        // Find voyages involving this station
        List<Voyage> departureVoyages = voyageRepository.findByFromStation_Id(station.getId());
        List<Voyage> arrivalVoyages = voyageRepository.findByToStation_Id(station.getId());
        
        // Combine the lists and find unique affected voyages
        Set<Voyage> affectedVoyages = new HashSet<>();
        affectedVoyages.addAll(departureVoyages);
        affectedVoyages.addAll(arrivalVoyages);
        
        // If no voyages are affected, no need to notify anyone
        if (affectedVoyages.isEmpty()) {
            return;
        }
        
        // Format which fields were changed
        String changedFieldsStr = String.join(", ", changedFields);
        
        // For each voyage, find tickets and notify their owners
        Set<String> alreadyNotifiedUserIds = new HashSet<>(); // To avoid duplicate notifications
        
        for (Voyage voyage : affectedVoyages) {
            List<Ticket> affectedTickets = ticketRepository.findByVoyageId(voyage.getId());
            
            for (Ticket ticket : affectedTickets) {
                // Skip if we already notified this user
                if (alreadyNotifiedUserIds.contains(ticket.getUserId())) {
                    continue;
                }
                
                String stationType;
                String oldLocation;
                String newLocation;
                
                // Check if station is departure or arrival point
                if (departureVoyages.contains(voyage)) {
                    stationType = "Departure";
                    oldLocation = originalTitle + " (" + originalCity + ")";
                    newLocation = station.getTitle() + " (" + station.getCity() + ")";
                } else {
                    stationType = "Arrival";
                    oldLocation = originalTitle + " (" + originalCity + ")";
                    newLocation = station.getTitle() + " (" + station.getCity() + ")";
                }
                
                NotificationDTO.NotificationCreateRequest notificationRequest = new NotificationDTO.NotificationCreateRequest();
                notificationRequest.setUserId(ticket.getUserId());
                notificationRequest.setType(Notification.NotificationType.VOYAGE_DELAYED);
                notificationRequest.setTitle("Station Updated");
                
                // Create a shorter message
                String message = String.format(
                    "%s station updated. %s changed: %s to %s. Ticket %s affected.",
                    stationType,
                    changedFieldsStr,
                    oldLocation,
                    newLocation,
                    ticket.getTicketID()
                );
                
                notificationRequest.setMessage(message);
                notificationRequest.setEntityId(ticket.getTicketID());
                
                notificationService.createNotification(notificationRequest);
                
                // Mark this user as notified
                alreadyNotifiedUserIds.add(ticket.getUserId());
            }
        }
    }
    
    /**
     * Notify users about station status changes (inactive or maintenance)
     */
    private void notifyStationStatusChange(Station station, Station.Status originalStatus, Station.Status newStatus) {
        // Find voyages involving this station that are active
        List<Voyage> departureVoyages = voyageRepository.findByFromStation_Id(station.getId())
                .stream()
                .filter(v -> v.getStatus() == Voyage.VoyageStatus.active)
                .collect(Collectors.toList());
                
        List<Voyage> arrivalVoyages = voyageRepository.findByToStation_Id(station.getId())
                .stream()
                .filter(v -> v.getStatus() == Voyage.VoyageStatus.active)
                .collect(Collectors.toList());
        
        // Combine the lists and find unique affected voyages
        Set<Voyage> affectedVoyages = new HashSet<>();
        affectedVoyages.addAll(departureVoyages);
        affectedVoyages.addAll(arrivalVoyages);
        
        // If no voyages are affected, no need to notify anyone
        if (affectedVoyages.isEmpty()) {
            return;
        }
        
        // For each voyage, find tickets and notify their owners
        Set<String> alreadyNotifiedUserIds = new HashSet<>(); // To avoid duplicate notifications
        
        for (Voyage voyage : affectedVoyages) {
            List<Ticket> affectedTickets = ticketRepository.findByVoyageId(voyage.getId());
            
            for (Ticket ticket : affectedTickets) {
                // Skip if we already notified this user
                if (alreadyNotifiedUserIds.contains(ticket.getUserId())) {
                    continue;
                }
                
                String stationType = departureVoyages.contains(voyage) ? "departure" : "arrival";
                
                NotificationDTO.NotificationCreateRequest notificationRequest = new NotificationDTO.NotificationCreateRequest();
                notificationRequest.setUserId(ticket.getUserId());
                notificationRequest.setType(Notification.NotificationType.VOYAGE_DELAYED);
                notificationRequest.setTitle("Station Status Changed");
                
                String statusString = newStatus == Station.Status.inactive ? "inactive" : "under maintenance";
                
                // Create a shorter message
                String message = String.format(
                    "%s station %s is now %s. May affect voyage on %s. Ticket %s. Contact support.",
                    stationType,
                    station.getTitle(),
                    statusString,
                    voyage.getDepartureDate(),
                    ticket.getTicketID()
                );
                
                notificationRequest.setMessage(message);
                notificationRequest.setEntityId(ticket.getTicketID());
                
                notificationService.createNotification(notificationRequest);
                
                // Mark this user as notified
                alreadyNotifiedUserIds.add(ticket.getUserId());
            }
        }
    }
    
    /**
     * Notify users about station deletion
     */
    private void notifyStationDeletion(Station station) {
        // Find voyages involving this station
        List<Voyage> departureVoyages = voyageRepository.findByFromStation_Id(station.getId());
        List<Voyage> arrivalVoyages = voyageRepository.findByToStation_Id(station.getId());
        
        // Combine the lists and find unique affected voyages
        Set<Voyage> affectedVoyages = new HashSet<>();
        affectedVoyages.addAll(departureVoyages);
        affectedVoyages.addAll(arrivalVoyages);
        
        // If no voyages are affected, no need to notify anyone
        if (affectedVoyages.isEmpty()) {
            return;
        }
        
        // For each voyage, find tickets and notify their owners
        Set<String> alreadyNotifiedUserIds = new HashSet<>(); // To avoid duplicate notifications
        
        for (Voyage voyage : affectedVoyages) {
            List<Ticket> affectedTickets = ticketRepository.findByVoyageId(voyage.getId());
            
            for (Ticket ticket : affectedTickets) {
                // Skip if we already notified this user
                if (alreadyNotifiedUserIds.contains(ticket.getUserId())) {
                    continue;
                }
                
                String stationType = departureVoyages.contains(voyage) ? "departure" : "arrival";
                
                NotificationDTO.NotificationCreateRequest notificationRequest = new NotificationDTO.NotificationCreateRequest();
                notificationRequest.setUserId(ticket.getUserId());
                notificationRequest.setType(Notification.NotificationType.VOYAGE_CANCELLED);
                notificationRequest.setTitle("Station Removed");
                
                // Create a shorter message
                String message = String.format(
                    "Station %s removed. Voyage on %s cancelled. Ticket %s invalid. Contact support.",
                    station.getTitle(),
                    voyage.getDepartureDate(),
                    ticket.getTicketID()
                );
                
                notificationRequest.setMessage(message);
                notificationRequest.setEntityId(ticket.getTicketID());
                
                notificationService.createNotification(notificationRequest);
                
                // Mark this user as notified
                alreadyNotifiedUserIds.add(ticket.getUserId());
            }
        }
    }
}