package group12.Backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import group12.Backend.dto.TicketDTO;
import group12.Backend.service.TicketService;
import group12.Backend.service.VoyageService;
import group12.Backend.entity.Voyage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;
    private final VoyageService voyageService;

    @Autowired
    public TicketController(TicketService ticketService, VoyageService voyageService) {
        this.ticketService = ticketService;
        this.voyageService = voyageService;
    }

    /**
     * Get all tickets
     * @return ResponseEntity with all tickets
     */
    @GetMapping
    public ResponseEntity<List<TicketDTO.TicketResponse>> getAllTickets() {
        List<TicketDTO.TicketResponse> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO.TicketResponse> getTicketById(@PathVariable Integer id) {
        Optional<TicketDTO.TicketResponse> ticket = ticketService.getTicketById(id);
        
        if (ticket.isPresent()) {
            TicketDTO.TicketResponse ticketResponse = ticket.get();
            
            // Try to enrich with voyage information
            try {
                enrichTicketWithVoyageInfo(ticketResponse);
            } catch (Exception e) {
                // Log the error but still return the basic ticket
                System.err.println("Error enriching ticket with voyage info: " + e.getMessage());
            }
            
            return ResponseEntity.ok(ticketResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketDTO.TicketResponse>> getTicketsByUserId(@PathVariable String userId) {
        List<TicketDTO.TicketResponse> tickets = ticketService.getTicketsByUserId(userId);
        
        // Try to enrich each ticket with voyage information
        for (TicketDTO.TicketResponse ticket : tickets) {
            try {
                enrichTicketWithVoyageInfo(ticket);
            } catch (Exception e) {
                // Log the error but continue with the next ticket
                System.err.println("Error enriching ticket with voyage info: " + e.getMessage());
            }
        }
        
        return ResponseEntity.ok(tickets);
    }


    @GetMapping("/ticketID/{ticketID}")
    public ResponseEntity<TicketDTO.TicketResponse> getTicketByTicketID(@PathVariable String ticketID) {
        Optional<TicketDTO.TicketResponse> ticket = ticketService.getTicketByTicketID(ticketID);
        
        if (ticket.isPresent()) {
            TicketDTO.TicketResponse ticketResponse = ticket.get();
            
            // Try to enrich with voyage information
            try {
                enrichTicketWithVoyageInfo(ticketResponse);
            } catch (Exception e) {
                // Log the error but still return the basic ticket
                System.err.println("Error enriching ticket with voyage info: " + e.getMessage());
            }
            
            return ResponseEntity.ok(ticketResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody TicketDTO.TicketRequest ticketRequest) {
        try {
            TicketDTO.TicketResponse createdTicket = ticketService.createTicket(ticketRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error processing passenger data: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating ticket: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable Integer id, @RequestBody TicketDTO.TicketUpdateRequest updateRequest) {
        try {
            Optional<TicketDTO.TicketResponse> updatedTicket = ticketService.updateTicket(id, updateRequest);
            return updatedTicket.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error processing passenger data: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating ticket: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Integer id) {
        boolean deleted = ticketService.deleteTicket(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    private void enrichTicketWithVoyageInfo(TicketDTO.TicketResponse ticket) {
        if (ticket.getVoyageId() != null) {
            // Get voyage data
            try {
                // Get voyage information by ID
                Voyage voyage = voyageService.getVoyageEntityById(ticket.getVoyageId())
    .orElseThrow(() -> new RuntimeException("Voyage not found with id: " + ticket.getVoyageId()));
                if (voyage != null) {
                    // Extract station information and add it to the ticket
                    if (voyage.getFromStation() != null) {
                        ticket.setFromStationCity(voyage.getFromStation().getCity());
                        ticket.setFromStationTitle(voyage.getFromStation().getTitle());
                    }
                    
                    if (voyage.getToStation() != null) {
                        ticket.setToStationCity(voyage.getToStation().getCity());
                        ticket.setToStationTitle(voyage.getToStation().getTitle());
                    }
                    
                    // Add departure and arrival times
                    ticket.setDepartureDate(voyage.getDepartureDate());
                    ticket.setDepartureTime(voyage.getDepartureTime());
                    ticket.setArrivalTime(voyage.getArrivalTime());
                }
            } catch (Exception e) {
                throw new RuntimeException("Error fetching voyage information: " + e.getMessage(), e);
            }
        }
    }
}