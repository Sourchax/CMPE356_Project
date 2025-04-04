package group12.Backend.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import group12.Backend.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import group12.Backend.dto.ActivityLogDTO;
import group12.Backend.dto.AnnouncementDTO;
import group12.Backend.service.ActivityLogService;
import group12.Backend.service.AnnouncementService;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins="*")
public class AnnouncementController {
    
    @Autowired
    private AnnouncementService announcementService;
    
    @Autowired
    private ActivityLogService activityLogService;
    
    // Get all announcements
    @GetMapping
    public ResponseEntity<List<AnnouncementDTO>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }
    
    // Get announcement by ID
    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> getAnnouncementById(@PathVariable Integer id) {
        AnnouncementDTO announcement = announcementService.getAnnouncementById(id);
        if (announcement != null) {
            return ResponseEntity.ok(announcement);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Create announcement
    @PostMapping
    public ResponseEntity<AnnouncementDTO> createAnnouncement(@RequestBody AnnouncementDTO announcementDTO, HttpServletRequest request) throws Exception{
        Claims claims = Authentication.getClaims(request);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            AnnouncementDTO created = announcementService.createAnnouncement(announcementDTO);
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("CREATE");
            logRequest.setEntityType("ANNOUNCEMENT");
            logRequest.setEntityId(created.getId().toString());
            logRequest.setDescription("Created announcement: " + created.getTitle());
            activityLogService.createActivityLog(logRequest, claims);
            
            return new ResponseEntity<>(created, HttpStatus.CREATED);   
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
    
    // Update announcement
    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> updateAnnouncement(
            @PathVariable Integer id, 
            @RequestBody AnnouncementDTO announcementDTO,
            HttpServletRequest request) throws Exception{

        Claims claims = Authentication.getClaims(request);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            // Get the original announcement for logging
            AnnouncementDTO originalAnnouncement = announcementService.getAnnouncementById(id);
            
            AnnouncementDTO updated = announcementService.updateAnnouncement(id, announcementDTO);
            if (updated != null) {
                // Log the activity
                ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                logRequest.setActionType("UPDATE");
                logRequest.setEntityType("ANNOUNCEMENT");
                logRequest.setEntityId(id.toString());
                
                String description = "Updated announcement: " + updated.getTitle();
                if (originalAnnouncement != null && !originalAnnouncement.getTitle().equals(updated.getTitle())) {
                    description += " (previously: " + originalAnnouncement.getTitle() + ")";
                }
                
                logRequest.setDescription(description);
                activityLogService.createActivityLog(logRequest, claims);
                
                return ResponseEntity.ok(updated);
            } else {
                return ResponseEntity.notFound().build();
            }
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
    
    // Delete announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Integer id, HttpServletRequest request) throws Exception {

        Claims claims = Authentication.getClaims(request);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            // Get the announcement for logging before deletion
            AnnouncementDTO announcement = announcementService.getAnnouncementById(id);
            
            boolean deleted = announcementService.deleteAnnouncement(id);
            if (deleted) {
                // Log the activity
                ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                logRequest.setActionType("DELETE");
                logRequest.setEntityType("ANNOUNCEMENT");
                logRequest.setEntityId(id.toString());
                
                String description = "Deleted announcement";
                if (announcement != null) {
                    description += ": " + announcement.getTitle();
                }
                
                logRequest.setDescription(description);
                activityLogService.createActivityLog(logRequest, claims);
                
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
    
    // Search announcements by title
    @GetMapping("/search")
    public ResponseEntity<List<AnnouncementDTO>> searchAnnouncements(@RequestParam String title) {
        return ResponseEntity.ok(announcementService.searchAnnouncementsByTitle(title));
    }

    // Get count of all announcements
    @GetMapping("/count")
    public ResponseEntity<Long> getAnnouncementCount() {
        return ResponseEntity.ok(announcementService.getAnnouncementCount());
    }
    
}