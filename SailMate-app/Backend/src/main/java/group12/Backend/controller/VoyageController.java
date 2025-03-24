package group12.Backend.controller;

import group12.Backend.dto.VoyageDTO;
import group12.Backend.service.VoyageService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/voyages")
@CrossOrigin(origins = "*")
public class VoyageController {

    @Autowired
    private VoyageService voyageService;
    
    // Get all voyages
    @GetMapping
    public ResponseEntity<List<VoyageDTO>> getAllVoyages() {
        return ResponseEntity.ok(voyageService.getAllVoyages());
    }
    
    // Get all future voyages
    @GetMapping("/future")
    public ResponseEntity<List<VoyageDTO>> getAllFutureVoyages() {
        return ResponseEntity.ok(voyageService.getAllFutureVoyages());
    }
    
    // Get voyage by ID
    @GetMapping("/{id}")
    public ResponseEntity<VoyageDTO> getVoyageById(@PathVariable Integer id) {
        VoyageDTO voyage = voyageService.getVoyageById(id);
        
        if (voyage != null) {
            return ResponseEntity.ok(voyage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Search voyages by route and date
    @GetMapping("/search")
    public ResponseEntity<List<VoyageDTO>> searchVoyages(
            @RequestParam Integer fromStationId,
            @RequestParam Integer toStationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate) {
            
        return ResponseEntity.ok(voyageService.findVoyages(fromStationId, toStationId, departureDate));
    }
    
    // Create a new voyage
    @PostMapping
    public ResponseEntity<VoyageDTO> createVoyage(@RequestBody VoyageDTO voyageDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(voyageService.createVoyage(voyageDTO));
    }
    
    // Update a voyage
    @PutMapping("/{id}")
    public ResponseEntity<VoyageDTO> updateVoyage(@PathVariable Integer id, @RequestBody VoyageDTO voyageDTO) {
        VoyageDTO updatedVoyage = voyageService.updateVoyage(id, voyageDTO);
        
        if (updatedVoyage != null) {
            return ResponseEntity.ok(updatedVoyage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Cancel a voyage
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelVoyage(@PathVariable Integer id) {
        boolean success = voyageService.cancelVoyage(id);
        Map<String, Object> response = new HashMap<>();
        
        if (success) {
            response.put("success", true);
            response.put("message", "Voyage cancelled successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Voyage not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    // Delete a voyage
    @PutMapping("/{id}/delete")
    public ResponseEntity<Map<String, Object>> deleteVoyage(@PathVariable Integer id) {
        boolean success = voyageService.deleteVoyage(id);
        Map<String, Object> response = new HashMap<>();
        
        if (success) {
            response.put("success", true);
            response.put("message", "Voyage marked as deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Voyage not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    // Generate voyages from templates
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateVoyages(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
            
        int generatedCount = voyageService.generateVoyages(startDate, endDate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("generatedCount", generatedCount);
        response.put("message", generatedCount + " voyages generated successfully");
        
        return ResponseEntity.ok(response);
    }
    
    // Check schedule health
    @GetMapping("/schedule-health")
    public ResponseEntity<Map<String, Object>> checkScheduleHealth() {
        boolean isHealthy = voyageService.checkScheduleHealth();
        
        Map<String, Object> response = new HashMap<>();
        response.put("healthy", isHealthy);
        
        if (isHealthy) {
            response.put("message", "Voyages are scheduled at least 3 months in advance");
        } else {
            response.put("message", "Voyages are not scheduled for the next 3 months");
        }
        
        return ResponseEntity.ok(response);
    }
    
    // Ensure schedule extends 3 months
    @PostMapping("/ensure-schedule")
    public ResponseEntity<Map<String, Object>> ensureThreeMonthSchedule() {
        int generatedCount = voyageService.ensureThreeMonthSchedule();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("generatedCount", generatedCount);
        
        if (generatedCount > 0) {
            response.put("message", generatedCount + " voyages generated to ensure 3-month schedule");
        } else {
            response.put("message", "Schedule already extends 3 months, no action taken");
        }
        
        return ResponseEntity.ok(response);
    }
}