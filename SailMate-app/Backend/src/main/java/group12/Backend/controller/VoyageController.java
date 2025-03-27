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
    
    // Create multiple voyages at once
    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> createBulkVoyages(
            @RequestBody List<VoyageDTO> voyageDTOs) {
        int createdCount = voyageService.createBulkVoyages(voyageDTOs);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("createdCount", createdCount);
        response.put("message", createdCount + " voyages created successfully");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
    
    // Cancel voyages by route and date range
    @PutMapping("/cancel-by-route")
    public ResponseEntity<Map<String, Object>> cancelVoyagesByRoute(
            @RequestParam Integer fromStationId,
            @RequestParam Integer toStationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        int cancelledCount = voyageService.cancelVoyagesByRoute(fromStationId, toStationId, startDate, endDate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("cancelledCount", cancelledCount);
        response.put("message", cancelledCount + " voyages cancelled successfully");
        
        return ResponseEntity.ok(response);
    }
    
    // Delete a voyage (soft delete by marking as inactive)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteVoyage(@PathVariable Integer id) {
        boolean success = voyageService.deleteVoyage(id);
        Map<String, Object> response = new HashMap<>();
        
        if (success) {
            response.put("success", true);
            response.put("message", "Voyage deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Voyage not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    // Get voyages by date range
    @GetMapping("/by-date-range")
    public ResponseEntity<List<VoyageDTO>> getVoyagesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        return ResponseEntity.ok(voyageService.getVoyagesByDateRange(startDate, endDate));
    }
    
    // Get voyages by station
    @GetMapping("/by-station/{stationId}")
    public ResponseEntity<List<VoyageDTO>> getVoyagesByStation(
            @PathVariable Integer stationId,
            @RequestParam(required = false) Boolean isDeparture) {
        
        if (isDeparture != null && isDeparture) {
            return ResponseEntity.ok(voyageService.getVoyagesByDepartureStation(stationId));
        } else if (isDeparture != null && !isDeparture) {
            return ResponseEntity.ok(voyageService.getVoyagesByArrivalStation(stationId));
        } else {
            return ResponseEntity.ok(voyageService.getVoyagesByStation(stationId));
        }
    }

    @GetMapping("/count-active")
    public ResponseEntity<Integer> countActiveVoyages() {
        int count = voyageService.countActiveVoyages();
        return ResponseEntity.ok(count);
    }
}