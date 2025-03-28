package group12.Backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import group12.Backend.dto.AnnouncementDTO;
import group12.Backend.service.AnnouncementService;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins="*")
public class AnnouncementController {
    
    @Autowired
    private AnnouncementService announcementService;
    
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
    public ResponseEntity<AnnouncementDTO> createAnnouncement(@RequestBody AnnouncementDTO announcementDTO) {
        AnnouncementDTO created = announcementService.createAnnouncement(announcementDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    // Update announcement
    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> updateAnnouncement(
            @PathVariable Integer id, 
            @RequestBody AnnouncementDTO announcementDTO) {
        AnnouncementDTO updated = announcementService.updateAnnouncement(id, announcementDTO);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Integer id) {
        boolean deleted = announcementService.deleteAnnouncement(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
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