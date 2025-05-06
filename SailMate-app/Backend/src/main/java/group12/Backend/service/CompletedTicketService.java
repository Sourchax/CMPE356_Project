package group12.Backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import group12.Backend.dto.CompletedTicketDTO;
import group12.Backend.dto.TicketDTO;
import group12.Backend.entity.CompletedTicket;
import group12.Backend.repository.CompletedTicketRepository;
import group12.Backend.util.TicketPDFGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompletedTicketService {
    
    private final CompletedTicketRepository completedTicketRepository;
    private final ObjectMapper objectMapper;
    
    @Autowired
    public CompletedTicketService(CompletedTicketRepository completedTicketRepository, 
                                 ObjectMapper objectMapper) {
        this.completedTicketRepository = completedTicketRepository;
        this.objectMapper = objectMapper;
    }
    
    /**
     * Get all completed tickets
     * @return list of all completed tickets as DTO responses
     */
    public List<CompletedTicketDTO> getAllCompletedTickets() {
        return completedTicketRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Find a completed ticket by its ID
     * @param id the completed ticket ID
     * @return the completed ticket DTO if found
     */
    public Optional<CompletedTicketDTO> getCompletedTicketById(Integer id) {
        return completedTicketRepository.findById(id)
                .map(this::convertToDto);
    }
    
    /**
     * Find a completed ticket by its unique ticketId
     * @param ticketId the unique ticket identifier
     * @return the completed ticket DTO if found
     */
    public Optional<CompletedTicketDTO> getCompletedTicketByTicketId(String ticketId) {
        return completedTicketRepository.findByTicketId(ticketId)
                .map(this::convertToDto);
    }
    
    /**
     * Find completed tickets by user ID
     * @param userId the ID of the user
     * @return list of completed tickets belonging to the user
     */
    public List<CompletedTicketDTO> getCompletedTicketsByUserId(String userId) {
        return completedTicketRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Find completed tickets by voyage ID
     * @param voyageId the ID of the voyage
     * @return list of completed tickets for the voyage
     */
    public List<CompletedTicketDTO> getCompletedTicketsByVoyageId(Integer voyageId) {
        return completedTicketRepository.findByVoyageId(voyageId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Save a completed ticket
     * @param completedTicket the completed ticket entity to save
     * @return the saved completed ticket as a DTO
     */
    public CompletedTicketDTO saveCompletedTicket(CompletedTicket completedTicket) {
        CompletedTicket savedTicket = completedTicketRepository.save(completedTicket);
        return convertToDto(savedTicket);
    }
    
    /**
     * Get the total count of completed tickets
     * @return the count of completed tickets
     */
    public long getCompletedTicketCount() {
        return completedTicketRepository.count();
    }
    
    /**
     * Generate PDF bytes for a completed ticket
     * @param ticketId the ticket identifier
     * @return the PDF as a byte array
     * @throws Exception if ticket not found or PDF generation fails
     */
    public byte[] generateCompletedTicketPdfBytes(String ticketId) throws Exception {
        try {
            Optional<CompletedTicket> ticketOpt = completedTicketRepository.findByTicketId(ticketId);
            if (ticketOpt.isEmpty()) {
                throw new Exception("Completed ticket not found with ticket_id: " + ticketId);
            }
            
            CompletedTicket ticket = ticketOpt.get();
            String fromStation = ticket.getDepStationTitle();
            String toStation = ticket.getArrStationTitle();
            String departureDate = ticket.getDepDate().toString();
            String departureTime = ticket.getDepTime().toString();
            System.out.println("Raw JSON ticketData for completed ticket: " + ticket.getTicketData());
    
            // Deserialize the passenger list from JSON
            List<TicketDTO.PassengerInfo> passengers = objectMapper.readValue(
                ticket.getTicketData(),
                new com.fasterxml.jackson.core.type.TypeReference<List<TicketDTO.PassengerInfo>>() {}
            );
    
            // Prepare ticket data for PDF generation
            List<TicketPDFGenerator.TicketData> ticketDataList = new ArrayList<>();
            for (TicketDTO.PassengerInfo passenger : passengers) {
                TicketPDFGenerator.TicketData ticketData = new TicketPDFGenerator.TicketData();
                ticketData.ticketId = ticket.getTicketId();
                ticketData.passengerName = (passenger.getName() + " " + passenger.getSurname()).toUpperCase();
                ticketData.from = fromStation;
                ticketData.to = toStation;
                ticketData.date = departureDate;
                ticketData.time = departureTime;
                ticketData.seat = ticket.getSelectedSeats();
                ticketData.gate = "1";
                ticketData.boardTill = "Board 15m before";
                ticketData.ticketClass = ticket.getTicketClass().toUpperCase();
                ticketData.passengerType = passenger.getPassengerType() != null ? 
                                          passenger.getPassengerType().toUpperCase() : "ADULT";
                ticketDataList.add(ticketData);
            }
            
            // Generate the PDF bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            TicketPDFGenerator.generateTicketPdfBytes(outputStream, ticketDataList);
            return outputStream.toByteArray();
    
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Failed to generate completed ticket PDF: " + e.getMessage(), e);
        }
    }
    
    /**
     * Convert completed ticket entity to DTO
     * @param completedTicket the completed ticket entity
     * @return the completed ticket DTO
     */
    private CompletedTicketDTO convertToDto(CompletedTicket completedTicket) {
        try {
            // Convert JSON string to PassengerInfo list
            List<TicketDTO.PassengerInfo> passengers = objectMapper.readValue(
                    completedTicket.getTicketData(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, TicketDTO.PassengerInfo.class)
            );
            
            return new CompletedTicketDTO(
                    completedTicket.getId(),
                    completedTicket.getTicketId(),
                    completedTicket.getVoyageId(),
                    completedTicket.getDepCity(),
                    completedTicket.getDepStationTitle(),
                    completedTicket.getArrCity(),
                    completedTicket.getArrStationTitle(),
                    completedTicket.getDepDate(),
                    completedTicket.getDepTime(),
                    completedTicket.getArrTime(),
                    completedTicket.getShipType(),
                    completedTicket.getFuelType(),
                    completedTicket.getPassengerCount(),
                    completedTicket.getTotalPrice(),
                    completedTicket.getTicketClass(),
                    completedTicket.getSelectedSeats(),
                    completedTicket.getUserId(),
                    passengers,
                    completedTicket.getCreatedAt(),
                    completedTicket.getUpdatedAt()
            );
        } catch (JsonProcessingException e) {
            // Log error and return partial data if JSON processing fails
            System.err.println("Error parsing passenger data: " + e.getMessage());
            return new CompletedTicketDTO(
                    completedTicket.getId(),
                    completedTicket.getTicketId(),
                    completedTicket.getVoyageId(),
                    completedTicket.getDepCity(),
                    completedTicket.getDepStationTitle(),
                    completedTicket.getArrCity(),
                    completedTicket.getArrStationTitle(),
                    completedTicket.getDepDate(),
                    completedTicket.getDepTime(),
                    completedTicket.getArrTime(),
                    completedTicket.getShipType(),
                    completedTicket.getFuelType(),
                    completedTicket.getPassengerCount(),
                    completedTicket.getTotalPrice(),
                    completedTicket.getTicketClass(),
                    completedTicket.getSelectedSeats(),
                    completedTicket.getUserId(),
                    null,
                    completedTicket.getCreatedAt(),
                    completedTicket.getUpdatedAt()
            );
        }
    }
}