package group12.Backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import group12.Backend.dto.TicketDTO;
import group12.Backend.entity.Ticket;
import group12.Backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public TicketService(TicketRepository ticketRepository, ObjectMapper objectMapper) {
        this.ticketRepository = ticketRepository;
        this.objectMapper = objectMapper;
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
            
            // Update fields if provided in the request
            if (updateRequest.getPassengerCount() != null) {
                ticket.setPassengerCount(updateRequest.getPassengerCount());
            }
            
            if (updateRequest.getTotalPrice() != null) {
                ticket.setTotalPrice(updateRequest.getTotalPrice());
            }
            
            if (updateRequest.getTicketClass() != null) {
                ticket.setTicketClass(updateRequest.getTicketClass());
            }
            
            if (updateRequest.getSelectedSeats() != null) {
                ticket.setSelectedSeats(updateRequest.getSelectedSeats());
            }
            
            if (updateRequest.getPassengers() != null) {
                ticket.setTicketData(objectMapper.writeValueAsString(updateRequest.getPassengers()));
            }
            
            // Save updated ticket
            Ticket updatedTicket = ticketRepository.save(ticket);
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
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return true;
        }
        return false;
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
}