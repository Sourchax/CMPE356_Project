package group12.Backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.json.ByteSourceJsonBootstrapper;

import group12.Backend.dto.ActivityLogDTO;
import group12.Backend.dto.TicketDTO;
import group12.Backend.service.ActivityLogService;
import group12.Backend.service.TicketService;
import group12.Backend.service.VoyageService;
import group12.Backend.entity.Voyage;
import group12.Backend.util.Authentication;
import group12.Backend.util.ClerkUsers;
import io.jsonwebtoken.Claims;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {
    
    private final TicketService ticketService;
    private final VoyageService voyageService;
    private final ActivityLogService activityLogService;

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    public TicketController(TicketService ticketService, VoyageService voyageService, ActivityLogService activityLogService) {
        this.ticketService = ticketService;
        this.voyageService = voyageService;
        this.activityLogService = activityLogService;
    }

    /**
     * Get all tickets
     * @return ResponseEntity with all tickets
     */
    @GetMapping
    public ResponseEntity<List<TicketDTO.TicketResponse>> getAllTickets(@RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        
        List<TicketDTO.TicketResponse> tickets = ticketService.getAllTickets();
        
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO.TicketResponse> getTicketById(@PathVariable Integer id, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        
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
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("READ");
            logRequest.setEntityType("TICKET");
            logRequest.setEntityId(id.toString());
            logRequest.setDescription("Retrieved ticket details for ticket ID: " + id);
            activityLogService.createActivityLog(logRequest, claims);
            
            return ResponseEntity.ok(ticketResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-user")
    public ResponseEntity<List<TicketDTO.TicketResponse>> getTicketsByUserId(@RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        
        List<TicketDTO.TicketResponse> tickets = ticketService.getTicketsByUserId(claims.getSubject());
        
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
    public ResponseEntity<TicketDTO.TicketResponse> getTicketByTicketID(@PathVariable String ticketID, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if(claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized");
        
        Optional<TicketDTO.TicketResponse> ticket = ticketService.getTicketByTicketID(ticketID);
        
        if (ticket.isPresent()) {
            TicketDTO.TicketResponse ticketResponse = ticket.get();
            if(ticketResponse.getUserId().equals(claims.getSubject())){
                try {
                    enrichTicketWithVoyageInfo(ticketResponse);
                    ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                    logRequest.setActionType("READ");
                    logRequest.setEntityType("TICKET");
                    logRequest.setEntityId(ticketID);
                    logRequest.setDescription("Retrieved ticket details for ticket ID: " + ticketID);
                    activityLogService.createActivityLog(logRequest, claims);
                    return ResponseEntity.ok(ticketResponse);
                    
                } catch (Exception e) {
                    // Log the error but still return the basic ticket
                    System.err.println("Error enriching ticket with voyage info: " + e.getMessage());
                    return ResponseEntity.notFound().build();
                }

            }
            else{
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized");
            }
            
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{ticketId}/download")
    public ResponseEntity<byte[]> downloadTicket(@PathVariable String ticketId, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        try {
            System.out.println(ticketId);
            byte[] pdfBytes = ticketService.generateTicketPdfBytes(ticketId);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline()
                .filename("ticket-" + ticketId + ".pdf")
                .build());
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to generate ticket PDF: " + e.getMessage());
        }
    }
    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody TicketDTO.TicketRequest ticketRequest, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if(claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized");

        try {
            TicketDTO.TicketResponse createdTicket = ticketService.createTicket(ticketRequest);
            
            // Prepare voyage details for logging
            String voyageDetails = "";
            try {
                Voyage voyage = voyageService.getVoyageEntityById(ticketRequest.getVoyageId()).orElse(null);
                if (voyage != null) {
                    voyageDetails = String.format(" for voyage from %s to %s on %s", 
                        voyage.getFromStation().getTitle(),
                        voyage.getToStation().getTitle(),
                        voyage.getDepartureDate()
                    );
                }
            } catch (Exception e) {
                // If voyage details can't be fetched, continue without them
            }
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("CREATE");
            logRequest.setEntityType("TICKET");
            logRequest.setEntityId(createdTicket.getTicketID());
            logRequest.setDescription(String.format(
                "Created ticket %s%s for %d passenger(s), class: %s", 
                createdTicket.getTicketID(),
                voyageDetails,
                ticketRequest.getPassengerCount(),
                ticketRequest.getTicketClass()
            ));
            activityLogService.createActivityLog(logRequest, claims);
            
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
    public ResponseEntity<?> updateTicket(@PathVariable Integer id, @RequestBody TicketDTO.TicketUpdateRequest updateRequest, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        
        try {
            // Get original ticket for comparison (for logging)
            Optional<TicketDTO.TicketResponse> originalTicket = ticketService.getTicketById(id);
            String originalTicketClass = originalTicket.isPresent() ? originalTicket.get().getTicketClass() : "unknown";
            String ticketID = originalTicket.isPresent() ? originalTicket.get().getTicketID() : String.valueOf(id);
            
            Optional<TicketDTO.TicketResponse> updatedTicket = ticketService.updateTicket(id, updateRequest);
            
            if (updatedTicket.isPresent()) {
                // Log what changed
                StringBuilder changes = new StringBuilder();
                
                if (updateRequest.getTicketClass() != null && !updateRequest.getTicketClass().equals(originalTicketClass)) {
                    changes.append(String.format("class changed from %s to %s", originalTicketClass, updateRequest.getTicketClass()));
                }
                
                if (updateRequest.getPassengerCount() != null && originalTicket.isPresent() && 
                    !updateRequest.getPassengerCount().equals(originalTicket.get().getPassengerCount())) {
                    if (changes.length() > 0) changes.append(", ");
                    changes.append(String.format("passenger count changed from %d to %d", 
                        originalTicket.get().getPassengerCount(), updateRequest.getPassengerCount()));
                }
                
                if (updateRequest.getSelectedSeats() != null && originalTicket.isPresent() && 
                    !updateRequest.getSelectedSeats().equals(originalTicket.get().getSelectedSeats())) {
                    if (changes.length() > 0) changes.append(", ");
                    changes.append(String.format("seats changed from %s to %s", 
                        originalTicket.get().getSelectedSeats(), updateRequest.getSelectedSeats()));
                }
                
                String description = String.format("Updated ticket %s", ticketID);
                if (changes.length() > 0) {
                    description += " (" + changes.toString() + ")";
                }
                
                // Log the activity
                ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                logRequest.setActionType("UPDATE");
                logRequest.setEntityType("TICKET");
                logRequest.setEntityId(ticketID);
                logRequest.setDescription(description);
                activityLogService.createActivityLog(logRequest, claims);
            }
            
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
    public ResponseEntity<Void> deleteTicket(@PathVariable Integer id, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        
        if(claims == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized");
        }
        // Get ticket details for the log before deletion
        Optional<TicketDTO.TicketResponse> ticketToDelete = ticketService.getTicketById(id);

        String ticketID = ticketToDelete.isPresent() ? ticketToDelete.get().getTicketID() : String.valueOf(id);

        HashMap<String, Object> user = ClerkUsers.getUser(claims.getSubject());
        
        boolean deleted = ticketService.deleteTicket(id);
        
        if (deleted) {
            // Build the description for the log
            StringBuilder description = new StringBuilder("Deleted ticket " + ticketID);
            
            // Add voyage details if available
            if (ticketToDelete.isPresent() && ticketToDelete.get().getVoyageId() != null) {
                try {
                    TicketDTO.TicketResponse ticket = ticketToDelete.get();
                    enrichTicketWithVoyageInfo(ticket);
                    
                    description.append(String.format(" for voyage from %s to %s on %s", 
                        ticket.getFromStationTitle(),
                        ticket.getToStationTitle(),
                        ticket.getDepartureDate()
                    ));
                    
                    // Send email notification about ticket cancellation
                    try {
                        SimpleMailMessage message = new SimpleMailMessage();
                        message.setFrom("sailmatesup@gmail.com");
                        message.setTo((String) user.get("email"));
                        message.setSubject("SailMate Ticket Cancellation - Refund Confirmation");
                        message.setText("Dear " + user.get("full_name")+",\n\n" +
                                "Your ticket #" + ticketID + " has been successfully cancelled.\n\n" +
                                "Voyage Details:\n" +
                                "From: " + ticket.getFromStationTitle() + "\n" +
                                "To: " + ticket.getToStationTitle() + "\n" +
                                "Departure Date: " + ticket.getDepartureDate() + "\n" +
                                "Passenger Count: " + ticket.getPassengerCount() + "\n" +
                                "Seat Class: " + ticket.getTicketClass() + "\n" +
                                "Selected Seats: " + ticket.getSelectedSeats() + "\n\n" +
                                "A refund has been initiated for the full ticket amount and will be processed according to your original payment method. " +
                                "The refund should appear in your account within 5-7 business days, depending on your bank's processing time.\n\n" +
                                "If you have any questions regarding your refund or need further assistance, please contact our support team.\n\n" +
                                "Thank you for choosing SailMate for your ferry travel needs.\n\n" +
                                "Smooth sailing,\n" +
                                "The SailMate Team");
                        
                        emailSender.send(message);
                        System.out.println("Cancellation email sent successfully to: " + (String) user.get("email"));
                    } catch (Exception e) {
                        // Log the error but don't fail the request
                        System.err.println("Failed to send cancellation email: " + e.getMessage());
                        e.printStackTrace();
                    }
                } catch (Exception e) {
                    // If enrichment fails, continue without voyage details
                    // Still try to send a basic cancellation email
                    try {
                        SimpleMailMessage message = new SimpleMailMessage();
                        message.setFrom("sailmatesup@gmail.com");
                        message.setTo((String) user.get("email"));
                        message.setSubject("SailMate Ticket Cancellation - Refund Confirmation");
                        message.setText("Dear " + user.get("full_name")+",\n\n" +
                                "Your ticket #" + ticketID + " has been successfully cancelled.\n\n" +
                                "A refund has been initiated for the full ticket amount and will be processed according to your original payment method. " +
                                "The refund should appear in your account within 5-7 business days, depending on your bank's processing time.\n\n" +
                                "If you have any questions regarding your refund or need further assistance, please contact our support team.\n\n" +
                                "Thank you for choosing SailMate for your ferry travel needs.\n\n" +
                                "Smooth sailing,\n" +
                                "The SailMate Team");
                        
                        emailSender.send(message);
                        System.out.println("Basic cancellation email sent successfully to: " + (String) user.get("email"));
                    } catch (Exception mailEx) {
                        System.err.println("Failed to send basic cancellation email: " + mailEx.getMessage());
                        mailEx.printStackTrace();
                    }
                }
            } else {
                // Send a basic cancellation email if ticket details aren't available
                try {
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setFrom("sailmatesup@gmail.com");
                        message.setTo((String) user.get("email"));
                        message.setSubject("SailMate Ticket Cancellation - Refund Confirmation");
                        message.setText("Dear " + user.get("full_name")+",\n\n" +
                            "Your ticket #" + ticketID + " has been successfully cancelled.\n\n" +
                            "A refund has been initiated for the full ticket amount and will be processed according to your original payment method. " +
                            "The refund should appear in your account within 5-7 business days, depending on your bank's processing time.\n\n" +
                            "If you have any questions regarding your refund or need further assistance, please contact our support team.\n\n" +
                            "Thank you for choosing SailMate for your ferry travel needs.\n\n" +
                            "Smooth sailing,\n" +
                            "The SailMate Team");
                    
                    emailSender.send(message);
                    System.out.println("Basic cancellation email sent successfully to: " + (String) user.get("email"));
                } catch (Exception e) {
                    System.err.println("Failed to send basic cancellation email: " + e.getMessage());
                    e.printStackTrace();
                }
            }
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("DELETE");
            logRequest.setEntityType("TICKET");
            logRequest.setEntityId(ticketID);
            logRequest.setDescription(description.toString());
            activityLogService.createActivityLog(logRequest, claims);
            
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
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

    @GetMapping("/count")
    public ResponseEntity<Long> getTicketCount(@RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            return ResponseEntity.ok(ticketService.getTicketCount());
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
}