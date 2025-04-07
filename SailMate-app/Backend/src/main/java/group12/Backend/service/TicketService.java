package group12.Backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import group12.Backend.dto.NotificationDTO;
import group12.Backend.dto.TicketDTO;
import group12.Backend.entity.Ticket;
import group12.Backend.entity.Voyage;
import group12.Backend.entity.Notification;
import group12.Backend.repository.TicketRepository;
import group12.Backend.repository.VoyageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import group12.Backend.util.TicketPDFGenerator; // Import your generator
import java.io.ByteArrayOutputStream;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final VoyageRepository voyageRepository;
    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    @Autowired
    public TicketService(TicketRepository ticketRepository, 
                         VoyageRepository voyageRepository,
                         ObjectMapper objectMapper,
                         NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.voyageRepository = voyageRepository;
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
    }

    /**
     * Get all tickets
     * @return list of all tickets as DTO responses
     */
    public List<TicketDTO.TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Find a ticket by its ID
     * @param id the ticket ID
     * @return the ticket DTO if found
     */
    public Optional<TicketDTO.TicketResponse> getTicketById(Integer id) {
        return ticketRepository.findById(id)
                .map(this::convertToDto);
    }

    /**
     * Find tickets by user ID
     * @param userId the ID of the user
     * @return list of tickets belonging to the user
     */
    public List<TicketDTO.TicketResponse> getTicketsByUserId(String userId) {
        return ticketRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Find a ticket by its unique ticketID
     * @param ticketID the unique ticket identifier
     * @return the ticket DTO if found
     */
    public Optional<TicketDTO.TicketResponse> getTicketByTicketID(String ticketID) {
        return ticketRepository.findByTicketID(ticketID)
                .map(this::convertToDto);
    }

    /**
     * Create a new ticket
     * @param ticketRequest the ticket request DTO
     * @return the created ticket as a DTO response
     * @throws JsonProcessingException if there's an error processing JSON
     */
    @Transactional
    public TicketDTO.TicketResponse createTicket(TicketDTO.TicketRequest ticketRequest) throws JsonProcessingException {
        // Generate a unique ticket ID
        String ticketID = generateUniqueTicketId();
        
        // Convert passenger list to JSON
        String ticketData = objectMapper.writeValueAsString(ticketRequest.getPassengers());
        
        // Create ticket entity
        Ticket ticket = new Ticket(
                ticketID,
                ticketRequest.getVoyageId(),
                ticketRequest.getPassengerCount(),
                ticketRequest.getTotalPrice(),
                ticketRequest.getTicketClass(),
                ticketRequest.getSelectedSeats(),
                ticketRequest.getUserId(),
                ticketData
        );
        
        // Save ticket to database
        Ticket savedTicket = ticketRepository.save(ticket);
        
        // Create notification for ticket creation
        createTicketCreationNotification(savedTicket);
        
        // Convert and return as DTO
        return convertToDto(savedTicket);
    }

    /**
     * Update an existing ticket
     * @param id the ID of the ticket to update
     * @param updateRequest the ticket update request DTO
     * @return the updated ticket as a DTO response
     * @throws JsonProcessingException if there's an error processing JSON
     */
    @Transactional
    public Optional<TicketDTO.TicketResponse> updateTicket(Integer id, TicketDTO.TicketUpdateRequest updateRequest) 
            throws JsonProcessingException {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            
            // Track original values for notification
            Integer originalPassengerCount = ticket.getPassengerCount();
            Integer originalTotalPrice = ticket.getTotalPrice();
            String originalTicketClass = ticket.getTicketClass();
            String originalSelectedSeats = ticket.getSelectedSeats();
            String originalTicketData = ticket.getTicketData();
            
            // Track which fields have changed
            List<String> changedFields = new ArrayList<>();
            
            // Update fields if provided in the request
            if (updateRequest.getPassengerCount() != null && !originalPassengerCount.equals(updateRequest.getPassengerCount())) {
                ticket.setPassengerCount(updateRequest.getPassengerCount());
                changedFields.add("passenger count");
            }
            
            if (updateRequest.getTotalPrice() != null && !originalTotalPrice.equals(updateRequest.getTotalPrice())) {
                ticket.setTotalPrice(updateRequest.getTotalPrice());
                changedFields.add("total price");
            }
            
            if (updateRequest.getTicketClass() != null && !originalTicketClass.equals(updateRequest.getTicketClass())) {
                ticket.setTicketClass(updateRequest.getTicketClass());
                changedFields.add("ticket class");
            }
            
            if (updateRequest.getSelectedSeats() != null && !originalSelectedSeats.equals(updateRequest.getSelectedSeats())) {
                ticket.setSelectedSeats(updateRequest.getSelectedSeats());
                changedFields.add("seat selection");
            }
            
            if (updateRequest.getPassengers() != null) {
                String newTicketData = objectMapper.writeValueAsString(updateRequest.getPassengers());
                if (!originalTicketData.equals(newTicketData)) {
                    ticket.setTicketData(newTicketData);
                    changedFields.add("passenger information");
                }
            }
            
            // Save updated ticket
            Ticket updatedTicket = ticketRepository.save(ticket);
            
            // Create notification for ticket update if there were changes
            if (!changedFields.isEmpty()) {
                createTicketUpdateNotification(updatedTicket, changedFields);
            }
            
            return Optional.of(convertToDto(updatedTicket));
        }
        
        return Optional.empty();
    }

    /**
     * Delete a ticket by its ID
     * @param id the ID of the ticket to delete
     * @return true if the ticket was deleted, false if not found
     */
    @Transactional
    public boolean deleteTicket(Integer id) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            
            // Get voyage details for the notification
            Optional<Voyage> voyageOpt = voyageRepository.findById(ticket.getVoyageId());
            
            // Create notification for ticket deletion
            createTicketDeletionNotification(ticket, voyageOpt.orElse(null));
            
            ticketRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * Update voyage ID for a ticket and notify the user
     * @param ticketId the ID of the ticket to update
     * @param newVoyageId the new voyage ID
     * @return updated ticket as DTO if successful, empty optional otherwise
     */
    @Transactional
    public Optional<TicketDTO.TicketResponse> updateTicketVoyage(Integer ticketId, Integer newVoyageId) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        Optional<Voyage> voyageOpt = voyageRepository.findById(newVoyageId);
        
        if (ticketOpt.isPresent() && voyageOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            Voyage newVoyage = voyageOpt.get();
            
            // Store original voyage ID for notification
            Integer originalVoyageId = ticket.getVoyageId();
            
            // Update voyage ID
            ticket.setVoyageId(newVoyageId);
            
            // Save updated ticket
            Ticket updatedTicket = ticketRepository.save(ticket);
            
            // Create notification for voyage change
            createVoyageChangeNotification(updatedTicket, originalVoyageId, newVoyageId);
            
            return Optional.of(convertToDto(updatedTicket));
        }
        
        return Optional.empty();
    }

    /**
     * Generate a unique ticket ID
     * @return a unique identifier for the ticket
     */
    private String generateUniqueTicketId() {
        // Generate a UUID and take the first 8 characters
        return "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * Convert ticket entity to DTO response
     * @param ticket the ticket entity
     * @return the ticket DTO response
     */
    private TicketDTO.TicketResponse convertToDto(Ticket ticket) {
        try {
            // Convert JSON string to PassengerInfo list
            List<TicketDTO.PassengerInfo> passengers = objectMapper.readValue(
                    ticket.getTicketData(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, TicketDTO.PassengerInfo.class)
            );
            
            return new TicketDTO.TicketResponse(
                    ticket.getId(),
                    ticket.getTicketID(),
                    ticket.getVoyageId(),
                    ticket.getPassengerCount(),
                    ticket.getTotalPrice(),
                    ticket.getTicketClass(),
                    ticket.getSelectedSeats(),
                    ticket.getUserId(),
                    passengers,
                    ticket.getCreatedAt(),
                    ticket.getUpdatedAt()
            );
        } catch (JsonProcessingException e) {
            // Log error and return partial data if JSON processing fails
            System.err.println("Error parsing passenger data: " + e.getMessage());
            return new TicketDTO.TicketResponse(
                    ticket.getId(),
                    ticket.getTicketID(),
                    ticket.getVoyageId(),
                    ticket.getPassengerCount(),
                    ticket.getTotalPrice(),
                    ticket.getTicketClass(),
                    ticket.getSelectedSeats(),
                    ticket.getUserId(),
                    null,
                    ticket.getCreatedAt(),
                    ticket.getUpdatedAt()
            );
        }
    }
    
    /**
     * Create notification for ticket creation
     * @param ticket the created ticket
     */
    private void createTicketCreationNotification(Ticket ticket) {
        NotificationDTO.NotificationCreateRequest notificationRequest = new NotificationDTO.NotificationCreateRequest();
        notificationRequest.setUserId(ticket.getUserId());
        notificationRequest.setType(Notification.NotificationType.TICKET_CREATED);
        notificationRequest.setTitle("Ticket Purchased");
        
        // Get voyage details for a more informative message
        StringBuilder messageBuilder = new StringBuilder("Your ticket " + ticket.getTicketID() + " has been successfully purchased. ");
        
        Optional<Voyage> voyageOpt = voyageRepository.findById(ticket.getVoyageId());
        if (voyageOpt.isPresent()) {
            Voyage voyage = voyageOpt.get();
            messageBuilder.append("Voyage details: ")
                         .append(voyage.getFromStation().getTitle())
                         .append(" (")
                         .append(voyage.getFromStation().getCity())
                         .append(") to ")
                         .append(voyage.getToStation().getTitle())
                         .append(" (")
                         .append(voyage.getToStation().getCity())
                         .append(") on ")
                         .append(voyage.getDepartureDate())
                         .append(" at ")
                         .append(voyage.getDepartureTime())
                         .append(", ")
                         .append(ticket.getTicketClass())
                         .append(" class, ")
                         .append(ticket.getPassengerCount())
                         .append(" passenger(s), seats: ")
                         .append(ticket.getSelectedSeats());
        }
        
        notificationRequest.setMessage(messageBuilder.toString());
        notificationRequest.setEntityId(ticket.getTicketID());
        
        notificationService.createNotification(notificationRequest);
    }
    
    /**
     * Create notification for ticket update
     * @param ticket the updated ticket
     * @param changedFields list of fields that were changed
     */
    private void createTicketUpdateNotification(Ticket ticket, List<String> changedFields) {
        NotificationDTO.NotificationCreateRequest notificationRequest = new NotificationDTO.NotificationCreateRequest();
        notificationRequest.setUserId(ticket.getUserId());
        notificationRequest.setType(Notification.NotificationType.TICKET_UPDATED);
        notificationRequest.setTitle("Ticket Updated");
        
        // Format the list of changed fields
        String changedFieldsStr = String.join(", ", changedFields);
        
        // Get voyage details for a more informative message
        StringBuilder messageBuilder = new StringBuilder("Your ticket " + ticket.getTicketID() + " has been updated. ");
        
        Optional<Voyage> voyageOpt = voyageRepository.findById(ticket.getVoyageId());
        if (voyageOpt.isPresent()) {
            Voyage voyage = voyageOpt.get();
            messageBuilder.append("Current ticket details: ")
                         .append(voyage.getFromStation().getTitle())
                         .append(" to ")
                         .append(voyage.getToStation().getTitle())
                         .append(" on ")
                         .append(voyage.getDepartureDate())
                         .append(", ")
                         .append(ticket.getTicketClass())
                         .append(" class, ")
                         .append(ticket.getPassengerCount())
                         .append(" passenger(s), seats: ")
                         .append(ticket.getSelectedSeats());
        }
        
        notificationRequest.setMessage(messageBuilder.toString());
        notificationRequest.setEntityId(ticket.getTicketID());
        
        notificationService.createNotification(notificationRequest);
    }
    
    /**
     * Create notification for ticket deletion
     * @param ticket the deleted ticket
     * @param voyage the voyage associated with the ticket (can be null)
     */
    private void createTicketDeletionNotification(Ticket ticket, Voyage voyage) {
        NotificationDTO.NotificationCreateRequest notificationRequest = new NotificationDTO.NotificationCreateRequest();
        notificationRequest.setUserId(ticket.getUserId());
        notificationRequest.setType(Notification.NotificationType.TICKET_UPDATED);
        notificationRequest.setTitle("Ticket Cancelled");
        
        StringBuilder messageBuilder = new StringBuilder("Your ticket " + ticket.getTicketID() + " has been cancelled and is no longer valid. ");
        
        if (voyage != null) {
            messageBuilder.append("This ticket was for the voyage from ")
                         .append(voyage.getFromStation().getTitle())
                         .append(" (")
                         .append(voyage.getFromStation().getCity())
                         .append(") to ")
                         .append(voyage.getToStation().getTitle())
                         .append(" (")
                         .append(voyage.getToStation().getCity())
                         .append(") on ")
                         .append(voyage.getDepartureDate())
                         .append(" at ")
                         .append(voyage.getDepartureTime())
                         .append(".");
        }
        
        notificationRequest.setMessage(messageBuilder.toString());
        notificationRequest.setEntityId(ticket.getTicketID());
        
        notificationService.createNotification(notificationRequest);
    }
    
    /**
     * Create notification for voyage change
     * @param ticket the ticket with updated voyage
     * @param originalVoyageId the original voyage ID
     * @param newVoyageId the new voyage ID
     */
    private void createVoyageChangeNotification(Ticket ticket, Integer originalVoyageId, Integer newVoyageId) {
        Optional<Voyage> originalVoyageOpt = voyageRepository.findById(originalVoyageId);
        Optional<Voyage> newVoyageOpt = voyageRepository.findById(newVoyageId);
        
        NotificationDTO.NotificationCreateRequest notificationRequest = new NotificationDTO.NotificationCreateRequest();
        notificationRequest.setUserId(ticket.getUserId());
        notificationRequest.setType(Notification.NotificationType.TICKET_UPDATED);
        notificationRequest.setTitle("Voyage Changed");
        
        StringBuilder messageBuilder = new StringBuilder("Your ticket " + ticket.getTicketID() + " has been assigned to a different voyage. ");
        
        if (originalVoyageOpt.isPresent() && newVoyageOpt.isPresent()) {
            Voyage originalVoyage = originalVoyageOpt.get();
            Voyage newVoyage = newVoyageOpt.get();
            
            messageBuilder.append("Original voyage: ")
                          .append(originalVoyage.getFromStation().getTitle())
                          .append(" (")
                          .append(originalVoyage.getFromStation().getCity())
                          .append(") to ")
                          .append(originalVoyage.getToStation().getTitle())
                          .append(" (")
                          .append(originalVoyage.getToStation().getCity())
                          .append(") on ")
                          .append(originalVoyage.getDepartureDate())
                          .append(" at ")
                          .append(originalVoyage.getDepartureTime())
                          .append(". New voyage: ")
                          .append(newVoyage.getFromStation().getTitle())
                          .append(" (")
                          .append(newVoyage.getFromStation().getCity())
                          .append(") to ")
                          .append(newVoyage.getToStation().getTitle())
                          .append(" (")
                          .append(newVoyage.getToStation().getCity())
                          .append(") on ")
                          .append(newVoyage.getDepartureDate())
                          .append(" at ")
                          .append(newVoyage.getDepartureTime())
                          .append(".");
            
            // Add a warning if the dates are different
            if (!originalVoyage.getDepartureDate().equals(newVoyage.getDepartureDate())) {
                messageBuilder.append(" Please note the change in date!");
            }
        }
        
        notificationRequest.setMessage(messageBuilder.toString());
        notificationRequest.setEntityId(ticket.getTicketID());
        
        notificationService.createNotification(notificationRequest);
    }
    public byte[] generateTicketPdfBytes(String ticketId) throws Exception {
        Optional<Ticket> ticketOpt = ticketRepository.findByTicketID(ticketId);
        if (ticketOpt.isEmpty()) {
            throw new Exception("Ticket not found with ticket_id: " + ticketId);
        }
    
        Ticket ticket = ticketOpt.get();
    
        // Deserialize passenger info
        TicketDTO.PassengerInfo passenger = objectMapper
            .readValue(ticket.getTicketData(), TicketDTO.PassengerInfo[].class)[0];
    
        TicketPDFGenerator.TicketData ticketData = new TicketPDFGenerator.TicketData();
        ticketData.ticketId = ticket.getTicketID();
        ticketData.passengerName = passenger.getName() + " " + passenger.getSurname();
        ticketData.from = "FROM";
        ticketData.to = "TO";
        ticketData.date = ticket.getCreatedAt().toLocalDate().toString();
        ticketData.time = ticket.getCreatedAt().toLocalTime().toString();
        ticketData.seat = ticket.getSelectedSeats();
        ticketData.gate = "1";
        ticketData.boardTill = "Board 15m before";
        ticketData.ticketClass = ticket.getTicketClass();
    
        // Generate the PDF in memory
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        TicketPDFGenerator.generateTicketPdfBytes(outputStream, List.of(ticketData));
        return outputStream.toByteArray();
    }
    
}