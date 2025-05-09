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
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
            logRequest.setDescriptionTr("Bilet detayları görüntülendi, bilet ID: " + id);
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
                    logRequest.setDescriptionTr("Bilet detayları görüntülendi, bilet ID: " + ticketID);
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
            String voyageDetailsTr = "";
            try {
                Voyage voyage = voyageService.getVoyageEntityById(ticketRequest.getVoyageId()).orElse(null);
                if (voyage != null) {
                    voyageDetails = String.format(" for voyage from %s to %s on %s", 
                        voyage.getFromStation().getTitle(),
                        voyage.getToStation().getTitle(),
                        voyage.getDepartureDate()
                    );
                    voyageDetailsTr = String.format(" %s - %s seferi için, tarih: %s", 
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
            
            String description = String.format(
                "Created ticket %s%s for %d passenger(s), class: %s", 
                createdTicket.getTicketID(),
                voyageDetails,
                ticketRequest.getPassengerCount(),
                ticketRequest.getTicketClass()
            );
            
            String descriptionTr = String.format(
                "Bilet oluşturuldu: %s%s, %d yolcu için, sınıf: %s", 
                createdTicket.getTicketID(),
                voyageDetailsTr,
                ticketRequest.getPassengerCount(),
                ticketRequest.getTicketClass()
            );
            
            logRequest.setDescription(description);
            logRequest.setDescriptionTr(descriptionTr);
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
                StringBuilder changesTr = new StringBuilder();
                
                if (updateRequest.getTicketClass() != null && !updateRequest.getTicketClass().equals(originalTicketClass)) {
                    changes.append(String.format("class changed from %s to %s", originalTicketClass, updateRequest.getTicketClass()));
                    changesTr.append(String.format("sınıf %s'dan %s'a değiştirildi", originalTicketClass, updateRequest.getTicketClass()));
                }
                
                if (updateRequest.getPassengerCount() != null && originalTicket.isPresent() && 
                    !updateRequest.getPassengerCount().equals(originalTicket.get().getPassengerCount())) {
                    if (changes.length() > 0) changes.append(", ");
                    if (changesTr.length() > 0) changesTr.append(", ");
                    
                    changes.append(String.format("passenger count changed from %d to %d", 
                        originalTicket.get().getPassengerCount(), updateRequest.getPassengerCount()));
                    changesTr.append(String.format("yolcu sayısı %d'dan %d'a değiştirildi", 
                        originalTicket.get().getPassengerCount(), updateRequest.getPassengerCount()));
                }
                
                if (updateRequest.getSelectedSeats() != null && originalTicket.isPresent() && 
                    !updateRequest.getSelectedSeats().equals(originalTicket.get().getSelectedSeats())) {
                    if (changes.length() > 0) changes.append(", ");
                    if (changesTr.length() > 0) changesTr.append(", ");
                    
                    changes.append(String.format("seats changed from %s to %s", 
                        originalTicket.get().getSelectedSeats(), updateRequest.getSelectedSeats()));
                    changesTr.append(String.format("koltuklar %s'dan %s'a değiştirildi", 
                        originalTicket.get().getSelectedSeats(), updateRequest.getSelectedSeats()));
                }
                
                String description = String.format("Updated ticket %s", ticketID);
                String descriptionTr = String.format("Bilet güncellendi %s", ticketID);
                
                if (changes.length() > 0) {
                    description += " (" + changes.toString() + ")";
                    descriptionTr += " (" + changesTr.toString() + ")";
                }
                
                // Log the activity
                ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                logRequest.setActionType("UPDATE");
                logRequest.setEntityType("TICKET");
                logRequest.setEntityId(ticketID);
                logRequest.setDescription(description);
                logRequest.setDescriptionTr(descriptionTr);
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
        
        // Get user's language preference, default to English if not specified
        String language = user.containsKey("lan") ? (String) user.get("lan") : "en";
        
        boolean deleted = ticketService.deleteTicket(id);
        
        if (deleted) {
            // Build the description for the log
            StringBuilder description = new StringBuilder("Deleted ticket " + ticketID);
            StringBuilder descriptionTr = new StringBuilder("Bilet silindi " + ticketID);
            
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
                    
                    descriptionTr.append(String.format(", %s - %s seferi için, tarih: %s", 
                        ticket.getFromStationTitle(),
                        ticket.getToStationTitle(),
                        ticket.getDepartureDate()
                    ));
                    
                    // Send email notification about ticket cancellation
                    try {
                        SimpleMailMessage message = new SimpleMailMessage();
                        message.setFrom("sailmatesup@gmail.com");
                        message.setTo((String) user.get("email"));
                        
                        if ("tr".equals(language)) {
                            // Turkish email
                            message.setSubject("SailMate Bilet İptali - İade Onayı");
                            message.setText("Sayın " + user.get("full_name") + ",\n\n" +
                                    "Bilet no #" + ticketID + " başarıyla iptal edilmiştir.\n\n" +
                                    "Sefer Detayları:\n" +
                                    "Nereden: " + ticket.getFromStationTitle() + "\n" +
                                    "Nereye: " + ticket.getToStationTitle() + "\n" +
                                    "Kalkış Tarihi: " + ticket.getDepartureDate() + "\n" +
                                    "Yolcu Sayısı: " + ticket.getPassengerCount() + "\n" +
                                    "Koltuk Sınıfı: " + ticket.getTicketClass() + "\n" +
                                    "Seçilen Koltuklar: " + ticket.getSelectedSeats() + "\n\n" +
                                    "Bilet tutarının tamamı için iade işlemi başlatılmıştır ve orijinal ödeme yönteminize göre işleme alınacaktır. " +
                                    "İade, bankanızın işlem süresine bağlı olarak 5-7 iş günü içinde hesabınızda görünmelidir.\n\n" +
                                    "İadenizle ilgili herhangi bir sorunuz varsa veya daha fazla yardıma ihtiyacınız olursa, lütfen destek ekibimizle iletişime geçin.\n\n" +
                                    "Feribot seyahat ihtiyaçlarınız için SailMate'i tercih ettiğiniz için teşekkür ederiz.\n\n" +
                                    "İyi yolculuklar,\n" +
                                    "SailMate Ekibi");
                        } else {
                            // English email (default)
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
                        }
                        
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
                        
                        if ("tr".equals(language)) {
                            // Basic Turkish email
                            message.setSubject("SailMate Bilet İptali - İade Onayı");
                            message.setText("Sayın " + user.get("full_name") + ",\n\n" +
                                    "Bilet no #" + ticketID + " başarıyla iptal edilmiştir.\n\n" +
                                    "Bilet tutarının tamamı için iade işlemi başlatılmıştır ve orijinal ödeme yönteminize göre işleme alınacaktır. " +
                                    "İade, bankanızın işlem süresine bağlı olarak 5-7 iş günü içinde hesabınızda görünmelidir.\n\n" +
                                    "İadenizle ilgili herhangi bir sorunuz varsa veya daha fazla yardıma ihtiyacınız olursa, lütfen destek ekibimizle iletişime geçin.\n\n" +
                                    "Feribot seyahat ihtiyaçlarınız için SailMate'i tercih ettiğiniz için teşekkür ederiz.\n\n" +
                                    "İyi yolculuklar,\n" +
                                    "SailMate Ekibi");
                        } else {
                            // Basic English email (default)
                            message.setSubject("SailMate Ticket Cancellation - Refund Confirmation");
                            message.setText("Dear " + user.get("full_name")+",\n\n" +
                                    "Your ticket #" + ticketID + " has been successfully cancelled.\n\n" +
                                    "A refund has been initiated for the full ticket amount and will be processed according to your original payment method. " +
                                    "The refund should appear in your account within 5-7 business days, depending on your bank's processing time.\n\n" +
                                    "If you have any questions regarding your refund or need further assistance, please contact our support team.\n\n" +
                                    "Thank you for choosing SailMate for your ferry travel needs.\n\n" +
                                    "Smooth sailing,\n" +
                                    "The SailMate Team");
                        }
                        
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
                    
                    if ("tr".equals(language)) {
                        // Basic Turkish email
                        message.setSubject("SailMate Bilet İptali - İade Onayı");
                        message.setText("Sayın " + user.get("full_name") + ",\n\n" +
                                "Bilet no #" + ticketID + " başarıyla iptal edilmiştir.\n\n" +
                                "Bilet tutarının tamamı için iade işlemi başlatılmıştır ve orijinal ödeme yönteminize göre işleme alınacaktır. " +
                                "İade, bankanızın işlem süresine bağlı olarak 5-7 iş günü içinde hesabınızda görünmelidir.\n\n" +
                                "İadenizle ilgili herhangi bir sorunuz varsa veya daha fazla yardıma ihtiyacınız olursa, lütfen destek ekibimizle iletişime geçin.\n\n" +
                                "Feribot seyahat ihtiyaçlarınız için SailMate'i tercih ettiğiniz için teşekkür ederiz.\n\n" +
                                "İyi yolculuklar,\n" +
                                "SailMate Ekibi");
                    } else {
                        // Basic English email (default)
                        message.setSubject("SailMate Ticket Cancellation - Refund Confirmation");
                        message.setText("Dear " + user.get("full_name")+",\n\n" +
                                "Your ticket #" + ticketID + " has been successfully cancelled.\n\n" +
                                "A refund has been initiated for the full ticket amount and will be processed according to your original payment method. " +
                                "The refund should appear in your account within 5-7 business days, depending on your bank's processing time.\n\n" +
                                "If you have any questions regarding your refund or need further assistance, please contact our support team.\n\n" +
                                "Thank you for choosing SailMate for your ferry travel needs.\n\n" +
                                "Smooth sailing,\n" +
                                "The SailMate Team");
                    }
                    
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
            logRequest.setDescriptionTr(descriptionTr.toString());
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

    @PostMapping("/send-email")
    public ResponseEntity<?> sendTicketEmail(@RequestBody Map<String, Object> ticketInfo, @RequestHeader("Authorization") String auth) throws Exception {
        try {
            Claims claims = Authentication.getClaims(auth);     
            if (claims == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid authentication token");
            }
            
            String userId = claims.getSubject();
            System.out.println("User ID from claims: " + userId);
            
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User ID not found in token");
            }
            HashMap<String, Object> user = ClerkUsers.getUser(claims.getSubject());
            if(user == null)
                return ResponseEntity.badRequest().body("User not found");
            
            if(user.get("email") == null)
                return ResponseEntity.badRequest().body("User email not found");
            
            // Extract ticket data from the request
            Map<String, Object> departureTicket = (Map<String, Object>) ticketInfo.get("departureTicket");
            Map<String, Object> returnTicket = (Map<String, Object>) ticketInfo.get("returnTicket");
            String languagePreference = (String) ticketInfo.get("lang_pref");
            
            // Default to English if no language preference is specified
            if (languagePreference == null) {
                languagePreference = "en";
            }
            
            if (departureTicket == null) {
                return ResponseEntity.badRequest().body("No ticket data provided");
            }
            
            // Validate that the tickets belong to the user
            if(!claims.getSubject().equals(departureTicket.get("userId")))
                return ResponseEntity.badRequest().body("Departure ticket does not belong to user");
            
            if (returnTicket != null && !claims.getSubject().equals(returnTicket.get("userId")))
                return ResponseEntity.badRequest().body("Return ticket does not belong to user");
            
            // Send a single email with both tickets if it's a round trip
            if (returnTicket != null) {
                sendRoundTripConfirmationEmailWithPDFs(user, departureTicket, returnTicket, languagePreference);
            } else {
                // Just a one-way trip
                sendOneWayConfirmationEmailWithPDF(user, departureTicket, languagePreference);
            }
            
            String successMessage = languagePreference.equals("tr") ? 
                "Bilet onay e-postası PDF ekleri ile başarıyla gönderildi" : 
                "Ticket confirmation email with PDF attachments sent successfully";
                
            return ResponseEntity.ok().body(Map.of("message", successMessage));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending ticket confirmation email: " + e.getMessage());
        }
    }

    private void sendOneWayConfirmationEmailWithPDF(HashMap<String, Object> user, Map<String, Object> ticketData, String language) {
        try {
            // Get the ticket ID from the ticket data
            String ticketId = (String) ticketData.get("ticketID");
            
            // Retrieve the complete ticket from the database
            Optional<TicketDTO.TicketResponse> ticketOpt = ticketService.getTicketByTicketID(ticketId);
            if (!ticketOpt.isPresent()) {
                throw new Exception("Could not find ticket with ID: " + ticketId);
            }
            
            TicketDTO.TicketResponse ticket = ticketOpt.get();
            
            // Enrich the ticket with voyage information 
            enrichTicketWithVoyageInfo(ticket);
            
            // Now the ticket should contain all the necessary info from the voyage
            Integer voyageId = ticket.getVoyageId();
            String fromStation = ticket.getFromStationTitle() != null ? ticket.getFromStationTitle() : "N/A";
            String toStation = ticket.getToStationTitle() != null ? ticket.getToStationTitle() : "N/A";
            String departureDate = ticket.getDepartureDate() != null ? ticket.getDepartureDate().toString() : "N/A";
            String departureTime = ticket.getDepartureTime() != null ? ticket.getDepartureTime().toString() : "N/A";
            String arrivalTime = ticket.getArrivalTime() != null ? ticket.getArrivalTime().toString() : "N/A";
            Integer passengerCount = ticket.getPassengerCount();
            String ticketClass = ticket.getTicketClass();
            String selectedSeats = ticket.getSelectedSeats();
            
            // Create a MimeMessage to support attachments
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom("sailmatesup@gmail.com");
            helper.setTo((String) user.get("email"));
            
            String emailSubject, emailContent;
            
            if (language.equals("tr")) {
                // Turkish email content
                emailSubject = "SailMate Bilet Onayı - Feribot Biletiniz";
                
                emailContent = "Sayın " + user.get("full_name") + ",\n\n" +
                        "SailMate'i tercih ettiğiniz için teşekkür ederiz! Biletiniz başarıyla kaydedildi.\n\n" +
                        "Bilet Detayları:\n" +
                        "Bilet No: " + ticketId + "\n" +
                        "Nereden: " + fromStation + "\n" +
                        "Nereye: " + toStation + "\n" +
                        "Tarih: " + departureDate + "\n" +
                        "Kalkış Saati: " + departureTime + "\n" +
                        "Varış Saati: " + arrivalTime + "\n" +
                        "Yolcu Sayısı: " + passengerCount + "\n" +
                        "Koltuk Sınıfı: " + ticketClass + "\n" +
                        "Seçilen Koltuklar: " + selectedSeats + "\n\n" +
                        "Biletiniz bu e-postaya PDF olarak eklenmiştir. Biletinizi SailMate web sitesindeki hesap panelinizden de görüntüleyebilir ve indirebilirsiniz.\n\n" +
                        "Herhangi bir yardım için lütfen müşteri destek ekibimizle iletişime geçin.\n\n" +
                        "İyi yolculuklar dileriz!\n\n" +
                        "Keyifli seyahatler,\n" +
                        "SailMate Ekibi";
            } else {
                // English email content (default)
                emailSubject = "SailMate Ticket Confirmation - Your Ferry Ticket";
                
                emailContent = "Dear " + user.get("full_name") + ",\n\n" +
                        "Thank you for choosing SailMate! Your ticket has been successfully booked.\n\n" +
                        "Ticket Details:\n" +
                        "Ticket #: " + ticketId + "\n" +
                        "From: " + fromStation + "\n" +
                        "To: " + toStation + "\n" +
                        "Date: " + departureDate + "\n" +
                        "Departure Time: " + departureTime + "\n" +
                        "Arrival Time: " + arrivalTime + "\n" +
                        "Passenger Count: " + passengerCount + "\n" +
                        "Seat Class: " + ticketClass + "\n" +
                        "Selected Seats: " + selectedSeats + "\n\n" +
                        "Your ticket is attached to this email as a PDF. You can also view and download your ticket from your account dashboard on the SailMate website.\n\n" +
                        "For any assistance, please contact our customer support team.\n\n" +
                        "We wish you a pleasant journey!\n\n" +
                        "Smooth sailing,\n" +
                        "The SailMate Team";
            }
            
            helper.setSubject(emailSubject);
            helper.setText(emailContent);
            
            // Generate and attach the PDF ticket
            byte[] pdfBytes = ticketService.generateTicketPdfBytes(ticketId);
            helper.addAttachment("ticket-" + ticketId + ".pdf", new ByteArrayResource(pdfBytes));
            
            emailSender.send(message);
            System.out.println("One-way ticket confirmation email with PDF sent to: " + (String) user.get("email"));
        } catch (Exception e) {
            System.err.println("Failed to send one-way ticket email with PDF: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    
    private void sendRoundTripConfirmationEmailWithPDFs(HashMap<String, Object> user, Map<String, Object> departureTicket, Map<String, Object> returnTicket, String language) {
        try {
            // Get ticket IDs from the ticket data
            String depTicketId = (String) departureTicket.get("ticketID");
            String retTicketId = (String) returnTicket.get("ticketID");
            
            // Retrieve complete tickets from database
            Optional<TicketDTO.TicketResponse> depTicketOpt = ticketService.getTicketByTicketID(depTicketId);
            Optional<TicketDTO.TicketResponse> retTicketOpt = ticketService.getTicketByTicketID(retTicketId);
            
            if (!depTicketOpt.isPresent() || !retTicketOpt.isPresent()) {
                throw new Exception("Could not find tickets with IDs: " + depTicketId + " and/or " + retTicketId);
            }
            
            TicketDTO.TicketResponse depTicket = depTicketOpt.get();
            TicketDTO.TicketResponse retTicket = retTicketOpt.get();
            
            // Enrich tickets with voyage information
            enrichTicketWithVoyageInfo(depTicket);
            enrichTicketWithVoyageInfo(retTicket);
            
            // Extract departure ticket details
            String depFromStation = depTicket.getFromStationTitle() != null ? depTicket.getFromStationTitle() : "N/A";
            String depToStation = depTicket.getToStationTitle() != null ? depTicket.getToStationTitle() : "N/A";
            String depDepartureDate = depTicket.getDepartureDate() != null ? depTicket.getDepartureDate().toString() : "N/A";
            String depDepartureTime = depTicket.getDepartureTime() != null ? depTicket.getDepartureTime().toString() : "N/A";
            String depArrivalTime = depTicket.getArrivalTime() != null ? depTicket.getArrivalTime().toString() : "N/A";
            Integer depPassengerCount = depTicket.getPassengerCount();
            String depTicketClass = depTicket.getTicketClass();
            String depSelectedSeats = depTicket.getSelectedSeats();
            
            // Extract return ticket details
            String retFromStation = retTicket.getFromStationTitle() != null ? retTicket.getFromStationTitle() : "N/A";
            String retToStation = retTicket.getToStationTitle() != null ? retTicket.getToStationTitle() : "N/A";
            String retDepartureDate = retTicket.getDepartureDate() != null ? retTicket.getDepartureDate().toString() : "N/A";
            String retDepartureTime = retTicket.getDepartureTime() != null ? retTicket.getDepartureTime().toString() : "N/A";
            String retArrivalTime = retTicket.getArrivalTime() != null ? retTicket.getArrivalTime().toString() : "N/A";
            Integer retPassengerCount = retTicket.getPassengerCount();
            String retTicketClass = retTicket.getTicketClass();
            String retSelectedSeats = retTicket.getSelectedSeats();
            
            // Create a MimeMessage to support attachments
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom("sailmatesup@gmail.com");
            helper.setTo((String) user.get("email"));
            
            String emailSubject, emailContent;
            
            if (language.equals("tr")) {
                // Turkish email content
                emailSubject = "SailMate Bilet Onayı - Gidiş-Dönüş Feribot Biletleriniz";
                
                emailContent = "Sayın " + user.get("full_name") + ",\n\n" +
                        "SailMate'i tercih ettiğiniz için teşekkür ederiz! Gidiş-dönüş biletleriniz başarıyla kaydedildi.\n\n" +
                        "GİDİŞ YOLCULUĞU:\n" +
                        "Bilet No: " + depTicketId + "\n" +
                        "Nereden: " + depFromStation + "\n" +
                        "Nereye: " + depToStation + "\n" +
                        "Tarih: " + depDepartureDate + "\n" +
                        "Kalkış Saati: " + depDepartureTime + "\n" +
                        "Varış Saati: " + depArrivalTime + "\n" +
                        "Yolcu Sayısı: " + depPassengerCount + "\n" +
                        "Koltuk Sınıfı: " + depTicketClass + "\n" +
                        "Seçilen Koltuklar: " + depSelectedSeats + "\n\n" +
                        "DÖNÜŞ YOLCULUĞU:\n" +
                        "Bilet No: " + retTicketId + "\n" +
                        "Nereden: " + retFromStation + "\n" +
                        "Nereye: " + retToStation + "\n" +
                        "Tarih: " + retDepartureDate + "\n" +
                        "Kalkış Saati: " + retDepartureTime + "\n" +
                        "Varış Saati: " + retArrivalTime + "\n" +
                        "Yolcu Sayısı: " + retPassengerCount + "\n" +
                        "Koltuk Sınıfı: " + retTicketClass + "\n" +
                        "Seçilen Koltuklar: " + retSelectedSeats + "\n\n" +
                        "Biletleriniz bu e-postaya PDF olarak eklenmiştir. Biletlerinizi SailMate web sitesindeki hesap panelinizden de görüntüleyebilir ve indirebilirsiniz.\n\n" +
                        "Herhangi bir yardım için lütfen müşteri destek ekibimizle iletişime geçin.\n\n" +
                        "İyi yolculuklar dileriz!\n\n" +
                        "Keyifli seyahatler,\n" +
                        "SailMate Ekibi";
            } else {
                // English email content (default)
                emailSubject = "SailMate Ticket Confirmation - Your Round Trip Ferry Tickets";
                
                emailContent = "Dear " + user.get("full_name") + ",\n\n" +
                        "Thank you for choosing SailMate! Your round trip tickets have been successfully booked.\n\n" +
                        "OUTBOUND JOURNEY:\n" +
                        "Ticket #: " + depTicketId + "\n" +
                        "From: " + depFromStation + "\n" +
                        "To: " + depToStation + "\n" +
                        "Date: " + depDepartureDate + "\n" +
                        "Departure Time: " + depDepartureTime + "\n" +
                        "Arrival Time: " + depArrivalTime + "\n" +
                        "Passenger Count: " + depPassengerCount + "\n" +
                        "Seat Class: " + depTicketClass + "\n" +
                        "Selected Seats: " + depSelectedSeats + "\n\n" +
                        "RETURN JOURNEY:\n" +
                        "Ticket #: " + retTicketId + "\n" +
                        "From: " + retFromStation + "\n" +
                        "To: " + retToStation + "\n" +
                        "Date: " + retDepartureDate + "\n" +
                        "Departure Time: " + retDepartureTime + "\n" +
                        "Arrival Time: " + retArrivalTime + "\n" +
                        "Passenger Count: " + retPassengerCount + "\n" +
                        "Seat Class: " + retTicketClass + "\n" +
                        "Selected Seats: " + retSelectedSeats + "\n\n" +
                        "Your tickets are attached to this email as PDFs. You can also view and download your tickets from your account dashboard on the SailMate website.\n\n" +
                        "For any assistance, please contact our customer support team.\n\n" +
                        "We wish you a pleasant journey!\n\n" +
                        "Smooth sailing,\n" +
                        "The SailMate Team";
            }
            
            helper.setSubject(emailSubject);
            helper.setText(emailContent);
            
            // Generate and attach the PDF tickets
            byte[] departurePdfBytes = ticketService.generateTicketPdfBytes(depTicketId);
            String departureAttachmentName = language.equals("tr") ? 
                "gidis-bileti-" + depTicketId + ".pdf" : 
                "outbound-ticket-" + depTicketId + ".pdf";
            helper.addAttachment(departureAttachmentName, new ByteArrayResource(departurePdfBytes));
            
            byte[] returnPdfBytes = ticketService.generateTicketPdfBytes(retTicketId);
            String returnAttachmentName = language.equals("tr") ? 
                "donus-bileti-" + retTicketId + ".pdf" : 
                "return-ticket-" + retTicketId + ".pdf";
            helper.addAttachment(returnAttachmentName, new ByteArrayResource(returnPdfBytes));
            
            emailSender.send(message);
            System.out.println("Round-trip ticket confirmation email with PDFs sent to: " + (String) user.get("email"));
        } catch (Exception e) {
            System.err.println("Failed to send round-trip ticket email with PDFs: " + e.getMessage());
            e.printStackTrace();
        }
    }
}