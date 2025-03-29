package group12.Backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import group12.Backend.dto.TicketDTO;
import group12.Backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*") // Configure as needed for your environment
public class TicketController {

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
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

    /**
     * Get a ticket by its ID
     * @param id the ID of the ticket
     * @return ResponseEntity with the ticket if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO.TicketResponse> getTicketById(@PathVariable Integer id) {
        Optional<TicketDTO.TicketResponse> ticket = ticketService.getTicketById(id);
        return ticket.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get tickets by user ID
     * @param userId the ID of the user
     * @return ResponseEntity with the list of tickets
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketDTO.TicketResponse>> getTicketsByUserId(@PathVariable String userId) {
        List<TicketDTO.TicketResponse> tickets = ticketService.getTicketsByUserId(userId);
        return ResponseEntity.ok(tickets);
    }

    /**
     * Get a ticket by its unique ticketID
     * @param ticketID the unique ticket identifier
     * @return ResponseEntity with the ticket if found
     */
    @GetMapping("/ticketID/{ticketID}")
    public ResponseEntity<TicketDTO.TicketResponse> getTicketByTicketID(@PathVariable String ticketID) {
        Optional<TicketDTO.TicketResponse> ticket = ticketService.getTicketByTicketID(ticketID);
        return ticket.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new ticket
     * @param ticketRequest the ticket request DTO
     * @return ResponseEntity with the created ticket
     */
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

    /**
     * Update an existing ticket
     * @param id the ID of the ticket to update
     * @param updateRequest the ticket update request DTO
     * @return ResponseEntity with the updated ticket if found
     */
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

    /**
     * Delete a ticket by its ID
     * @param id the ID of the ticket to delete
     * @return ResponseEntity with success or not found status
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Integer id) {
        boolean deleted = ticketService.deleteTicket(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}