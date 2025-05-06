package group12.Backend.controller;

import group12.Backend.dto.ActivityLogDTO;
import group12.Backend.dto.CompletedTicketDTO;
import group12.Backend.service.ActivityLogService;
import group12.Backend.service.CompletedTicketService;
import group12.Backend.util.Authentication;
import group12.Backend.util.ClerkUsers;
import group12.Backend.util.TicketPDFGenerator;
import io.jsonwebtoken.Claims;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/completed-tickets")
@CrossOrigin(origins = "*")
public class CompletedTicketController {

    private final CompletedTicketService completedTicketService;
    private final ActivityLogService activityLogService;

    @Autowired
    public CompletedTicketController(CompletedTicketService completedTicketService,
                                    ActivityLogService activityLogService) {
        this.completedTicketService = completedTicketService;
        this.activityLogService = activityLogService;
    }

    /**
     * Get all completed tickets
     * @return ResponseEntity with all completed tickets
     */
    @GetMapping
    public ResponseEntity<List<CompletedTicketDTO>> getAllCompletedTickets(@RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            List<CompletedTicketDTO> tickets = completedTicketService.getAllCompletedTickets();
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("READ");
            logRequest.setEntityType("COMPLETED_TICKET");
            logRequest.setEntityId("all");
            logRequest.setDescription("Retrieved all completed tickets");
            logRequest.setDescriptionTr("Tüm tamamlanmış biletler görüntülendi");
            activityLogService.createActivityLog(logRequest, claims);
            
            return ResponseEntity.ok(tickets);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }

    /**
     * Get completed ticket by ID
     * @param id The ID of the completed ticket
     * @return ResponseEntity with the completed ticket
     */
    @GetMapping("/{id}")
    public ResponseEntity<CompletedTicketDTO> getCompletedTicketById(@PathVariable Integer id, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        Optional<CompletedTicketDTO> ticket = completedTicketService.getCompletedTicketById(id);
        
        if (ticket.isPresent()) {
            CompletedTicketDTO ticketDTO = ticket.get();
            
            // Check authorization: either admin/super or the owner of the ticket
            String role = (String) claims.get("meta_data", HashMap.class).get("role");
            if ("super".equalsIgnoreCase(role) || 
                    claims.getSubject().equals(ticketDTO.getUserId())) {
                
                // Log the activity
                ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                logRequest.setActionType("READ");
                logRequest.setEntityType("COMPLETED_TICKET");
                logRequest.setEntityId(id.toString());
                logRequest.setDescription("Retrieved completed ticket details for ticket ID: " + id);
                logRequest.setDescriptionTr("Tamamlanmış bilet detayları görüntülendi, bilet ID: " + id);
                activityLogService.createActivityLog(logRequest, claims);
                
                return ResponseEntity.ok(ticketDTO);
            } else {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized to view this ticket");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get completed ticket by its unique ticket ID
     * @param ticketId The unique ID of the ticket
     * @return ResponseEntity with the completed ticket
     */
    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<CompletedTicketDTO> getCompletedTicketByTicketId(@PathVariable String ticketId, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        Optional<CompletedTicketDTO> ticket = completedTicketService.getCompletedTicketByTicketId(ticketId);
        
        if (ticket.isPresent()) {
            CompletedTicketDTO ticketDTO = ticket.get();
            
            // Check authorization: either admin/super or the owner of the ticket
            String role = (String) claims.get("meta_data", HashMap.class).get("role");
            if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role) || 
                    claims.getSubject().equals(ticketDTO.getUserId())) {
                
                // Log the activity
                ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                logRequest.setActionType("READ");
                logRequest.setEntityType("COMPLETED_TICKET");
                logRequest.setEntityId(ticketId);
                logRequest.setDescription("Retrieved completed ticket details for ticket ID: " + ticketId);
                logRequest.setDescriptionTr("Tamamlanmış bilet detayları görüntülendi, bilet ID: " + ticketId);
                activityLogService.createActivityLog(logRequest, claims);
                
                return ResponseEntity.ok(ticketDTO);
            } else {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized to view this ticket");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all completed tickets for a user
     * @return ResponseEntity with all the user's completed tickets
     */
    @GetMapping("/by-user")
    public ResponseEntity<List<CompletedTicketDTO>> getCompletedTicketsByUser(@RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        List<CompletedTicketDTO> tickets = completedTicketService.getCompletedTicketsByUserId(claims.getSubject());
        
        // Log the activity
        ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
        logRequest.setActionType("READ");
        logRequest.setEntityType("COMPLETED_TICKET");
        logRequest.setEntityId("user-" + claims.getSubject());
        logRequest.setDescription("Retrieved all completed tickets for user");
        logRequest.setDescriptionTr("Kullanıcının tüm tamamlanmış biletleri görüntülendi");
        activityLogService.createActivityLog(logRequest, claims);
        
        return ResponseEntity.ok(tickets);
    }

    /**
     * Get all completed tickets for a voyage
     * @param voyageId The ID of the voyage
     * @return ResponseEntity with all completed tickets for the voyage
     */
    @GetMapping("/by-voyage/{voyageId}")
    public ResponseEntity<List<CompletedTicketDTO>> getCompletedTicketsByVoyage(@PathVariable Integer voyageId, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            List<CompletedTicketDTO> tickets = completedTicketService.getCompletedTicketsByVoyageId(voyageId);
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("READ");
            logRequest.setEntityType("COMPLETED_TICKET");
            logRequest.setEntityId("voyage-" + voyageId);
            logRequest.setDescription("Retrieved all completed tickets for voyage ID: " + voyageId);
            logRequest.setDescriptionTr("Sefer ID: " + voyageId + " için tüm tamamlanmış biletler görüntülendi");
            activityLogService.createActivityLog(logRequest, claims);
            
            return ResponseEntity.ok(tickets);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized to view all tickets for a voyage");
        }
    }
    
    /**
     * Get count of completed tickets
     * @return ResponseEntity with the count of completed tickets
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getCompletedTicketCount(@RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)) {
            long count = completedTicketService.getCompletedTicketCount();
            return ResponseEntity.ok(count);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }

    /**
     * Download a completed ticket PDF
     * @param ticketId The unique ticket identifier
     * @param auth Authorization header with JWT
     * @return PDF file as byte array
     * @throws Exception If the ticket is not found or PDF generation fails
     */
    @GetMapping("/{ticketId}/download")
    public ResponseEntity<byte[]> downloadCompletedTicket(@PathVariable String ticketId, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        // Check if the ticket belongs to the user or if user is admin/super
        Optional<CompletedTicketDTO> ticketOpt = completedTicketService.getCompletedTicketByTicketId(ticketId);
        
        if (!ticketOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Completed ticket not found with ID: " + ticketId);
        }
        
        CompletedTicketDTO ticket = ticketOpt.get();
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        
        if (!ticket.getUserId().equals(claims.getSubject())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized to download this ticket");
        }
        
        try {
            System.out.println("Downloading completed ticket: " + ticketId);
            byte[] pdfBytes = completedTicketService.generateCompletedTicketPdfBytes(ticketId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline()
                .filename("ticket-" + ticketId + ".pdf")
                .build());
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("READ");
            logRequest.setEntityType("COMPLETED_TICKET");
            logRequest.setEntityId(ticketId);
            logRequest.setDescription("Downloaded PDF for completed ticket ID: " + ticketId);
            logRequest.setDescriptionTr("Tamamlanmış bilet PDF'i indirildi, bilet ID: " + ticketId);
            activityLogService.createActivityLog(logRequest, claims);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to generate completed ticket PDF: " + e.getMessage());
        }
    }
    
}