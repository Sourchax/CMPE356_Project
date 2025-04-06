package group12.Backend.controller;

import group12.Backend.util.*;

import group12.Backend.dto.ActivityLogDTO;
import group12.Backend.dto.ComplaintDTO;
import group12.Backend.entity.Complaint;
import group12.Backend.service.ActivityLogService;
import group12.Backend.service.ComplaintService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {
    
    private final ComplaintService complaintService;
    private final ActivityLogService activityLogService;

    @Autowired
    private JavaMailSender emailSender;
    
    public ComplaintController(ComplaintService complaintService, ActivityLogService activityLogService) {
        this.complaintService = complaintService;
        this.activityLogService = activityLogService;
    }
    
    @GetMapping
    public ResponseEntity<List<ComplaintDTO>> getAllComplaints(@RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
            if (claims == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            String role = (String) claims.get("meta_data", HashMap.class).get("role");
            if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
                return ResponseEntity.ok(complaintService.getAllComplaints());

            }
            else{
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ComplaintDTO> getComplaintById(@PathVariable Integer id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ComplaintDTO>> getComplaintsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(complaintService.getComplaintsByUserId(userId));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ComplaintDTO>> getComplaintsByStatus(
            @PathVariable Complaint.ComplaintStatus status, @RequestHeader("Authorization") String auth) throws Exception {
                Claims claims = Authentication.getClaims(auth);
                if (claims == null)
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
                String role = (String) claims.get("meta_data", HashMap.class).get("role");
                if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
                    return ResponseEntity.ok(complaintService.getComplaintsByStatus(status));
                }
                else{
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
                }
    }
    
    @PostMapping
    public ResponseEntity<ComplaintDTO> createComplaint(
            @RequestBody ComplaintDTO.ComplaintCreateRequest request, @RequestHeader("Authorization") String auth) throws Exception {
            Claims claims = Authentication.getClaims(auth);
            if (claims == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            
            ComplaintDTO createdComplaint = complaintService.createComplaint(request);
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("CREATE");
            logRequest.setEntityType("COMPLAINT");
            logRequest.setEntityId(createdComplaint.getId().toString());
            logRequest.setDescription("Created complaint: " + createdComplaint.getSubject() + " from " + createdComplaint.getSender());
            activityLogService.createActivityLog(logRequest, claims);
            
            return new ResponseEntity<>(createdComplaint, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ComplaintDTO> updateComplaintStatus(
            @PathVariable Integer id, 
            @RequestBody ComplaintDTO.ComplaintUpdateRequest request, 
            @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)) {
            // Get original complaint for logging
            ComplaintDTO originalComplaint = complaintService.getComplaintById(id);
            
            ComplaintDTO updatedComplaint = complaintService.updateComplaintStatus(id, request);
            
            try {
                // Send email notification
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("sailmatesup@gmail.com");
                message.setTo(updatedComplaint.getEmail());
                message.setSubject("Response to Your SailMate Complaint #" + id);
                message.setText("Dear " + updatedComplaint.getSender() + ",\n\n" +
                        "Thank you for bringing your concerns to our attention. We've reviewed your complaint regarding:\n\n" +
                        "\"" + originalComplaint.getSubject() + "\"\n" +
                        "\"" + originalComplaint.getMessage() + "\"\n\n" +
                        "Our response:\n" +
                        "\"" + updatedComplaint.getReply() + "\"\n\n" +
                        "We value your feedback as it helps us improve our services. If you have any further questions or comments, please don't hesitate to contact us.\n\n" +
                        "Smooth sailing,\n" +
                        "The SailMate Support Team");
                
                emailSender.send(message);
                System.out.println("Email sent successfully to: " + updatedComplaint.getEmail());
            } catch (Exception e) {
                // Log the error but don't fail the request
                System.err.println("Failed to send email: " + e.getMessage());
                e.printStackTrace();
            }

                    
                    // Log the activity
                    ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                    logRequest.setActionType("UPDATE");
                    logRequest.setEntityType("COMPLAINT");
                    logRequest.setEntityId(id.toString());
                    
                    StringBuilder description = new StringBuilder("Updated complaint");
                    
                    if (originalComplaint != null) {
                        description.append(": ").append(originalComplaint.getSubject());
                        
                        if (originalComplaint.getStatus() != request.getStatus()) {
                            description.append(", status changed from ")
                                     .append(originalComplaint.getStatus())
                                     .append(" to ")
                                     .append(request.getStatus());
                        }
                        
                        if (request.getReply() != null && !request.getReply().equals(originalComplaint.getReply())) {
                            description.append(", reply added/updated");
                        }
                    }
                    
                    logRequest.setDescription(description.toString());
                    activityLogService.createActivityLog(logRequest, claims);
                    
                    return ResponseEntity.ok(updatedComplaint);
                }
                else{
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
                }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Integer id, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            // Get the complaint details for logging before deletion
            ComplaintDTO complaint = complaintService.getComplaintById(id);
            
            complaintService.deleteComplaint(id);
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("DELETE");
            logRequest.setEntityType("COMPLAINT");
            logRequest.setEntityId(id.toString());
            
            String description = "Deleted complaint";
            if (complaint != null) {
                description += ": " + complaint.getSubject() + " from " + complaint.getSender();
            }
            
            logRequest.setDescription(description);
            activityLogService.createActivityLog(logRequest, claims);
            
            return ResponseEntity.noContent().build();
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
}